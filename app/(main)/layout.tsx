// app/(main)/layout.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import MainHeader from "./_components/MainHeader";
import MainFooter from "./_components/MainFooter";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        <MainHeader />
        <main className="flex-1">{children}</main>
        <MainFooter />
      </div>
    </SessionProvider>
  );
}