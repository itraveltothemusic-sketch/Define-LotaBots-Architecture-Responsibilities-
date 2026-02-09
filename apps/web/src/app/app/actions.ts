import { redirect } from "next/navigation";
import { clearSessionCookie } from "@/lib/auth/session";

export async function logoutAction() {
  "use server";
  await clearSessionCookie();
  redirect("/");
}

