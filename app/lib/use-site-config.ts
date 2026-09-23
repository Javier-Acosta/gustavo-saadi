"use client";

import { useEffect, useState } from "react";
import { defaultConfig, mergeSiteConfig, SiteConfig } from "@/app/lib/site-config";

function getStoredConfig() {
  if (typeof window === "undefined") {
    return defaultConfig;
  }

  const stored = window.localStorage.getItem("candidate-site-config");
  if (!stored) {
    return defaultConfig;
  }

  try {
    return mergeSiteConfig(JSON.parse(stored) as Partial<SiteConfig>);
  } catch {
    return defaultConfig;
  }
}

export function useSiteConfig() {
  const [config, setConfig] = useState(getStoredConfig);

  useEffect(() => {
    let ignore = false;

    async function loadConfig() {
      try {
        const response = await fetch("/api/site-config", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Config request failed.");
        }

        const nextConfig = mergeSiteConfig(await response.json());
        if (!ignore) {
          setConfig(nextConfig);
          window.localStorage.setItem("candidate-site-config", JSON.stringify(nextConfig));
        }
      } catch {
        if (!ignore) {
          setConfig(getStoredConfig());
        }
      }
    }

    void loadConfig();

    return () => {
      ignore = true;
    };
  }, []);

  return config;
}
