import { readFileSync } from "node:fs";

const collectionName = "site_config";
const configKey = "main";

const defaultConfig = {
  candidateName: "Gustavo Saadi",
  slogan: "Catamarca con trabajo, cercania e igualdad de oportunidades.",
  logoUrl: "/gustavo-saadi-logo.svg",
  bannerVideoUrl: "",
  footerReelUrl: "",
  instagramSectionEyebrow: "Momentos de la gestion",
  instagramSectionTitle: "En Instagram",
  videos: [
    {
      title: "Mensaje de campana",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      title: "Propuestas para vecinos",
      youtubeUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    },
  ],
  news: [
    {
      title: "Recorrida por el centro comercial",
      date: "22 Sep 2026",
      summary:
        "El equipo presento medidas para simplificar tramites y acompanar a comerciantes locales.",
      body:
        "Durante la recorrida se relevaron las principales necesidades del sector comercial y se presentaron propuestas para mejorar la atencion municipal, simplificar tramites y fortalecer la actividad economica local.",
      imageUrl: "/gustavo-saadi.png",
    },
    {
      title: "Nuevo plan de seguridad barrial",
      date: "19 Sep 2026",
      summary:
        "La propuesta combina iluminacion, prevencion y coordinacion directa con instituciones vecinales.",
      body:
        "El plan propone reforzar la iluminacion, mejorar la coordinacion territorial y trabajar con instituciones vecinales para prevenir conflictos y acercar respuestas concretas a cada barrio.",
      imageUrl: "/gustavo-saadi.png",
    },
  ],
  instagramReels: [
    {
      title: "Veni al encuentro de las palabras",
      url: "https://www.instagram.com/",
      imageUrl: "/gustavo-saadi.png",
      dateText: "",
    },
  ],
  socials: [
    { name: "Instagram", url: "https://instagram.com", logo: "IG" },
    { name: "Facebook", url: "https://facebook.com", logo: "FB" },
    { name: "YouTube", url: "https://youtube.com", logo: "YT" },
  ],
};

function loadEnv() {
  const envFile = readFileSync(".env.local", "utf8");

  for (const line of envFile.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const index = trimmed.indexOf("=");
    if (index === -1) {
      continue;
    }

    const key = trimmed.slice(0, index);
    const value = trimmed.slice(index + 1).replace(/^['"]|['"]$/g, "");
    process.env[key] ??= value;
  }
}

function getEnv() {
  loadEnv();

  const url = process.env.POCKETBASE_URL;
  const email = process.env.POCKETBASE_ADMIN_EMAIL;
  const password = process.env.POCKETBASE_ADMIN_PASSWORD;

  if (!url || !email || !password) {
    throw new Error("Missing PocketBase environment variables.");
  }

  return {
    url: url.replace(/\/$/, "").replace(/\/_$/, "").replace(/\/api$/, ""),
    email,
    password,
  };
}

async function request(path, options = {}) {
  const { url } = getEnv();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${url}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    const error = new Error(`Request failed: ${response.status} ${text}`);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function authenticate() {
  const { email, password } = getEnv();
  const body = JSON.stringify({ identity: email, password });
  const paths = [
    "/api/admins/auth-with-password",
    "/api/collections/_superusers/auth-with-password",
    "/api/_superusers/auth-with-password",
  ];
  let lastError;

  for (const path of paths) {
    try {
      const auth = await request(path, { method: "POST", body });
      return auth.token;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function getCollection(token) {
  try {
    return await request(`/api/collections/${collectionName}`, { token });
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

async function createCollection(token) {
  const payloads = [
    {
      name: collectionName,
      type: "base",
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: "key", type: "text", required: true },
        { name: "value", type: "json", required: true },
      ],
      indexes: [`CREATE UNIQUE INDEX idx_${collectionName}_key ON ${collectionName} (key)`],
    },
    {
      name: collectionName,
      type: "base",
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      schema: [
        {
          name: "key",
          type: "text",
          required: true,
          options: { min: null, max: null, pattern: "" },
        },
        {
          name: "value",
          type: "json",
          required: true,
          options: { maxSize: 2000000 },
        },
      ],
      indexes: [`CREATE UNIQUE INDEX idx_${collectionName}_key ON ${collectionName} (key)`],
    },
  ];

  let lastError;

  for (const payload of payloads) {
    try {
      return await request("/api/collections", {
        method: "POST",
        body: JSON.stringify(payload),
        token,
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function findRecord(token) {
  const filter = encodeURIComponent(`key="${configKey}"`);
  const list = await request(
    `/api/collections/${collectionName}/records?filter=${filter}&perPage=1`,
    { token },
  );
  return list.items?.[0] ?? null;
}

async function seedRecord(token) {
  const record = await findRecord(token);
  const body = JSON.stringify({ key: configKey, value: defaultConfig });

  if (record) {
    await request(`/api/collections/${collectionName}/records/${record.id}`, {
      method: "PATCH",
      body,
      token,
    });
    console.log("PocketBase site_config record updated.");
    return;
  }

  await request(`/api/collections/${collectionName}/records`, {
    method: "POST",
    body,
    token,
  });
  console.log("PocketBase site_config record created.");
}

const token = await authenticate();
const collection = await getCollection(token);

if (collection) {
  console.log("PocketBase site_config collection already exists.");
} else {
  await createCollection(token);
  console.log("PocketBase site_config collection created.");
}

await seedRecord(token);
