"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useApp } from "@/components/context/AppContext";

export default function ProductListCard({ p }) {
  const { addToCartDBGuest, addToWishlist, removeFromWishlist, wishlistItems } =
    useApp();

  const defaultVariant = p?.variants?.[0] || p;
  const defaultVariantId = defaultVariant?.product_variant_id;

  const wishlistItem = wishlistItems?.find(
    (w) =>
      String(w?.product_variant_id) === String(defaultVariantId) ||
      String(w?.id) === String(defaultVariantId),
  );

  const isFavorite = Boolean(wishlistItem) || Boolean(p?.is_wishlisted);

  function handleAddToCart() {
    addToCartDBGuest(defaultVariantId, 1, "increment");
  }

  function handleWishlistToggle(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      removeFromWishlist(
        wishlistItem?.id || p?.wishlist_id || defaultVariantId,
      );
    } else {
      addToWishlist(defaultVariantId);
    }
  }

  const basePrice = defaultVariant?.price || p?.base_price;
  const discountPrice = defaultVariant?.discount?.discount_price;
  const discountAmount = defaultVariant?.discount?.discount_amount;
  const hasMultipleVariants = p?.variants?.length > 1;

  return (
    <section className="relative h-full flex flex-col">
      <Link href={`/product/${p?.slug}`} className="h-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group overflow-hidden rounded dark:border-[#1c2444] dark:bg-[#0a0f2e] min-h-48 cursor-pointer h-full"
        >
          <div className="flex flex-col sm:flex-row items-stretch h-full">
            <div className="relative flex w-full sm:w-48 shrink-0 min-h-[220px] sm:min-h-full overflow-hidden bg-gray-50 dark:bg-brand-navy/50">
              <Image
                src={p?.thumbnail_image}
                alt={p?.name}
                fill
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-brand-navy shadow-sm dark:bg-[#050a30]/95 dark:text-brand-pale z-10">
                {p?.main_category?.name || "Category"}
              </span>

              <button
                onClick={handleWishlistToggle}
                className="absolute right-3 bottom-3 p-2.5 rounded-full bg-white/95 text-brand-navy shadow-md hover:bg-brand-gold hover:text-white transition-colors z-20 dark:bg-[#050a30]/90 dark:text-brand-pale"
                aria-label="Toggle Wishlist"
              >
                <Heart
                  size={18}
                  fill={isFavorite ? "currentColor" : "none"}
                  className={isFavorite ? "text-red-500" : ""}
                />
              </button>

              {discountAmount && (
                <div className="absolute top-3 right-3 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-md z-10">
                  -{discountAmount}
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-5 sm:gap-4 md:p-6 w-full">
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-lg font-bold text-slate-900 leading-tight dark:text-brand-pale sm:text-xl">
                  {p?.name}
                </h3>
                <p
                  className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400"
                  dangerouslySetInnerHTML={{ __html: p?.short_description }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-5 border-t border-gray-100 dark:border-[#1c2444]/50">
                <div className="flex items-center gap-3">
                  {discountPrice ? (
                    <>
                      <span className="text-2xl font-extrabold text-brand-navy dark:text-[#f0ebe3]">
                        ${discountPrice}
                      </span>
                      <span className="text-sm font-medium text-slate-400 line-through decoration-slate-400 decoration-1 dark:text-slate-500">
                        ${basePrice}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-extrabold text-brand-navy dark:text-[#f0ebe3]">
                      ${basePrice}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  {hasMultipleVariants || p?.variant_available ? (
                    <Link
                      href={`/product/${p?.slug}`}
                      className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-navy hover:bg-brand-gold hover:shadow-lg hover:shadow-brand-gold/20 transition-all"
                    >
                      View Details
                    </Link>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart();
                      }}
                      className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-gold hover:bg-[#684f29] hover:shadow-lg hover:shadow-brand-gold/20 transition-all"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </section>
  );
}
