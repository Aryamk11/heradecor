// app/layout.tsx
import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./scss/styles.scss"; // Your global styles

export const metadata: Metadata = {
  title: "فروشگاه آنلاین هرا دکور",
  description: "زیبایی را به خانه خود بیاورید",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Header />
        <main className="container my-5">
          {children}
        </main>
        <Footer />
        {/* Bootstrap JS needs to be included for dropdowns, etc. */}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossOrigin="anonymous" async></script>
      </body>
    </html>
  );
}