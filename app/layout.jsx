import { Playfair_Display, Open_Sans } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { AppProvider } from "@/components/context/AppContext";
import CartSidebar from "@/components/cart/CartSidebar";
import Preloader from "@/components/shared/Preloader";
import "./globals.css";
import ReactQueryProvider from "../components/providers/QueryProvider";
import ScrollToTop from "../components/scrollToTop/ScrollToTop";
import ChatModal from "../components/shared/ChatModal";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Talukdar - Luxury Bathrooms & Kitchens",
  description:
    "Transform your spaces with premium bathrooms and kitchens by Talukdar. Luxury design meets craftsmanship.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${openSans.variable} antialiased bg-white dark:bg-[#060b20] transition-colors duration-300 relative`}
      >
        <ReactQueryProvider>
          <AppProvider>
            <ScrollToTop />
            <Preloader />
            <Navbar />
            {children}
            <Footer />
            <ChatModal />
            <CartSidebar />
          </AppProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
