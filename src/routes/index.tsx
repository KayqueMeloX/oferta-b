import { createFileRoute } from "@tanstack/react-router";
import { FaithQuiz } from "../components/FaithQuiz";
import { SafeBoundary } from "../components/SafeBoundary";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
        name: "twitter:title",
        content: "A Message From Archangel Michael | Plan Faith",
      },
      {
        name: "twitter:description",
        content:
          "Take the guided faith journey with Archangel Michael and receive your personalized inspirational Manifestation Script.",
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
