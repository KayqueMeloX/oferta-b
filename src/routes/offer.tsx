import { createFileRoute } from "@tanstack/react-router";
import { FaithOffer } from "../components/FaithOffer";

export const Route = createFileRoute("/offer")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Your Divine Manifestation Script Is Ready | Plan Faith" },
      {
        name: "description",
        content:
          "Watch the message, then choose your Seed of Faith to receive your personalized inspirational Script and the Faith & Abundance Blueprint.",
      },
      {
        property: "og:title",
        content: "Your Divine Manifestation Script Is Ready | Plan Faith",
      },
      {
        property: "og:description",
        content:
          "Watch the message, then choose your Seed of Faith to receive your personalized inspirational Script and the Faith & Abundance Blueprint.",
      },
      {
        name: "twitter:title",
        content: "Your Divine Manifestation Script Is Ready | Plan Faith",
      },
      {
        name: "twitter:description",
        content:
          "Watch the message, then choose your Seed of Faith to receive your personalized inspirational Script and the Faith & Abundance Blueprint.",
      },
    ],
  }),
  component: OfferPage,
});

function OfferPage() {
  return <FaithOffer />;
}
