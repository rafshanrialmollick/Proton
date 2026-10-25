import Review from "../model/review.js";

const create = (data) => Review.create(data);

const findAll = ({ filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 20 } = {}) =>
  Review.find(filter)
    .populate("user", "fullName avatar")
    .sort(sort)
    .skip(skip)
    .limit(limit);

const countAll = (filter = {}) => Review.countDocuments(filter);

const findById = (id) =>
  Review.findById(id).select("+helpfulVoters +notHelpfulVoters");

const findOne = (filter) => Review.findOne(filter);

const updateById = (id, data) =>
  Review.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = (id) => Review.findByIdAndDelete(id);

const getRatingBreakdown = (productId) => Review.getRatingBreakdown(productId);

export default {
  create,
  findAll,
  countAll,
  findById,
  findOne,
  updateById,
  deleteById,
  getRatingBreakdown,
};
