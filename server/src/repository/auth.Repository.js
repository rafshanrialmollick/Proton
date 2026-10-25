import AuthToken from "../model/auth.js";
import User from "../model/user.js";

// ── User ──────────────────────────────────────────────────────────────────────
const createUser = (data) => User.create(data);
const findUserByEmail = (email) => User.findByEmailWithPassword(email);
const findUserById = (id) => User.findById(id);

// ── Token ─────────────────────────────────────────────────────────────────────
const createToken = (data) => AuthToken.create(data);

const findToken = (filter) =>
  AuthToken.findOne(filter).select("+tokenHash +otpHash");

const revokeAllTokens = (userId, type) => AuthToken.revokeAll(userId, type);

const deleteToken = (id) => AuthToken.findByIdAndDelete(id);

export default {
  createUser,
  findUserByEmail,
  findUserById,
  createToken,
  findToken,
  revokeAllTokens,
  deleteToken,
};
