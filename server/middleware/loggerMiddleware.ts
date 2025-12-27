import { RequestHandler } from 'express';

const colors = {
  reset: '\x1b[0m',
  method: '\x1b[36m', // Cyan
  success: '\x1b[32m', // Green
  warn: '\x1b[33m', // Yellow
  error: '\x1b[31m', // Red
  info: '\x1b[90m', // Gray
};

export const RequestMiddleware: RequestHandler = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toLocaleTimeString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    
    // Determine color based on status code
    let statusColor = colors.success;
    if (status >= 400) statusColor = colors.warn;
    if (status >= 500) statusColor = colors.error;

    console.log(
      `[${colors.info}${timestamp}${colors.reset}] ` +
      `${colors.method}${req.method}${colors.reset} ` +
      `${req.path} ` +
      `${statusColor}${status}${colors.reset} ` +
      `+${duration}ms`
    );

    if (req.body && Object.keys(req.body).length > 0) {
      console.log(`${colors.info} Body:${colors.reset}`, JSON.stringify(req.body, null, 2));
    }
  });

  next();
}; 



