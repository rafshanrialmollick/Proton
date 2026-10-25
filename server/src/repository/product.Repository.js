import Product from "../model/product.js";

const create = (data) => Product.create(data);

const findAll = ({ filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 20 } = {}) =>
  Product.find(filter).sort(sort).skip(skip).limit(limit);
const findCatagorey = Product.distinct()

const countAll = (filter = {}) => Product.countDocuments(filter);

const findById = (id) => Product.findById(id);

const findBySlug = (slug) => Product.findOne({ "seo.slug": slug });

const updateById = (id, data) =>
  Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = (id) => Product.findByIdAndDelete(id);

export default {
  create,
  findAll,
  countAll,
  findById,
  findBySlug,
  updateById,
  deleteById,
};
