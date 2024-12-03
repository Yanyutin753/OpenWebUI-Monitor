import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenWebUI Monitor",
    short_name: "OpenWebUI",
    description: "OpenWebUI Monitor - A monitoring system for OpenAI API usage",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/static/favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
