import NavbarSPA from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <NavbarSPA />
        {children}
      </body>
    </html>
  );
}