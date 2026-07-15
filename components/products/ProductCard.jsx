"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/components/context/AppContext";

export default function ProductCard({ p }) {
  const { addToCartDBGuest, addToWishlist, removeFromWishlist, wishlistItems } =
    useApp();

  const defaultVariant = p?.variants?.[0] || p;
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const selectedVariantId = selectedVariant?.product_variant_id;

  // Find if this product is in the user's fetched wishlist
  const wishlistItem = wishlistItems?.find(
    (w) =>
      String(w?.product_variant_id) === String(selectedVariantId) ||
      String(w?.id) === String(selectedVariantId),
  );

  const [isHovering, setIsHovering] = useState(false);

  // Sync local wish state if API is_wishlisted is true
  const isFavorite = Boolean(wishlistItem) || Boolean(selectedVariant?.is_wishlisted);

  function handleAddToCart() {
    addToCartDBGuest(selectedVariantId, 1, "increment");
  }

  function handleWishlistToggle(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      // Pass the wishlist_id if we have it, else fallback to variant ID
      removeFromWishlist(
        wishlistItem?.id || p?.wishlist_id || selectedVariantId,
      );
    } else {
      addToWishlist(selectedVariantId);
    }
  }

  const basePrice = selectedVariant?.price || p?.base_price;
  const discountPrice = selectedVariant?.discount?.discount_price;
  const discountAmount = selectedVariant?.discount?.discount_amount;
  const variantImage = selectedVariant?.image || p?.thumbnail_image;
  const hasMultipleVariants = p?.variants?.length > 1;

  return (
    <section className="relative h-full flex flex-col">
      <Link href={`/product/${p?.slug}`} className="h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="group flex flex-col dark:bg-[#0a0f2e] rounded overflow-hidden h-full cursor-pointer dark:border-[#1c2444]"
        >
        {/* Image Container */}
        <div className="relative h-64 w-full overflow-hidden bg-gray-50 dark:bg-brand-navy/50">
          <Image
            src={variantImage}
            alt={p?.name}
            fill
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            quality={90}
          />

          {/* Overlay Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            className="absolute top-3 right-3 flex gap-2 z-20"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer p-2 rounded-full text-white transition-colors"
              style={{ backgroundColor: "#785d32" }}
              onClick={handleWishlistToggle}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer p-2 rounded-full text-white transition-colors"
              style={{ backgroundColor: "#785d32" }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart();
              }}
            >
              <ShoppingCart size={16} />
            </motion.button>
          </motion.div>

          {/* Discount Badge */}
          {discountAmount && (
            <div className="absolute top-3 left-3 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-md z-10">
              -{discountAmount}
            </div>
          )}
        </div>
        {/* Product Info */}
        <div className="flex flex-col gap-3 mt-3 flex-grow justify-between">
          {/* Variant Selector - Show only if more than 1 variant */}
          {hasMultipleVariants && (
            <div className="flex px-2 gap-2 z-40">
              {p?.variants?.map((variant, index) => (
                <motion.button
                  key={variant?.product_variant_id || index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariant(variant);
                  }}
                  className={`relative cursor-pointer overflow-hidden flex-shrink-0 h-[50px] w-[50px] ring-2 transition-all ${
                    selectedVariant?.product_variant_id === variant?.product_variant_id
                      ? "ring-brand-gold"
                      : "ring-transparent hover:ring-brand-gold/50"
                  }`}
                >
                  <Image
                    src={variant?.image}
                    alt={variant?.variant_name || "Variant"}
                    fill
                    className="object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
          <div className="flex-grow">
            <p className="text-brand-gold">
              {p?.main_category?.name || "Category"}
            </p>
            <h3 className="text-slate-900 dark:text-[#e8d9c4] text-xl leading-snug line-clamp-2 mt-2 mb-1">
              {p?.name}
              {" "}
              {selectedVariant?.variant_name && (
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  ({selectedVariant?.variant_name})
                </span>
              )}
            </h3>

            {/* Price */}
            <div className="mb-4 flex items-center gap-2.5 flex-wrap text-[20px]">
              {discountPrice ? (
                <>
                  <span className="text-xl font-semibold text-brand-navy dark:text-[#f0ebe3]">
                    ${discountPrice}
                  </span>
                  <span className="text-sm font-medium text-slate-400 line-through decoration-slate-400 dark:text-slate-500">
                    ${basePrice}
                  </span>
                </>
              ) : (
                <span className="text-xl font-semibold text-brand-navy dark:text-[#f0ebe3]">
                  ${basePrice}
                </span>
              )}
            </div>
          </div> 
        </div>
        </motion.div>
      </Link>
    </section>
  );
}
