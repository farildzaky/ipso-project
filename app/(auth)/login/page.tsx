// app/(auth)/login/page.tsx
import LoginForm from "../_components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Login — EcoBite" };

export default function LoginPage() {
  return <LoginForm />;
}