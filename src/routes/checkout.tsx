import { createFileRoute } from "@tanstack/react-router";
import { FaithCheckout } from "../components/FaithCheckout";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Plan Faith" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  return <FaithCheckout />;
}
