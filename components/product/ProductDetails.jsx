"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Zap, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useApp } from "@/components/context/AppContext";
import ProductGallery from "./ProductGallery";
import RelatedProducts from "./RelatedProducts";

function HtmlBlock({ title, html }) {
  if (!html) return null;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#1c2444] dark:bg-[#0d1333]">
      <h3
        className="mb-3 text-lg font-bold text-brand-navy dark:text-[#f0ebe3]"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h3>
      <div
        className="prose max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}

export default function ProductDetails({ product }) {
  const router = useRouter();
  const { addToCartDBGuest, wishlistItems, addToWishlist, removeFromWishlist } =
    useApp();
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const defaultVariant = variants[0] || null;
  const gallery = Array.isArray(product?.main_image) ? product.main_image : [];
  const relatedProducts = Array.isArray(product?.related_products)
    ? product.related_products
    : [];
  console.log(relatedProducts);

  const [selectedVariantId, setSelectedVariantId] = useState(
    defaultVariant?.product_variant_id || null,
  );

  const selectedVariant =
    variants.find(
      (v) => String(v.product_variant_id) === String(selectedVariantId),
    ) || defaultVariant;

  const wishlistItem = wishlistItems?.find(
    (w) =>
      String(w?.product_variant_id) ===
        String(selectedVariant?.product_variant_id) ||
      String(w?.id) === String(selectedVariant?.product_variant_id),
  );

  const wishlistOn = Boolean(wishlistItem) || Boolean(product?.is_wishlisted);

  const [activeImage, setActiveImage] = useState(null);

  const selectedPrice = Number(selectedVariant?.price || 0);
  const discountPrice = Number(selectedVariant?.discount?.discount_price || 0);
  const hasDiscount = discountPrice > 0 && discountPrice < selectedPrice;
  const finalPrice = hasDiscount ? discountPrice : selectedPrice;

  const selectedStock = Number(selectedVariant?.stock || 0);
  const selectedSku = selectedVariant?.sku || product?.product_code || "N/A";
  const rating = Number(product?.ratings?.rating || 0);
  const totalRating = Number(product?.ratings?.total_rating || 0);

  const mergedGallery = [...gallery];
  if (
    selectedVariant?.image &&
    !mergedGallery.includes(selectedVariant.image)
  ) {
    mergedGallery.unshift(selectedVariant.image);
  }
  if (
    product?.thumbnail_image &&
    !mergedGallery.includes(product.thumbnail_image)
  ) {
    mergedGallery.unshift(product.thumbnail_image);
  }
  if (!mergedGallery.length) {
    mergedGallery.push("/images/placeholder.png");
  }

  async function handleAddToCart() {
    if (!selectedVariant?.product_variant_id) {
      toast.error("Variant not available");
      return;
    }

    await addToCartDBGuest(selectedVariant.product_variant_id, 1, "increment");
  }

  async function handleBuyNow() {
    if (!selectedVariant?.product_variant_id) {
      toast.error("Variant not available");
      return;
    }

    const success = await addToCartDBGuest(
      selectedVariant.product_variant_id,
      1,
      "increment",
    );

    if (success) {
      router.push("/checkout");
    }
  }

  function handleWishlist() {
    if (wishlistOn) {
      removeFromWishlist(
        wishlistItem?.id ||
          selectedVariant?.product_variant_id ||
          product?.product_variant_id,
      );
    } else {
      addToWishlist(
        selectedVariant?.product_variant_id || product?.product_variant_id,
      );
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 pt-24 pb-16 dark:bg-brand-navy">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col gap-4">
            <ProductGallery
              images={mergedGallery}
              productName={product?.name}
              activeImage={activeImage}
            />
          </div>

          <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-[#1c2444] dark:bg-[#0d1333]">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-gold">
                {product?.brand?.name || "Brand"}
              </p>

              <h1
                className="mt-2 text-3xl font-bold text-brand-navy dark:text-[#f0ebe3] sm:text-4xl"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {product?.name}
              </h1>

              {totalRating > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-[#9fa8cc]">
                  <Star size={15} className="text-brand-gold" />
                  <span>{rating.toFixed(1)}</span>
                  <span>({totalRating} ratings)</span>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-4xl font-bold text-brand-gold">
                  ${finalPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold text-gray-400 line-through dark:text-gray-500">
                      ${selectedPrice.toFixed(2)}
                    </span>
                    <span className="rounded-md bg-rose-500/10 px-2.5 py-1 text-sm font-bold text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                      -{selectedVariant?.discount?.discount_amount}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-[#f7f3ec] px-3 py-2 dark:bg-[#111b44]">
                  <span className="text-gray-500 dark:text-[#9fa8cc]">
                    SKU:
                  </span>{" "}
                  <span className="font-semibold text-brand-navy dark:text-[#f0ebe3]">
                    {selectedSku}
                  </span>
                </div>
                <div className="rounded-lg bg-[#f7f3ec] px-3 py-2 dark:bg-[#111b44]">
                  <span className="text-gray-500 dark:text-[#9fa8cc]">
                    Stock:
                  </span>{" "}
                  <span className="font-semibold text-brand-navy dark:text-[#f0ebe3]">
                    {selectedStock}
                  </span>
                </div>
              </div>

              {variants.length > 1 && (
                <div className="mt-8">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                      Choose Variant
                    </h3>
                    <span className="text-sm font-medium text-brand-gold">
                      {selectedVariant?.variant}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {variants.map((variant) => {
                      const isSelected =
                        selectedVariantId === variant.product_variant_id;

                      const variantPrice = Number(variant.price || 0);
                      const variantDiscount = Number(
                        variant.discount?.discount_price || 0,
                      );
                      const variantFinalPrice =
                        variantDiscount > 0 && variantDiscount < variantPrice
                          ? variantDiscount
                          : variantPrice;

                      return (
                        <button
                          key={variant.product_variant_id}
                          type="button"
                          onClick={() => {
                            setSelectedVariantId(variant.product_variant_id);
                            if (variant.image) {
                              setActiveImage(variant.image);
                            }
                          }}
                          className={`relative flex flex-col items-center justify-center rounded-xl border-2 p-3 text-center transition-all duration-200 ${
                            isSelected
                              ? "border-brand-gold bg-brand-gold/5 dark:bg-brand-gold/10"
                              : "border-gray-100 bg-white hover:border-brand-gold/50 dark:border-[#2a3460] dark:bg-[#111b44]"
                          }`}
                        >
                          <span
                            className={`block text-sm font-bold ${isSelected ? "text-brand-gold" : "text-gray-700 dark:text-gray-200"}`}
                          >
                            {variant.variant}
                          </span>
                          <span
                            className={`mt-1 flex items-center gap-1.5 text-xs font-medium ${isSelected ? "text-brand-gold/80" : "text-gray-500 dark:text-[#9fa8cc]"}`}
                          >
                            ${variantFinalPrice.toFixed(2)}
                            {variantDiscount > 0 &&
                              variantDiscount < variantPrice && (
                                <span className="text-[10px] line-through opacity-70">
                                  ${variantPrice.toFixed(2)}
                                </span>
                              )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex w-full flex-1 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-gold px-6 py-4 text-sm font-bold text-white shadow-sm transition-all hover:brightness-95 active:scale-[0.98]"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={handleWishlist}
                    aria-label="Add to Wishlist"
                    className="flex shrink-0 items-center justify-center rounded-xl border-2 border-gray-100 bg-white px-4 py-4 text-gray-400 transition-all hover:border-rose-200 hover:text-rose-500 dark:border-[#2a3460] dark:bg-[#111b44] dark:hover:border-rose-500/50"
                  >
                    <Heart
                      size={24}
                      fill={wishlistOn ? "currentColor" : "none"}
                      className={wishlistOn ? "text-rose-500" : ""}
                    />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex w-full flex-1 items-center justify-center gap-2 rounded-xl bg-brand-navy px-6 py-4 text-sm font-bold text-white shadow-sm transition-all hover:brightness-110 dark:bg-[#182352] active:scale-[0.98]"
                >
                  <Zap size={20} />
                  Buy Now
                </button>
              </div>

              {product?.short_description && (
                <div
                  className="prose mt-6 max-w-none prose-p:my-2 dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: product.short_description,
                  }}
                />
              )}
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-[#1c2444] dark:bg-[#0d1333]">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-[#9fa8cc]">
                Product Details
              </h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-[#e7dccf]">
                <p>Code: {product?.product_code || "N/A"}</p>
                <p>Main Category: {product?.main_category?.name || "N/A"}</p>
                <p>
                  Other Categories:{" "}
                  {Array.isArray(product?.other_categories) &&
                  product.other_categories.length > 0
                    ? product.other_categories.map((c) => c.name).join(", ")
                    : "N/A"}
                </p>
                <p>
                  Tags:{" "}
                  {Array.isArray(product?.tags)
                    ? product.tags.join(", ")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-5">
          <HtmlBlock title="Description" html={product?.long_description} />
          <HtmlBlock title="How To Use" html={product?.how_to_use} />
          <HtmlBlock title="Benefits" html={product?.benefits} />
        </section>

        <section className={`mt-8 grid grid-cols-1 gap-5`}>
          {totalRating > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#1c2444] dark:bg-[#0d1333]">
              <h3
                className="mb-3 text-lg font-bold text-brand-navy dark:text-[#f0ebe3]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Reviews
              </h3>
              {Array.isArray(product?.reviews) && product.reviews.length > 0 ? (
                <p className="text-sm text-gray-700 dark:text-brand-pale">
                  {product.reviews.length} review(s) available.
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-[#9fa8cc]">
                  No reviews yet.
                </p>
              )}
            </div>
          )}
          {product.faqs.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-[#1c2444] dark:bg-[#0d1333]">
              <h3
                className="mb-3 text-lg font-bold text-brand-navy dark:text-[#f0ebe3]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                FAQs
              </h3>
              {Array.isArray(product?.faqs) && product.faqs.length > 0 ? (
                <p className="text-sm text-gray-700 dark:text-brand-pale">
                  {product.faqs.length} FAQ item(s) available.
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-[#9fa8cc]">
                  No FAQs available.
                </p>
              )}
            </div>
          )}
        </section>

        {relatedProducts?.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </main>
  );
}
