/**
 * Rate limiting middleware to protect against brute force attacks
 */

const rateLimit = require('express-rate-limit');

// General rate limiter for all routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});

// More strict rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: false,
    message: 'Too many login attempts from this IP, please try again after an hour'
  }
});

// Rate limiter for API routes
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Limit each IP to 50 requests per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: false,
    message: 'Too many requests from this IP, please try again after 5 minutes'
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  apiLimiter
};