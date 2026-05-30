import { redirect } from "next/navigation";

export default function DashboardPage() {
  const role = "pengasuh";

  if (role === "pengasuh") {
    redirect("/dashboard/pengasuh");
  }

  if (role === "orang_tua") {
    redirect("/dashboard/orang-tua");
  }

  redirect("/masuk");
}   