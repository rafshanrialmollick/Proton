// import React from 'react'

// export default function page() {
//   return (
//     <div>

//     </div>
//   )
// }

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { productApi } from "@/lib/api";

// function ProductCard({ product }) {
//   const image =
//     product.images?.[0]?.url ||
//     `https://picsum.photos/seed/${product._id}/400/300`;

//   return (
//     <Link
//       href={`/products/${product._id}`}
//       className="group bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden block"
//     >
//       <img
//         src={image}
//         alt={product.name}
//         className="w-full h-48 object-cover"
//       />
//       <div className="p-4">
//         <h3 className="font-medium text-gray-900 truncate group-hover:text-indigo-600">
//           {product.name}
//         </h3>
//         <div className="mt-2 flex items-center justify-between">
//           <div>
//             <span className="font-semibold text-indigo-600">
//               ${product.price?.toFixed(2)}
//             </span>
//             {product.compareAtPrice > product.price && (
//               <span className="ml-2 text-sm text-gray-400 line-through">
//                 ${product.compareAtPrice.toFixed(2)}
//               </span>
//             )}
//           </div>
//           {product.ratingCount > 0 && (
//             <span className="text-sm text-gray-600">
//               ★ {product.ratingAverage?.toFixed(1)}
//             </span>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// }

// function SkeletonCard() {
//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
//       <div className="w-full h-48 bg-gray-200" />
//       <div className="p-4 space-y-3">
//         <div className="h-4 bg-gray-200 rounded w-3/4" />
//         <div className="h-4 bg-gray-200 rounded w-1/3" />
//       </div>
//     </div>
//   );
// }

// export default function page() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await productApi.getAll({ page: 1, limit: 8 });
//         const data = res.data.data ?? res.data;
//         setProducts(data.products ?? []);
//       } catch (err) {
//         console.error(err);
//         setError(err.response?.data?.message || "Could not load products");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero */}
//       <section className="bg-indigo-600 text-white">
//         <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
//           <h1 className="text-3xl md:text-5xl font-bold max-w-2xl">
//             Everything you need, delivered to your door
//           </h1>
//           <p className="mt-4 text-indigo-100 max-w-xl">
//             Browse our latest products, save your favourites and check out in
//             minutes.
//           </p>
//           <Link
//             href="/products"
//             className="mt-8 inline-block bg-white text-indigo-600 font-medium py-3 px-6 rounded-lg hover:bg-indigo-50 transition-colors"
//           >
//             Shop all products
//           </Link>
//         </div>
//       </section>

//       {/* Latest products */}
//       <section className="max-w-6xl mx-auto px-6 py-12">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold">Latest products</h2>
//           <Link
//             href="/products"
//             className="text-sm text-indigo-600 hover:underline"
//           >
//             View all
//           </Link>
//         </div>

//         {error && <p className="text-red-500">{error}</p>}

//         {!error && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {loading
//               ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
//               : products.map((product) => (
//                   <ProductCard key={product._id} product={product} />
//                 ))}
//           </div>
//         )}

//         {!loading && !error && products.length === 0 && (
//           <p className="text-gray-500 text-center py-8">No products yet.</p>
//         )}
//       </section>

//       {/* Perks */}
//       <section className="bg-white border-t border-gray-100">
//         <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
//           <div>
//             <h3 className="font-semibold">Fast delivery</h3>
//             <p className="text-sm text-gray-600 mt-1">
//               Orders shipped quickly to your saved address.
//             </p>
//           </div>
//           <div>
//             <h3 className="font-semibold">Secure checkout</h3>
//             <p className="text-sm text-gray-600 mt-1">
//               Your account and orders are protected.
//             </p>
//           </div>
//           <div>
//             <h3 className="font-semibold">Real reviews</h3>
//             <p className="text-sm text-gray-600 mt-1">
//               Read what other customers say before you buy.
//             </p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
} from "motion/react";
import { productApi } from "@/lib/api";

const SLIDE_DURATION = 6000; // ms per slide

const money = (n) => `$${Number(n ?? 0).toFixed(2)}`;
const discountPercent = (p) =>
  p.compareAtPrice > p.price
    ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
    : 0;

