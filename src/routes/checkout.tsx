import { createFileRoute, redirect } from "@tanstack/react-router";
import { getPaymentUrl } from "../config/payment";

export const Route = createFileRoute("/checkout")({
  beforeLoad: ({ search }: { search: Record<string, string> }) => {
    const plan = search?.plan;
    if (plan) {
      const url = getPaymentUrl(plan);
      if (typeof window !== "undefined") {
        window.location.href = url;
      }
    }
    throw redirect({ to: "/offer" });
  },
  component: () => null,
});
