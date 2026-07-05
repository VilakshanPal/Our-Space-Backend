import rateLimit from "express-rate-limit";

export const rateLimitValidation = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: {
    status: "Failed",
    message: "Too many Requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});