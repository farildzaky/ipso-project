import MainFooter from "./_components/MainFooter";
import MainHeader from "./_components/MainHeader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainHeader />
      <main className="min-h-screen bg-gray-50">{children}</main>
      <MainFooter />
    </>
  );
}