/* ---------------------------------- Cards --------------------------------- */

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function ProductCard({ product }) {
  const image =
    product.images?.[0]?.url ||
    `https://picsum.photos/seed/${product._id}/400/300`;
  const discount = discountPercent(product);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        href={`/products/${product._id}`}
        className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
              -{discount}%
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="truncate font-medium text-gray-900 transition-colors group-hover:text-indigo-600">
            {product.name}
          </h3>

          <div className="mt-3 flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {money(product.price)}
              </span>
              {discount > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  {money(product.compareAtPrice)}
                </span>
              )}
            </div>

            {product.ratingCount > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                ★ {product.ratingAverage?.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="aspect-[4/3] w-full bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-5 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}

/* ------------------------------- Hero slider ------------------------------ */

const textVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

const imageVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 120 : -120, scale: 0.85, rotate: dir > 0 ? 6 : -6 }),
  center: { opacity: 1, x: 0, scale: 1, rotate: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -120 : 120, scale: 0.85, rotate: dir > 0 ? -6 : 6 }),
};

const stagger = {
  center: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

function HeroFallback() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl text-4xl font-extrabold tracking-tight md:text-6xl"
        >
          Everything you need, delivered to your door
        </motion.h1>
        <p className="mt-5 max-w-xl text-lg text-indigo-100">
          Browse our latest products, save your favourites and check out in
          minutes.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-full bg-white px-7 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50"
        >
          Shop all products
        </Link>
      </div>
    </section>
  );
}

