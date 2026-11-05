import { createFileRoute } from "@tanstack/react-router";
import { FaithQuiz } from "../components/FaithQuiz";
import { SafeBoundary } from "../components/SafeBoundary";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Message From Archangel Michael | Plan Faith" },
      {
        name: "description",
        content:
          "Take the guided faith journey with Archangel Michael and receive your personalized inspirational Manifestation Script.",
      },
      {
        property: "og:title",
        content: "A Message From Archangel Michael | Plan Faith",
      },
      {
        property: "og:description",
        content:
          "Take the guided faith journey with Archangel Michael and receive your personalized inspirational Manifestation Script.",
      },
      {
        property: "og:image",
        content: "/og-image.png",
      },
      {
        name: "twitter:title",
        content: "A Message From Archangel Michael | Plan Faith",
      },
      {
        name: "twitter:description",
        content:
          "Take the guided faith journey with Archangel Michael and receive your personalized inspirational Manifestation Script.",
      },
      {
        name: "twitter:image",
        content: "/og-image.png",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SafeBoundary name="FaithQuiz-Index">
      <FaithQuiz />
    </SafeBoundary>
  );
}
