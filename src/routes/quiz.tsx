import { createFileRoute } from "@tanstack/react-router";
import { FaithQuiz } from "../components/FaithQuiz";
import { SafeBoundary } from "../components/SafeBoundary";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Your Guided Faith Quiz | Plan Faith" },
      {
        name: "description",
        content:
          "Complete your guided faith quiz with Archangel Michael to prepare your personalized inspirational Manifestation Script.",
      },
      {
        property: "og:title",
        content: "Your Guided Faith Quiz | Plan Faith",
      },
      {
        property: "og:description",
        content:
          "Complete your guided faith quiz with Archangel Michael to prepare your personalized inspirational Manifestation Script.",
      },
      {
        name: "twitter:title",
        content: "Your Guided Faith Quiz | Plan Faith",
      },
      {
        name: "twitter:description",
        content:
          "Complete your guided faith quiz with Archangel Michael to prepare your personalized inspirational Manifestation Script.",
      },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  return (
    <SafeBoundary name="FaithQuiz-QuizPage">
      <FaithQuiz />
    </SafeBoundary>
  );
}
