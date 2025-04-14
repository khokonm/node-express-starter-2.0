/**
 * Security middleware to add protection against common web vulnerabilities
 */

const securityMiddleware = (req, res, next) => {
  // Set security headers
  // Protect against XSS attacks
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Protect against clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Implement strict Content Security Policy
  // Customize this based on your application's needs
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'"
  );
  
  // Implement HSTS (HTTP Strict Transport Security)
  // Only enable in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Prevent browsers from caching sensitive information
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  next();
};

module.exports = securityMiddleware;