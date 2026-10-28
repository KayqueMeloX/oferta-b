import { createFileRoute } from "@tanstack/react-router";
import { FaithOffer } from "../components/FaithOffer";

export const Route = createFileRoute("/offer")({
  head: () => ({
    meta: [
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
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/lovp_26x6kh4q7w808tewdws371pw9j/fdc7389913d207e214e042afa362cbc8_1793064005836.png",
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
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/lovp_26x6kh4q7w808tewdws371pw9j/fdc7389913d207e214e042afa362cbc8_1793064005836.png",
      },
    ],
  }),
  component: OfferPage,
});

function OfferPage() {
  return <FaithOffer />;
}
