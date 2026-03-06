import { redirect } from "next/navigation";

export default function DashboardRoleRoot() {
  redirect("./leaves");
  return null;
}
