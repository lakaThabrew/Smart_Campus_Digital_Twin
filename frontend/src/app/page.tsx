import DigitalTwinDashboard from "@/components/DigitalTwinDashboard";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Page() {
  return (
    <ErrorBoundary>
      <DigitalTwinDashboard />
    </ErrorBoundary>
  );
}
