// app/layout.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { Vazirmatn } from 'next/font/google';
import Header from "./components/Header";
import Footer from "./components/Footer";
import BootstrapClient from "./components/BootstrapClient";
import NavigationProgress from "./components/NavigationProgress";
import { fetchCategories } from "./lib/product-service";
import "./scss/styles.scss";
import 'bootstrap-icons/font/bootstrap-icons.css';

const vazirmatn = Vazirmatn({ subsets: ['arabic'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: "فروشگاه آنلاین هرا دکور",
    template: "%s | هرا دکور",
  },
  description: "زیبایی را به خانه خود بیاورید",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await fetchCategories();

  return (
    <html lang="fa" dir="rtl" className={vazirmatn.className} data-scroll-behavior="smooth">
      <body className="d-flex flex-column min-vh-100">
        {/* Both read useSearchParams, which needs a boundary to keep the rest of
            the tree statically renderable. */}
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <Suspense fallback={null}>
          <Header categories={categories} />
        </Suspense>
        <main className="container my-5 flex-grow-1">
          {children}
        </main>
        <Footer />
        <BootstrapClient />
      </body>
    </html>
  );
}
