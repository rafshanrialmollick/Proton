import ContactRepository from "../repository/contact.Repository.js";
import ApiError from "../utils/ApiError.js";

// ── Create ticket ─────────────────────────────────────────────────────────────

const createTicket = async ({ userId, body }) => {
  const data = {
    user: userId || null,
    subject: body.subject,
    category: body.category,
    guestName: body.guestName || null,
    guestEmail: body.guestEmail || null,
    guestPhone: body.guestPhone || null,
    relatedOrder: body.relatedOrder || null,
    relatedProduct: body.relatedProduct || null,
    messages: [
      {
        sender: userId || null,
        senderEmail: body.guestEmail || null,
        body: body.message,
        isStaffReply: false,
      },
    ],
  };

  return ContactRepository.create(data);
};

// ── Get all tickets (admin/staff) ─────────────────────────────────────────────

const getAllTickets = async (query = {}) => {
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.category) filter.category = query.category;
  if (query.assignedTo) filter.assignedTo = query.assignedTo;

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Number(query.limit) || 20);
  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    ContactRepository.findAll({ filter, skip, limit }),
    ContactRepository.countAll(filter),
  ]);

  return { tickets, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
};

// ── Get my tickets (customer) ─────────────────────────────────────────────────

const getMyTickets = async (userId, query = {}) => {
  const filter = { user: userId };
  if (query.status) filter.status = query.status;

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Number(query.limit) || 10);
  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    ContactRepository.findAll({ filter, skip, limit }),
    ContactRepository.countAll(filter),
  ]);

  return { tickets, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
};

// ── Get single ticket ─────────────────────────────────────────────────────────

const getTicketById = async (id, userId, role) => {
  const ticket = await ContactRepository.findById(id);
  if (!ticket) throw new ApiError(404, "Ticket not found");

  const isOwner = ticket.user && ticket.user._id.toString() === userId?.toString();
  const isStaff = ["admin", "moderator"].includes(role);

  if (!isOwner && !isStaff) {
    throw new ApiError(403, "Access denied");
  }

  return ticket;
};

// ── Reply to ticket ───────────────────────────────────────────────────────────

const replyToTicket = async (id, { userId, body, isStaff }) => {
  const ticket = await ContactRepository.findById(id);
  if (!ticket) throw new ApiError(404, "Ticket not found");

  if (["resolved", "closed"].includes(ticket.status)) {
    throw new ApiError(400, "Cannot reply to a resolved or closed ticket");
  }

  ticket.addMessage({
    sender: userId || null,
    body,
    isStaffReply: isStaff,
  });

  return ticket.save();
};

// ── Assign ticket ─────────────────────────────────────────────────────────────

const assignTicket = async (id, staffId) => {
  const ticket = await ContactRepository.findById(id);
  if (!ticket) throw new ApiError(404, "Ticket not found");
  ticket.assignTo(staffId);
  return ticket.save();
};

// ── Update priority ───────────────────────────────────────────────────────────

const updatePriority = async (id, priority) => {
  const ticket = await ContactRepository.findById(id);
  if (!ticket) throw new ApiError(404, "Ticket not found");
  ticket.priority = priority;
  return ticket.save();
};

// ── Resolve ───────────────────────────────────────────────────────────────────

const resolveTicket = async (id) => {
  const ticket = await ContactRepository.findById(id);
  if (!ticket) throw new ApiError(404, "Ticket not found");
  ticket.resolve();
  return ticket.save();
};

// ── Close ─────────────────────────────────────────────────────────────────────

const closeTicket = async (id) => {
  const ticket = await ContactRepository.findById(id);
  if (!ticket) throw new ApiError(404, "Ticket not found");
  ticket.close();
  return ticket.save();
};

// ── Rate satisfaction ─────────────────────────────────────────────────────────

const rateTicket = async (id, userId, score) => {
  const ticket = await ContactRepository.findById(id);
  if (!ticket) throw new ApiError(404, "Ticket not found");

  const isOwner = ticket.user && ticket.user._id.toString() === userId.toString();
  if (!isOwner) throw new ApiError(403, "Only the ticket owner can rate it");

  return ticket.rateSatisfaction(score);
};

// ── Delete (soft) ─────────────────────────────────────────────────────────────

const deleteTicket = async (id) => {
  const ticket = await ContactRepository.findById(id);
  if (!ticket) throw new ApiError(404, "Ticket not found");
  return ticket.softDelete();
};

export default {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicketById,
  replyToTicket,
  assignTicket,
  updatePriority,
  resolveTicket,
  closeTicket,
  rateTicket,
  deleteTicket,
};
