import { createFileRoute } from "@tanstack/react-router";
import { FaithQuiz } from "../components/FaithQuiz";

export const Route = createFileRoute("/quiz")({
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
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/lovp_26x6kh4q7w808tewdws371pw9j/fdc7389913d207e214e042afa362cbc8_1793064005836.png",
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
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/lovp_26x6kh4q7w808tewdws371pw9j/fdc7389913d207e214e042afa362cbc8_1793064005836.png",
      },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  return <FaithQuiz />;
}
