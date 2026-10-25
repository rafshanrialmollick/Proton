// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { productApi } from "@/lib/api";

// export default function Home() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     category: "",
//     brand: "",
//     minPrice: "",
//     maxPrice: "",
//     search: "",
//     sort: "newest",
//     page: 1,
//     limit: 12,
//   });
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     fetchProducts();
//   }, [filters]);

//   // const fetchProducts = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const res = await productApi.getAll(filters);
//   //     setProducts(res.data.products);
//   //     setTotalPages(res.data.pagination.pages);
//   //   } catch (err) {
//   //     console.error(err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const res = await productApi.getAll(filters);

//       // Handle both standard or nested API response structures safely
//       const responseData = res?.data?.data || res?.data || {};

//       setProducts(responseData.products || []);
//       setTotalPages(responseData.pagination?.pages || 1);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
//   };

//   const handleSort = (e) => {
//     setFilters((prev) => ({ ...prev, sort: e.target.value, page: 1 }));
//   };

//   const prevPage = () => {
//     if (filters.page > 1)
//       setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
//   };

//   const nextPage = () => {
//     if (filters.page < totalPages)
//       setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6 text-gray-800">Proton Shop</h1>

//         {/* Filters */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Search
//             </label>
//             <input
//               type="text"
//               name="search"
//               className="w-full p-2 border rounded"
//               value={filters.search || ""}
//               onChange={handleChange}
//               placeholder="Search products..."
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Category
//             </label>
//             <select
//               name="category"
//               className="w-full p-2 border rounded"
//               value={filters.category || ""}
//               onChange={handleChange}
//             >
//               <option value="">All Categories</option>
//               <option value="electronics">Electronics</option>
//               <option value="clothing">Clothing</option>
//               <option value="home & garden">Home & Garden</option>
//               <option value="sports">Sports</option>
//               <option value="books">Books</option>
//               <option value="beauty">Beauty</option>
//               <option value="toys">Toys</option>
//               <option value="automotive">Automotive</option>
//               <option value="food & grocery">Food & Grocery</option>
//               <option value="health">Health</option>
//               <option value="office supplies">Office Supplies</option>
//               <option value="jewelry">Jewelry</option>
//               <option value="pet supplies">Pet Supplies</option>
//               <option value="music">Music</option>
//               <option value="art & crafts">Art & Crafts</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Price range
//             </label>
//             <div className="grid grid-cols-2 gap-2">
//               <input
//                 type="number"
//                 name="minPrice"
//                 className="w-full p-2 border rounded"
//                 value={filters.minPrice || ""}
//                 onChange={handleChange}
//                 placeholder="Min"
//               />
//               <input
//                 type="number"
//                 name="maxPrice"
//                 className="w-full p-2 border rounded"
//                 value={filters.maxPrice || ""}
//                 onChange={handleChange}
//                 placeholder="Max"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Sort */}
//         <div className="flex justify-between items-center mb-4">
//           <div className="text-sm text-gray-600">Sort by:</div>
//           <select
//             className="p-2 border rounded"
//             value={filters.sort}
//             onChange={handleSort}
//           >
//             <option value="newest">Newest</option>
//             <option value="oldest">Oldest</option>
//             <option value="price_asc">Price: Low to High</option>
//             <option value="price_desc">Price: High to Low</option>
//             <option value="rating">Rating: High to Low</option>
//             <option value="popular">Popularity</option>
//           </select>
//         </div>

//         {/* Products Grid */}
//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px] animate-pulse">
//             {Array(6)
//               .fill()
//               .map((_, i) => (
//                 <div key={i} className="bg-white rounded-lg shadow p-4">
//                   <div className="h-32 bg-gray-200 rounded mb-3"></div>
//                   <div className="space-y-2">
//                     <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//                     <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                     <div className="flex items-center space-x-2">
//                       <div className="h-4 w-4 bg-gray-200 rounded"></div>
//                       <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {products.map((product) => (
//               <Link
//                 key={product._id}
//                 href={`/products/${product._id}`}
//                 className="group"
//               >
//                 <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
//                   <img
//                     src={
//                       product.images?.[0]?.url ||
//                       `https://picsum.photos/seed/${product._id}/400/300`
//                     }
//                     alt={product.name}
//                     className="w-full h-48 object-cover"
//                   />
//                   <div className="p-4">
//                     <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
//                       {product.name}
//                     </h3>
//                     <p className="text-gray-600 text-sm line-clamp-2 mb-2">
//                       {product.shortDescription ||
//                         product.description.substring(0, 100)}
//                     </p>
//                     <div className="flex justify-between items-center mt-4">
//                       <div className="text-xl font-bold text-indigo-600">
//                         ${product.price.toFixed(2)}
//                       </div>
//                       {product.compareAtPrice && (
//                         <span className="text-gray-400 line-through text-sm">
//                           ${product.compareAtPrice.toFixed(2)}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
//             <button
//               onClick={prevPage}
//               disabled={filters.page === 1}
//               className="px-3 py-1 rounded border disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span>
//               Page {filters.page} of {totalPages}
//             </span>
//             <button
//               onClick={nextPage}
//               disabled={filters.page === totalPages}
//               className="px-3 py-1 rounded border disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { productApi } from "@/lib/api";
import useDebounce from "@/hooks/useDebounce";

