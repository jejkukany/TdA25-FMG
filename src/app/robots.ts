import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*", // Allows all crawlers
        allow: "/", // Grants access to all pages
      },
    ],
    sitemap: "https://13682ac4.app.deploy.tourde.app/sitemap.ts", // Link to your sitemap
  };
}