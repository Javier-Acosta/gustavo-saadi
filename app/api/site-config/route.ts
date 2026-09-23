import { NextResponse } from "next/server";
import { getSiteConfig, saveSiteConfig } from "@/app/lib/pocketbase";
import { mergeSiteConfig } from "@/app/lib/site-config";

export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo leer la configuracion del sitio." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const config = await saveSiteConfig(mergeSiteConfig(payload));
    return NextResponse.json(config);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo guardar la configuracion del sitio." },
      { status: 500 },
    );
  }
}
