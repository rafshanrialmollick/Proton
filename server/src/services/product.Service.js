// import ProductRepository from "../repository/product.Repository.js";
// import ApiError from "../utils/ApiError.js";

// // ── Helpers ───────────────────────────────────────────────────────────────────

// const buildFilter = (query) => {
//   const filter = { status: "active" };

//   if (query.status) filter.status = query.status;       // admin override
//   if (query.category) filter.category = query.category;
//   if (query.brand) filter.brand = new RegExp(query.brand, "i");
//   if (query.isFeatured) filter.isFeatured = query.isFeatured === "true";
//   if (query.isDigital) filter.isDigital = query.isDigital === "true";

//   if (query.minPrice || query.maxPrice) {
//     filter.price = {};
//     if (query.minPrice) filter.price.$gte = Number(query.minPrice);
//     if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
//   }

//   if (query.search) {
//     filter.$text = { $search: query.search };
//   }

//   if (query.tags) {
//     filter.tags = { $in: query.tags.split(",").map((t) => t.trim()) };
//   }

//   return filter;
// };

// const buildSort = (query) => {
//   const sortMap = {
//     newest: { createdAt: -1 },
//     oldest: { createdAt: 1 },
//     price_asc: { price: 1 },
//     price_desc: { price: -1 },
//     rating: { ratingAverage: -1 },
//     popular: { soldCount: -1 },
//   };
//   return sortMap[query.sort] || { createdAt: -1 };
// };

// // ── CRUD ──────────────────────────────────────────────────────────────────────

// const createProduct = (data) => ProductRepository.create(data);

// const getAllProducts = async (query = {}) => {
//   const filter = buildFilter(query);
//   const sort = buildSort(query);
//   const page = Math.max(1, Number(query.page) || 1);
//   const limit = Math.min(100, Number(query.limit) || 20);
//   const skip = (page - 1) * limit;

//   const [products, total] = await Promise.all([
//     ProductRepository.findAll({ filter, sort, skip, limit }),
//     ProductRepository.countAll(filter),
//   ]);

//   return {
//     products,
//     pagination: { total, page, limit, pages: Math.ceil(total / limit) },
//   };
// };

// const getProductById = async (id) => {
//   const product = await ProductRepository.findById(id);
//   if (!product) throw new ApiError(404, "Product not found");
//   return product;
// };

// const getProductBySlug = async (slug) => {
//   const product = await ProductRepository.findBySlug(slug);
//   if (!product) throw new ApiError(404, "Product not found");
//   return product;
// };

// const updateProduct = async (id, data) => {
//   const product = await ProductRepository.updateById(id, data);
//   if (!product) throw new ApiError(404, "Product not found");
//   return product;
// };

// const deleteProduct = async (id) => {
//   const product = await ProductRepository.findById(id);
//   if (!product) throw new ApiError(404, "Product not found");
//   await product.softDelete();
// };

// export default {
//   createProduct,
//   getAllProducts,
//   getProductById,
//   getProductBySlug,
//   updateProduct,
//   deleteProduct,
// };

import mongoose from "mongoose";
import ProductRepository from "../repository/product.Repository.js";
import ApiError from "../utils/ApiError.js";

// ── Helpers ───────────────────────────────────────────────────────────────────

// user এর লেখা special character (যেমন "(" বা "*") regex ভাঙতে না পারে
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildFilter = (query) => {
  const filter = { status: "active" };

  if (query.status) filter.status = query.status; // admin override

  // category: ObjectId হলে সরাসরি, নাহলে invalid id এ CastError এড়াতে ignore
  if (query.category) {
    if (!mongoose.Types.ObjectId.isValid(query.category)) {
      throw new ApiError(400, "Invalid category id");
    }
    filter.category = query.category;
  }

  if (query.brand?.trim()) {
    filter.brand = new RegExp(escapeRegex(query.brand.trim()), "i");
  }

  if (query.isFeatured) filter.isFeatured = query.isFeatured === "true";
  if (query.isDigital) filter.isDigital = query.isDigital === "true";

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  // Search: name, shortDescription, brand, tags এ substring match ("gam" → "Gaming")
  if (query.search?.trim()) {
    const regex = new RegExp(escapeRegex(query.search.trim()), "i");
    filter.$or = [
      { name: regex },
      { shortDescription: regex },
      { brand: regex },
      { tags: regex },
    ];
  }

  if (query.tags) {
    filter.tags = {
      $in: query.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
  }

  return filter;
};

const buildSort = (query) => {
  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { ratingAverage: -1 },
    popular: { soldCount: -1 },
  };
  return sortMap[query.sort] || { createdAt: -1 };
};

// ── CRUD ──────────────────────────────────────────────────────────────────────

const createProduct = (data) => ProductRepository.create(data);

const getAllProducts = async (query = {}) => {
  const filter = buildFilter(query);
  const sort = buildSort(query);
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    ProductRepository.findAll({ filter, sort, skip, limit }),
    ProductRepository.countAll(filter),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      totalPages: Math.ceil(total / limit), // frontend এর জন্য
    },
  };
};

const getProductById = async (id) => {
  const product = await ProductRepository.findById(id);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

const getProductBySlug = async (slug) => {
  const product = await ProductRepository.findBySlug(slug);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

const getProductCatagorey = async () => {
  const catagorey = await ProductRepository.findCatagorey();
  if (!catagorey) throw new ApiError(404, "Catagorey not found");
  return catagorey;
};

const updateProduct = async (id, data) => {
  const product = await ProductRepository.updateById(id, data);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

const deleteProduct = async (id) => {
  const product = await ProductRepository.findById(id);
  if (!product) throw new ApiError(404, "Product not found");
  await product.softDelete();
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getProductCatagorey,
};
