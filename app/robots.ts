import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/mc-portal/", "/admin/"],
      },
    ],
    sitemap: "https://bloodbank.appstick.com.bd/sitemap.xml",
    host: "https://bloodbank.appstick.com.bd",
  };
}
