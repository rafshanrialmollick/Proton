import Contact from "../model/contact.js";

const create = (data) => Contact.create(data);

const findAll = ({ filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 20 } = {}) =>
  Contact.find(filter)
    .populate("user", "fullName email")
    .populate("assignedTo", "fullName email")
    .sort(sort)
    .skip(skip)
    .limit(limit);

const countAll = (filter = {}) => Contact.countDocuments(filter);

const findById = (id) =>
  Contact.findById(id)
    .populate("user", "fullName email avatar")
    .populate("assignedTo", "fullName email")
    .populate("messages.sender", "fullName avatar");

const updateById = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteById = (id) => Contact.findByIdAndDelete(id);

export default {
  create,
  findAll,
  countAll,
  findById,
  updateById,
  deleteById,
};
