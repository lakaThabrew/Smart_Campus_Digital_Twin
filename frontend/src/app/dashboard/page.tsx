import DigitalTwinDashboard from "@/components/DigitalTwinDashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const sessionCookie =
    cookieStore.get("session") ??
    cookieStore.get("auth-token") ??
    cookieStore.get("token");

  if (!sessionCookie?.value) {
    redirect("/login");
  }

  return <DigitalTwinDashboard />;
}
