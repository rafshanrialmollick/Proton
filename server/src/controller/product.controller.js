import ProductService from "../services/product.Service.js";
import ApiResponse from "../utils/apiResponse.js";

// GET /api/v1/products
export const getAllProducts = async (req, res, next) => {
  try {
    const result = await ProductService.getAllProducts(req.query);
    res
      .status(200)
      .json(new ApiResponse(200, result, "Products fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/products/slug/:slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await ProductService.getProductBySlug(req.params.slug);
    res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully"));
  } catch (error) {
    next(error);
  }
};
// GET /api/v1/products/catagorey
export const getCatagorey = async (req, res, next) => {
  try {
    const product = await ProductService.getProductCatagorey();
    res
      .status(200)
      .json(new ApiResponse(200, product, "Catagorey fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/products  [admin]
export const createProduct = async (req, res, next) => {
  try {
    const product = await ProductService.createProduct({
      ...req.body,
      createdBy: req.user._id,
    });
    res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/products/:id  [admin]
export const updateProduct = async (req, res, next) => {
  try {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    res
      .status(200)
      .json(new ApiResponse(200, product, "Product updated successfully"));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/products/:id  [admin]
export const deleteProduct = async (req, res, next) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Product deleted successfully"));
  } catch (error) {
    next(error);
  }
};
