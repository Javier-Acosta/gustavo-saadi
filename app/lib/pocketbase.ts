import { defaultConfig, mergeSiteConfig, SiteConfig } from "./site-config";

type PocketBaseAuthResponse = {
  token: string;
};

type PocketBaseListResponse<T> = {
  items: T[];
};

type SiteConfigRecord = {
  id: string;
  key: string;
  value: SiteConfig;
};

const collectionName = "site_config";
const configKey = "main";

function getPocketBaseEnv() {
  const url = process.env.POCKETBASE_URL;
  const email = process.env.POCKETBASE_ADMIN_EMAIL;
  const password = process.env.POCKETBASE_ADMIN_PASSWORD;

  if (!url || !email || !password) {
    throw new Error("PocketBase environment variables are missing.");
  }

  return {
    url: url.replace(/\/$/, "").replace(/\/_$/, "").replace(/\/api$/, ""),
    email,
    password,
  };
}

async function pocketBaseFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { url } = getPocketBaseEnv();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${url}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PocketBase request failed (${response.status}): ${text}`);
  }

  return response.json() as Promise<T>;
}

async function authenticateAdmin() {
  const { email, password } = getPocketBaseEnv();
  const body = JSON.stringify({ identity: email, password });
  const authPaths = [
    "/api/admins/auth-with-password",
    "/api/collections/_superusers/auth-with-password",
    "/api/_superusers/auth-with-password",
  ];

  let lastError: unknown;

  for (const path of authPaths) {
    try {
      const auth = await pocketBaseFetch<PocketBaseAuthResponse>(path, {
        method: "POST",
        body,
      });
      return auth.token;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function findConfigRecord(token: string) {
  const filter = encodeURIComponent(`key="${configKey}"`);
  const list = await pocketBaseFetch<PocketBaseListResponse<SiteConfigRecord>>(
    `/api/collections/${collectionName}/records?filter=${filter}&perPage=1`,
    { token },
  );

  return list.items[0] ?? null;
}

export async function getSiteConfig() {
  const token = await authenticateAdmin();
  const record = await findConfigRecord(token);

  if (!record) {
    return defaultConfig;
  }

  return mergeSiteConfig(record.value);
}

export async function saveSiteConfig(config: SiteConfig) {
  const token = await authenticateAdmin();
  const record = await findConfigRecord(token);
  const body = JSON.stringify({ key: configKey, value: mergeSiteConfig(config) });

  if (record) {
    const updated = await pocketBaseFetch<SiteConfigRecord>(
      `/api/collections/${collectionName}/records/${record.id}`,
      {
        method: "PATCH",
        body,
        token,
      },
    );

    return mergeSiteConfig(updated.value);
  }

  const created = await pocketBaseFetch<SiteConfigRecord>(
    `/api/collections/${collectionName}/records`,
    {
      method: "POST",
      body,
      token,
    },
  );

  return mergeSiteConfig(created.value);
}