const initialInputs = { search: "", brand: "", minPrice: "", maxPrice: "" };
const LIMIT = 12;

// কোন কোন page number দেখাবে তা ঠিক করে, যেমন: 1 ... 4 5 6 ... 20
function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);

  return pages;
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // input এর মান (প্রতিটি অক্ষরে সাথে সাথে বদলায়)
  const [inputs, setInputs] = useState(initialInputs);
  // সরাসরি apply হওয়া filter (debounce লাগে না)
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // টাইপ থামার ৫০০ms পরে এই মান আপডেট হয়
  const debouncedInputs = useDebounce(inputs, 500);

  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // const raw = { ...debouncedInputs, sort, page, limit: LIMIT };
        const raw = { ...debouncedInputs, sort, page, limit: LIMIT };
        // খালি value বাদ দিয়ে params বানানো
        const params = Object.fromEntries(
          Object.entries(raw).filter(([, v]) => v !== "" && v != null),
        );

        const res = await productApi.getAll(params);
        if (ignore) return;

        const body = res.data;
        const list = Array.isArray(body)
          ? body
          : Array.isArray(body?.data)
            ? body.data
            : (body?.data?.products ?? body?.products ?? []);

        const pagination = body?.data?.pagination ?? body?.pagination;

        setProducts(list);
        setTotalPages(pagination?.totalPages ?? pagination?.pages ?? 1);
        setTotalItems(pagination?.total ?? list.length);
      } catch (err) {
        if (ignore) return;
        console.log("BACKEND SAYS:", err?.response?.data);
        setError(err?.response?.data?.message ?? "Failed to load products.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      ignore = true;
    };
  }, [debouncedInputs, sort, page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setPage(1); // filter বদলালে প্রথম page এ ফেরা
  };

  const handleSort = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const resetFilters = () => {
    setInputs(initialInputs);
    setSort("newest");
    setPage(1);
  };

  const goToPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getImage = (p) =>
    p.images?.[0]?.url ||
    (typeof p.images?.[0] === "string" ? p.images[0] : null) ||
    p.image ||
    null;

  const getCategory = (p) =>
    typeof p.category === "object" ? p.category?.name : null;

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const pageBtn =
    "rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Products
          </h1>
          <p className="mt-2 text-gray-500">Browse our latest collection</p>

          <div className="mx-auto mt-6 max-w-xl">
            <input
              type="text"
              name="search"
              value={inputs.search}
              onChange={handleInputChange}
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </header>

        {/* Filters */}
        <div className="mb-8 grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:grid-cols-2 lg:grid-cols-5">
          <input
            name="brand"
            value={inputs.brand}
            onChange={handleInputChange}
            placeholder="Brand"
            className={inputClass}
          />
          <input
            type="number"
            min="0"
            name="minPrice"
            value={inputs.minPrice}
            onChange={handleInputChange}
            placeholder="Min price"
            className={inputClass}
          />
          <input
            type="number"
            min="0"
            name="maxPrice"
            value={inputs.maxPrice}
            onChange={handleInputChange}
            placeholder="Max price"
            className={inputClass}
          />
          <select value={sort} onChange={handleSort} className={inputClass}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="popular">Most Popular</option>
          </select>
          <button
            onClick={resetFilters}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
          >
            Reset
          </button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="h-48 bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-4 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-500">No products found.</p>
        )}

        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                const img = getImage(product);
                const category = getCategory(product);
                return (
                  <article
                    key={product._id ?? product.id}
                    className="group  relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {img ? (
                        <img
                          src={img}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                      {category && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow">
                          {category}
                        </span>
                      )}
                    </div>

                    <div className="group  flex flex-1 flex-col p-4">
                      <Link
                        // href={`/products/${product.seo?.slug ?? product._id}`}
                        href={`/products/${product._id}`}
                        className="after:absolute after:inset-0 after:content-['']"
                      >
                        <h2 className="line-clamp-1 text-lg font-semibold text-gray-900 hover:text-indigo-600">
                          {product.name}
                        </h2>
                      </Link>
                      <p className="mt-1 line-clamp-2 flex-1 text-sm text-gray-500">
                        {product.shortDescription ?? product.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xl font-bold text-indigo-600">
                          ${product.price}
                        </span>
                        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-95">
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center gap-4">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * LIMIT + 1}-
                  {Math.min(page * LIMIT, totalItems)} of {totalItems} products
                </p>

                <nav className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                    className={pageBtn}
                  >
                    ← Prev
                  </button>

                  {getPageNumbers(page, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={`dots-${i}`} className="px-2 text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        aria-current={p === page ? "page" : undefined}
                        className={`h-10 w-10 rounded-lg text-sm font-medium transition ${
                          p === page
                            ? "bg-indigo-600 text-white shadow"
                            : "bg-white text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}

                  <button
                    disabled={page >= totalPages}
                    onClick={() => goToPage(page + 1)}
                    className={pageBtn}
                  >
                    Next →
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
