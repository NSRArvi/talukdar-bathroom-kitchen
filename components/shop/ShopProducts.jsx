"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import ProductListCard from "@/components/products/ProductListCard";
import ProductCardSkeleton from "@/components/products/ProductCardSkeleton";
import ProductListCardSkeleton from "@/components/products/ProductListCardSkeleton";

export default function ShopProducts({
  products,
  meta,
  isLoading,
  viewMode,
  filters,
  setFilters,
}) {
  const handlePageChange = (page) => {
    if (page < 1 || page > meta.last_page) return;
    setFilters((prev) => ({ ...prev, page }));
  };

  const currentProducts = products || [];

  return (
    <div className="flex-1 w-full max-w-full lg:max-w-[75%] space-y-6">
      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: filters.rows }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductListCardSkeleton key={index} />
            ))}
          </div>
        )
      ) : (
        <>
          {currentProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-16 text-center text-sm text-slate-600 dark:border-[#2a3460] dark:bg-[#0a0f2e] dark:text-[#9fa8cc]">
              <p className="text-lg font-semibold text-slate-700 dark:text-brand-pale">
                No products found
              </p>
              <p className="max-w-md">
                Try adjusting your search criteria, categories, or price filters to
                find what you&apos;re looking for.
              </p>
              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    category_ids: [],
                    brand_id: "",
                    orderByPrice: "0",
                    lowest_price: "",
                    highest_price: "",
                    page: 1,
                    rows: 12,
                  })
                }
                className="mt-4 rounded-lg bg-brand-navy px-6 py-2.5 font-semibold text-white shadow-md transition hover:bg-[#1a2340]"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {currentProducts.map((p, index) => (
                  <ProductCard key={index} p={p} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {currentProducts.map((p, index) => (
                  <ProductListCard key={index} p={p} />
                ))}
              </div>
            )
          )}

          {/* Desktop Pagination */}
          {!isLoading && meta && meta.last_page > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(meta.current_page - 1)}
                disabled={meta.current_page === 1}
                className="flex items-center gap-1 rounded-lg border border-gray-300 p-2 text-slate-600 transition hover:border-slate-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#2a3460] dark:text-brand-pale dark:hover:border-[#3a4876] dark:hover:bg-[#11193a]"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
                  (page) => {
                    const isNearCurrent = Math.abs(page - meta.current_page) <= 2;
                    const isEnd = page === 1 || page === meta.last_page;
                    
                    if (!isNearCurrent && !isEnd) {
                      if (page === 2 || page === meta.last_page - 1) {
                        return <span key={page} className="px-2">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        className={`min-w-10 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                          meta.current_page === page
                            ? "bg-brand-navy text-white shadow-md"
                            : "border border-gray-300 text-slate-600 hover:border-slate-400 hover:bg-gray-100 dark:border-[#2a3460] dark:text-brand-pale dark:hover:border-[#3a4876] dark:hover:bg-[#11193a]"
                        }`}
                        aria-label={`Go to page ${page}`}
                        aria-current={meta.current_page === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(meta.current_page + 1)}
                disabled={meta.current_page === meta.last_page}
                className="flex items-center gap-1 rounded-lg border border-gray-300 p-2 text-slate-600 transition hover:border-slate-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#2a3460] dark:text-brand-pale dark:hover:border-[#3a4876] dark:hover:bg-[#11193a]"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
