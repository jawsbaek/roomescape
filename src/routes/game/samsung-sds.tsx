import { SamsungSDSEscape } from "@/components/game/SamsungSDSEscape";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/game/samsung-sds")({
  component: SamsungSDSGameComponent,
});

function SamsungSDSGameComponent() {
  return <SamsungSDSEscape />;
}
