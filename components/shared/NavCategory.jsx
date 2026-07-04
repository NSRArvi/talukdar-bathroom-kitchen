import { useApp } from "@/components/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NavCategory() {
  const { categories } = useApp();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(null);

  const currentActiveId = activeCategory || categories?.[0]?.id;
  const activeCategoryData =
    categories?.find((cat) => cat.id === currentActiveId) || categories?.[0];

  const getImageUrl = (path) => {
    if (!path) return "/placeholder-image.jpg"; // Handle null/undefined
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    return `https://api.smartkitchenandbath.com.au/storage/${path.replace(/^\//, "")}`;
  };

  return (
    <div className="flex gap-6 p-4">
      {/* Left Sidebar - Category Tabs */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="group flex flex-col gap-2"
      >
        {categories?.map((cat) => {
          const isActive = currentActiveId === cat.id;
          return (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              passHref
              legacyBehavior
            >
              <motion.a
                onMouseEnter={() => setActiveCategory(cat.id)}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2 relative transition-colors duration-200 text-sm font-medium whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "text-[#050a30] dark:text-[#f0ebe3]"
                    : "text-[#050a30]/60 dark:text-[#f0ebe3]/60"
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  src={getImageUrl(cat.icon)}
                  alt={cat.name}
                  width={40}
                  height={40}
                  className="rounded flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                />
                <span>{cat.name}</span>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="category-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-[#785d32]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.a>
            </Link>
          );
        })}
      </motion.div>

      {/* Divider */}
      <motion.div
        className="h-full w-0.5 bg-[#c4a97e]"
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Right Content - Subcategories */}
      {activeCategoryData && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentActiveId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 overflow-hidden"
          >
            <div className="mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-[#050a30] dark:text-[#f0ebe3]">
                {activeCategoryData.name}
              </h3>
            </div>
            <div className="flex flex-wrap gap-4">
              {activeCategoryData.child?.map((subcat) => (
                <Link
                  key={subcat.id}
                  href={`/shop/${subcat.slug}`}
                  className="group/item p-4 flex flex-col items-center transition-all duration-300 cursor-pointer"
                >
                  <div className="relative w-24 h-24 overflow-hidden rounded bg-gray-100 flex items-center justify-center">
                    <Image
                      src={getImageUrl(subcat.icon)}
                      alt={subcat.name}
                      fill
                      className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        if (e.currentTarget.src !== "/placeholder-image.jpg") {
                          e.currentTarget.src = "/placeholder-image.jpg";
                          e.currentTarget.srcset = "";
                        }
                      }}
                    />
                  </div>
                  <p className="text-sm mt-3 text-[#050a30] dark:text-[#f0ebe3]/80 group-hover/item:text-[#050a30] dark:group-hover/item:text-[#f0ebe3] transition-colors duration-300">
                    {subcat.name}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
