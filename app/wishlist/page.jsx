"use client";

import { motion } from "framer-motion";
import { useApp } from "@/components/context/AppContext";
import PrivateRoute from "@/components/route/PrivateRoute";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingCart } from "lucide-react";

export default function WishlistPage() {
  const {
    wishlistItems,
    isWishlistLoading,
    removeFromWishlist,
    addToCartDBGuest,
  } = useApp();

  function handleAddToCart(p, wishlist_id) {
    addToCartDBGuest(
      p?.variants?.[0]?.product_variant_id || p?.product_variant_id,
      1,
      "increment",
    );
    removeFromWishlist(wishlist_id);
  }

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-linear-to-br from-[#f7f2ea] via-[#fbfaf8] to-[#efe6d8] dark:bg-linear-to-br dark:from-[#050a20] dark:via-[#070e2d] dark:to-[#0b153d] px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.24em] uppercase text-brand-navy dark:text-[#f0ebe3]">
                Your Collection
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-semibold text-brand-gold dark:text-[#f0ebe3]">
                My Wishlist
              </h1>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold text-brand-gold hover:text-brand-navy transition-colors dark:hover:text-white"
            >
              Continue Shopping →
            </Link>
          </div>

          {isWishlistLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !wishlistItems?.length ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-[#0d1435]/80 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/70 dark:border-white/10"
            >
              <div className="w-20 h-20 bg-brand-pale/50 dark:bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="w-10 h-10 text-brand-gold" />
              </div>
              <h2 className="text-2xl font-bold text-brand-navy dark:text-[#f0ebe3] mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                Save your favorite bathroom and kitchen items here to easily
                find them later or add them to your cart.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold text-white bg-brand-navy hover:bg-brand-gold hover:-translate-y-0.5 transition-all hover:shadow-brand-gold/30"
              >
                Discover Products
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {wishlistItems.map((item, i) => {
                const p = item.product || item;
                const defaultVariant = p?.variants?.[0] || p;
                const basePrice = defaultVariant?.price || p?.base_price;
                const discountPrice = defaultVariant?.discount?.discount_price;

                return (
                  <motion.div
                    key={item.wishlist_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex bg-white dark:bg-[#0a0f2e] rounded overflow-hidden border border-gray-100 h-full dark:border-[#1c2444] group"
                  >
                    <div className="w-1/3 overflow-hidden">
                      <Image
                        src={p?.thumbnail_image || p?.image}
                        alt={p?.name || p?.variant_name}
                        className="h-full transition-transform duration-500 group-hover:scale-105 rounded-l object-cover w-full group-hover:scale-105 transition-all duration-300"
                        width={200}
                        height={200}
                      />
                    </div>

                    <div className="w-1/2 flex flex-col flex-grow p-4 justify-between">
                      <div className="mb-4">
                        <Link
                          href={`/product/${p?.slug || ""}`}
                          className="hover:text-brand-gold transition-colors"
                        >
                          <h3 className="text-slate-900 font-semibold dark:text-[#e8d9c4] text-[15px] leading-snug line-clamp-2">
                            {p?.name} 
                            {" "}
                            {
                              p?.variant && (`(${p?.variant})`)
                            }
                          </h3>
                        </Link>
                        <div className="mt-2 flex items-center gap-2">
                          {discountPrice ? (
                            <>
                              <span className="text-lg font-bold text-brand-navy dark:text-[#f0ebe3]">
                                ${discountPrice}
                              </span>
                              <span className="text-xs font-medium text-slate-400 line-through">
                                ${basePrice}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-brand-navy dark:text-[#f0ebe3]">
                              ${basePrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleAddToCart(p, item?.wishlist_id || item?.id)
                          }
                          className="cursor-pointer flex items-center justify-center gap-2 size-10 rounded-full font-semibold text-sm transition-all bg-brand-gold/90 text-white hover:bg-brand-gold"
                        >
                          <ShoppingCart size={16} />
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.wishlist_id)}
                          className="cursor-pointer flex items-center justify-center gap-2 size-10 rounded-full font-semibold text-sm transition-all bg-red-500 text-white hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </PrivateRoute>
  );
}

function HeartIcon(props) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinelinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}
