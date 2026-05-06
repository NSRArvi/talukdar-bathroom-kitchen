"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetData } from "../../components/helpers/useGetData";
import { useApp } from "@/components/context/AppContext";
import ShopSidebar from "@/components/shop/ShopSidebar";
import ShopTopbar from "@/components/shop/ShopTopbar";
import ShopProducts from "@/components/shop/ShopProducts";

export default function ShopPage() {
  const { shopFilters, setShopFilters } = useApp();
  const [filters, setFilters] = useState({
    search: "",
    category_ids: [],
    brand_id: "",
    orderByPrice: "0",
    lowest_price: "",
    highest_price: "",
    page: 1,
    rows: 12,
  });

  // Apply shopFilters from context on mount
  useEffect(() => {
    if (shopFilters) {
      setFilters(shopFilters);
      // Clear the context filters after applying
      setShopFilters(null);
    }
  }, [shopFilters, setShopFilters]);

  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // fetch data triggered automatically whenever filters changes
  const { data: productsData, isLoading } = useGetData("products", filters);
  const products = productsData?.data;
  const meta = productsData?.meta;

  return (
    <div className="min-h-screen font-[Raleway] pt-20 dark:bg-brand-navy">
      <header className="relative h-55 overflow-hidden sm:h-65">
        <Image
          src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400&q=90"
          alt="Bathroom"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-[0.4]"
          quality={90}
        />
        <div className="absolute inset-0 bg-linear-to-br from-brand-navy/70 to-brand-gold/45" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center font-[Playfair_Display] text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl"
          >
            Bathroom Collections
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-white/80 sm:text-sm"
          >
            <span>Home</span>
            <ChevronRight size={13} />
            <span>Bathrooms</span>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <ShopTopbar
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setIsMobileFiltersOpen={setIsMobileFiltersOpen}
        />

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="hidden lg:block w-70 shrink-0 sticky top-24">
            <ShopSidebar filters={filters} setFilters={setFilters} />
          </div>

          <ShopProducts
            products={products}
            meta={meta}
            isLoading={isLoading}
            viewMode={viewMode}
            filters={filters}
            setFilters={setFilters}
          />
        </div>
      </main>

      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              aria-label="Close filters"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed right-0 top-0 z-50 flex h-dvh w-[88%] max-w-sm flex-col bg-white shadow-2xl dark:bg-[#0a0f2e] lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-[#1c2444]">
                <h2 className="text-base font-bold text-brand-navy dark:text-brand-pale">
                  Filter Products
                </h2>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="rounded-md p-2 text-slate-600 transition hover:bg-gray-100 hover:text-slate-900 dark:text-[#9fa8cc] dark:hover:bg-[#11193a] dark:hover:text-white"
                  aria-label="Close filter drawer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6">
                <ShopSidebar filters={filters} setFilters={setFilters} />
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-gray-200 p-4 dark:border-[#1c2444]">
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white shadow-md w-full col-span-2"
                >
                  View and Close Filters
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
