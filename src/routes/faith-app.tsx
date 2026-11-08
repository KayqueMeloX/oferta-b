import { createFileRoute } from "@tanstack/react-router";
import { FaithApp } from "../components/FaithApp";

export const Route = createFileRoute("/faith-app")({
  head: () => ({
    meta: [
      { property: "og:title", content: "Members Area | Plan Faith" },
      { property: "og:description", content: "Access your Faith & Abundance materials, prayer audios, and daily declarations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Members Area | Plan Faith" },
      {
        name: "description",
        content:
          "Access your Faith & Abundance materials, prayer audios, and daily declarations.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: FaithAppPage,
});

function FaithAppPage() {
  return <FaithApp />;
}
