import { createFileRoute } from "@tanstack/react-router";
import { FaithApp } from "../components/FaithApp";

export const Route = createFileRoute("/faith-app")({
  head: () => ({
    meta: [
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
