import NavbarSPA from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body style={{ paddingBottom: '60px' }}>
        {/* paddingBottom: footerとpage.tsxがかぶらないように */}
        <NavbarSPA />
        {children}
        <Footer />
      </body>
    </html>
  );
}