import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://bloodbank.appstick.com.bd";
  const now = new Date();

  const pages = [
    { path: "", priority: 1.0, freq: "daily" as const },
    { path: "/blood-inventory", priority: 0.9, freq: "daily" as const },
    { path: "/voluntary-donors", priority: 0.9, freq: "daily" as const },
    { path: "/emergency-sos", priority: 0.9, freq: "daily" as const },
    { path: "/smart-proximity", priority: 0.8, freq: "weekly" as const },
    { path: "/blood-compatibility-matrix", priority: 0.8, freq: "weekly" as const },
    { path: "/donor-eligibility", priority: 0.8, freq: "weekly" as const },
    { path: "/donor-cooldown", priority: 0.8, freq: "weekly" as const },
    { path: "/direct-connect", priority: 0.7, freq: "weekly" as const },
    { path: "/emergency-protocol", priority: 0.7, freq: "weekly" as const },
    { path: "/donation-recovery", priority: 0.7, freq: "monthly" as const },
    { path: "/safe-transfusion", priority: 0.7, freq: "monthly" as const },
    { path: "/guides", priority: 0.7, freq: "weekly" as const },
  ];

  return pages.map((p) => ({
    url: `${baseUrl}${p.path}`,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));
}
