// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { Vazirmatn } from 'next/font/google'; // Import the font
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./scss/styles.scss";
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

// Configure the font
const vazirmatn = Vazirmatn({ subsets: ['arabic'] });

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
    // Apply the font className to the html tag
  <html lang="fa" dir="rtl" className={vazirmatn.className} data-scroll-behavior="smooth">
      <body>
        <Header />
        <main className="container my-5">
          {children}
        </main>
        <Footer />
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}