"use client";

import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";

export default function ShopTopbar({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  setIsMobileFiltersOpen,
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#1c2444] dark:bg-[#0a0f2e]">
      {/* Left Side */}
      <div className="flex items-center gap-3">
        {/* Filters Button - Mobile Only */}
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-gray-100 dark:border-[#1c2444] dark:bg-[#11193a] dark:text-[#9fa8cc] dark:hover:bg-[#1a2340] dark:hover:text-white lg:hidden"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>

        {/* View Mode Toggle - Desktop Only */}
        <div className="hidden lg:flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-[#1c2444] dark:bg-[#11193a] sm:gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center rounded-md p-2 transition ${
              viewMode === "grid"
                ? "bg-brand-navy text-white shadow"
                : "text-slate-500 hover:text-slate-900 dark:text-[#5a6591] dark:hover:text-white"
            }`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center rounded-md p-2 transition ${
              viewMode === "list"
                ? "bg-brand-navy text-white shadow"
                : "text-slate-500 hover:text-slate-900 dark:text-[#5a6591] dark:hover:text-white"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Right Side - Sort */}
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-[#9fa8cc]">
        <span className="hidden sm:inline">Sort by:</span>
        <select
          value={filters.orderByPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, orderByPrice: e.target.value, page: 1 }))
          }
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium outline-none transition hover:border-gray-400 dark:border-[#2a3460] dark:bg-[#11193a] dark:text-brand-pale sm:px-4"
        >
          <option value="0">Default</option>
          <option value="1">Price: Low to High</option>
          <option value="2">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
