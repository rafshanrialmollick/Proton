import ContactService from "../services/contact.Service.js";
import ApiResponse from "../utils/apiResponse.js";

// POST /api/v1/contact
export const createTicket = async (req, res, next) => {
  try {
    const ticket = await ContactService.createTicket({
      userId: req.user?._id || null,
      body: req.body,
    });
    res.status(201).json(new ApiResponse(201, ticket, "Support ticket created successfully"));
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/contact  [admin | moderator]
export const getAllTickets = async (req, res, next) => {
  try {
    const result = await ContactService.getAllTickets(req.query);
    res.status(200).json(new ApiResponse(200, result, "Tickets fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/contact/my  [customer]
export const getMyTickets = async (req, res, next) => {
  try {
    const result = await ContactService.getMyTickets(req.user._id, req.query);
    res.status(200).json(new ApiResponse(200, result, "Your tickets fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/contact/:id
export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await ContactService.getTicketById(
      req.params.id,
      req.user?._id,
      req.user?.role
    );
    res.status(200).json(new ApiResponse(200, ticket, "Ticket fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/contact/:id/reply
export const replyToTicket = async (req, res, next) => {
  try {
    const isStaff = ["admin", "moderator"].includes(req.user?.role);
    const ticket = await ContactService.replyToTicket(req.params.id, {
      userId: req.user?._id || null,
      body: req.body.message,
      isStaff,
    });
    res.status(200).json(new ApiResponse(200, ticket, "Reply sent successfully"));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/contact/:id/assign  [admin | moderator]
export const assignTicket = async (req, res, next) => {
  try {
    const ticket = await ContactService.assignTicket(req.params.id, req.body.staffId);
    res.status(200).json(new ApiResponse(200, ticket, "Ticket assigned successfully"));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/contact/:id/priority  [admin | moderator]
export const updatePriority = async (req, res, next) => {
  try {
    const ticket = await ContactService.updatePriority(req.params.id, req.body.priority);
    res.status(200).json(new ApiResponse(200, ticket, "Priority updated"));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/contact/:id/resolve  [admin | moderator]
export const resolveTicket = async (req, res, next) => {
  try {
    const ticket = await ContactService.resolveTicket(req.params.id);
    res.status(200).json(new ApiResponse(200, ticket, "Ticket resolved"));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/contact/:id/close  [admin | moderator]
export const closeTicket = async (req, res, next) => {
  try {
    const ticket = await ContactService.closeTicket(req.params.id);
    res.status(200).json(new ApiResponse(200, ticket, "Ticket closed"));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/contact/:id/rate  [customer]
export const rateTicket = async (req, res, next) => {
  try {
    const ticket = await ContactService.rateTicket(
      req.params.id,
      req.user._id,
      req.body.score
    );
    res.status(200).json(new ApiResponse(200, ticket, "Thank you for your feedback"));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/contact/:id  [admin]
export const deleteTicket = async (req, res, next) => {
  try {
    await ContactService.deleteTicket(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Ticket deleted"));
  } catch (error) {
    next(error);
  }
};
