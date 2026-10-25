import { Router } from "express";
import {
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
} from "../controller/contact.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// ── Public (guest can submit a ticket without an account) ─────────────────────
router.post("/", createTicket);

// ── Protected ─────────────────────────────────────────────────────────────────
router.use(protect);

router.get("/my", getMyTickets);
router.get("/", authorize("admin", "moderator"), getAllTickets);

router.get("/:id", getTicketById);
router.post("/:id/reply", replyToTicket);
router.post("/:id/rate", rateTicket);

// ── Staff only ────────────────────────────────────────────────────────────────
router.patch("/:id/assign", authorize("admin", "moderator"), assignTicket);
router.patch("/:id/priority", authorize("admin", "moderator"), updatePriority);
router.patch("/:id/resolve", authorize("admin", "moderator"), resolveTicket);
router.patch("/:id/close", authorize("admin", "moderator"), closeTicket);
router.delete("/:id", authorize("admin"), deleteTicket);

export default router;