function HeroSlider({ products }) {
  const [[index, direction], setSlide] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const progress = useMotionValue(0);
  const count = products.length;

  const paginate = useCallback(
    (dir) => {
      progress.set(0);
      setSlide(([i]) => [(i + dir + count) % count, dir]);
    },
    [count, progress]
  );

  const goTo = (target) => {
    if (target === index) return;
    progress.set(0);
    setSlide([target, target > index ? 1 : -1]);
  };

  // Autoplay driven by an animation frame: no re-renders, pauses on hover
  useAnimationFrame((_, delta) => {
    if (paused || count < 2) return;
    const next = progress.get() + Math.min(delta, 100) / SLIDE_DURATION;
    if (next >= 1) paginate(1);
    else progress.set(next);
  });

  const touchStart = useRef(0);

  if (!count) return <HeroFallback />;

  const product = products[index];
  const image =
    product.images?.[0]?.url ||
    `https://picsum.photos/seed/${product._id}/800/600`;
  const discount = discountPercent(product);

  return (
    <section
      className="relative isolate overflow-hidden bg-slate-950 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") paginate(-1);
        if (e.key === "ArrowRight") paginate(1);
      }}
      tabIndex={0}
      aria-roledescription="carousel"
    >
      {/* Blurred, cross-fading background taken from the product image */}
      <AnimatePresence initial={false}>
        <motion.img
          key={`bg-${product._id}`}
          src={image}
          alt=""
          aria-hidden
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 0.35, scale: 1.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 -z-20 h-full w-full object-cover blur-3xl"
        />
      </AnimatePresence>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/70 to-indigo-950/60" />

      <div className="mx-auto grid min-h-[540px] max-w-6xl items-center gap-8 px-6 py-14 md:grid-cols-2 md:py-20">
        {/* Text */}
        <div className="relative order-2 md:order-1">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={product._id}
              custom={direction}
              variants={{ ...textVariants, center: { ...textVariants.center, ...stagger.center } }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <motion.div variants={item} className="flex items-center gap-3">
                <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur ring-1 ring-white/20">
                  ✨ Featured
                </span>
                {discount > 0 && (
                  <span className="rounded-full bg-rose-500 px-3 py-1.5 text-sm font-semibold">
                    Save {discount}%
                  </span>
                )}
              </motion.div>

              <motion.h1
                variants={item}
                className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl"
              >
                {product.name}
              </motion.h1>

              {product.description && (
                <motion.p
                  variants={item}
                  className="mt-4 line-clamp-3 max-w-md text-slate-300"
                >
                  {product.description}
                </motion.p>
              )}

              <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-4">
                <span className="text-3xl font-bold">{money(product.price)}</span>
                {discount > 0 && (
                  <span className="text-lg text-slate-400 line-through">
                    {money(product.compareAtPrice)}
                  </span>
                )}
                {product.ratingCount > 0 && (
                  <span className="text-sm text-amber-300">
                    ★ {product.ratingAverage?.toFixed(1)}{" "}
                    <span className="text-slate-400">({product.ratingCount})</span>
                  </span>
                )}
              </motion.div>

              <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href={`/products/${product._id}`}
                    className="inline-block rounded-full bg-white px-7 py-3 font-semibold text-slate-900 shadow-lg shadow-indigo-500/20"
                  >
                    View product →
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/products"
                    className="inline-block rounded-full px-7 py-3 font-semibold ring-1 ring-white/30 transition hover:bg-white/10"
                  >
                    Shop all
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Image (swipe / drag to change slide) */}
        <div className="relative order-1 flex h-72 items-center justify-center md:order-2 md:h-[420px]">
          <div className="absolute h-64 w-64 rounded-full bg-indigo-500/40 blur-3xl md:h-96 md:w-96" />
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={product._id}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) paginate(1);
                else if (info.offset.x > 80) paginate(-1);
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <motion.img
                src={image}
                alt={product.name}
                draggable={false}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-full rounded-3xl object-contain drop-shadow-2xl"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows */}
      {count > 1 && (
        <>
          {[
            { dir: -1, label: "Previous product", pos: "left-3 md:left-6", icon: "‹" },
            { dir: 1, label: "Next product", pos: "right-3 md:right-6", icon: "›" },
          ].map(({ dir, label, pos, icon }) => (
            <motion.button
              key={dir}
              onClick={() => paginate(dir)}
              aria-label={label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl leading-none backdrop-blur ring-1 ring-white/20 hover:bg-white/20 md:flex ${pos}`}
            >
              {icon}
            </motion.button>
          ))}

          {/* Progress indicators */}
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {products.map((p, i) => (
              <button
                key={p._id || i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="relative h-1.5 w-10 overflow-hidden rounded-full bg-white/25"
              >
                {i === index && (
                  <motion.span
                    style={{ scaleX: progress }}
                    className="absolute inset-0 origin-left rounded-full bg-white"
                  />
                )}
                {i < index && <span className="absolute inset-0 rounded-full bg-white/70" />}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section className="bg-slate-950">
      <div className="mx-auto grid min-h-[540px] max-w-6xl items-center gap-8 px-6 py-14 md:grid-cols-2">
        <div className="order-2 space-y-4 md:order-1">
          <div className="h-8 w-32 animate-pulse rounded-full bg-white/10" />
          <div className="h-14 w-3/4 animate-pulse rounded-lg bg-white/10" />
          <div className="h-5 w-full animate-pulse rounded bg-white/10" />
          <div className="h-12 w-40 animate-pulse rounded-full bg-white/20" />
        </div>
        <div className="order-1 h-72 animate-pulse rounded-3xl bg-white/10 md:order-2 md:h-[420px]" />
      </div>
    </section>
  );
}

/* ---------------------------------- Perks --------------------------------- */

const perks = [
  {
    title: "Fast delivery",
    text: "Orders shipped quickly to your saved address.",
    d: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z",
  },
  {
    title: "Secure checkout",
    text: "Your account and orders are protected.",
    d: "M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3zm-3 9l2 2 4-4",
  },
  {
    title: "Real reviews",
    text: "Read what other customers say before you buy.",
    d: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z",
  },
];

/* ---------------------------------- Page ---------------------------------- */

export default function Page() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", "home"],
    queryFn: async () => {
      const res = await productApi.getAll({ page: 1, limit: 8 });
      const d = res.data.data ?? res.data;
      return d.products ?? [];
    },
  });

  const products = data ?? [];
  const errorMessage = error
    ? error.response?.data?.message || "Could not load products"
    : "";

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading ? <HeroSkeleton /> : <HeroSlider products={products.slice(0, 5)} />}

      {/* Latest products */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              New arrivals
            </p>
            <h2 className="mt-1 text-3xl font-bold text-gray-900">Latest products</h2>
          </div>
          <Link
            href="/products"
            className="rounded-full px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
          >
            View all →
          </Link>
        </div>

        {errorMessage && (
          <p className="rounded-lg bg-red-50 p-4 text-red-600">{errorMessage}</p>
        )}

        {!errorMessage && (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.07 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {isLoading
              ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
              : products.map((p) => <ProductCard key={p._id} product={p} />)}
          </motion.div>
        )}

        {!isLoading && !errorMessage && products.length === 0 && (
          <p className="py-8 text-center text-gray-500">No products yet.</p>
        )}
      </section>

      {/* Perks */}
      <section className="border-t border-gray-100 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-14 md:grid-cols-3">
          {perks.map((perk, i) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 rounded-2xl p-4 transition hover:bg-gray-50"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={perk.d} />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">{perk.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{perk.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}