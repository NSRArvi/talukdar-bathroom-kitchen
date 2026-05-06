"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/components/context/AppContext";

export default function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef(null);
  const { isDark, authToken } = useApp();

  // Debounce search function
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Set new timer for debounce (500ms)
    debounceTimer.current = setTimeout(async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_TALUKDAR_API_BASE_URL;
        const response = await fetch(
          `${baseUrl}products?search=${encodeURIComponent(query)}&rows=10`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(authToken && { Authorization: `Bearer ${authToken}` }),
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSearchResults(data?.data || []);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [authToken]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener("keydown", handleEscKey);
    }
    
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen]);

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    onClose();
  };

  const handleProductClick = () => {
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-[100] bg-black/50 dark:bg-black/70"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full mx-auto mt-20 px-4"
          >
            {/* Search Input */}
            <div className={`relative rounded-lg shadow-lg overflow-hidden ${isDark ? "bg-[#0a0f2e]" : "bg-white"}`}>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-[#1c2444]">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products... (Cmd+K)"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                  className={`flex-1 outline-none bg-transparent text-base ${
                    isDark ? "text-brand-pale placeholder-gray-600" : "text-brand-navy placeholder-gray-400"
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-[#1a2340] rounded"
                  >
                    <X size={18} className={isDark ? "text-gray-400" : "text-gray-600"} />
                  </button>
                )}
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader size={24} className={`animate-spin ${isDark ? "text-brand-pale" : "text-brand-navy"}`} />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-[#1c2444]">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={handleProductClick}
                        className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-[#1a2340] transition-colors`}
                      >
                        {/* Product Image */}
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-[#1c2444] overflow-hidden">
                          {product.thumbnail_image ? (
                            <Image
                              src={product.thumbnail_image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center text-xs ${isDark ? "text-gray-600" : "text-gray-300"}`}>
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold truncate ${isDark ? "text-brand-pale" : "text-brand-navy"}`}>
                            {product.name}
                          </h3>
                          
                          {/* Price */}
                          <div className="flex items-center gap-2 mt-1 flex-wrap text-sm">
                            {(() => {
                              const variant = product.variants?.[0];
                              const discountPrice = variant?.discount?.discount_price;
                              const basePrice = variant?.price || product.base_price || product.price;

                              return discountPrice ? (
                                <>
                                  <span className="font-semibold text-brand-navy dark:text-[#f0ebe3]">
                                    ${discountPrice}
                                  </span>
                                  <span className="text-xs font-medium text-slate-400 line-through decoration-slate-400 dark:text-slate-500">
                                    ${basePrice}
                                  </span>
                                </>
                              ) : (
                                <span className="font-semibold text-brand-navy dark:text-[#f0ebe3]">
                                  ${basePrice}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.trim().length >= 2 ? (
                  <div className={`py-8 text-center ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    <p className="text-sm">No products found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className={`py-8 text-center ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    <p className="text-sm">Type at least 2 characters to search</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
