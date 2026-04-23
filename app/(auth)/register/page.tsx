// app/(auth)/register/page.tsx
import RegisterForm from "../_components/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Register — EcoBite" };

export default function RegisterPage() {
  return <RegisterForm />;
}