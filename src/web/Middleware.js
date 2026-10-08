export function securityHeaders(_request, response, next) {
  response.setHeader(
    'X-Content-Type-Options',
    'nosniff',
  );

  response.setHeader(
    'X-Frame-Options',
    'SAMEORIGIN',
  );

  response.setHeader(
    'Referrer-Policy',
    'strict-origin-when-cross-origin',
  );

  next();
}

export function notFoundHandler(_request, response) {
  response.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found.',
    },
  });
}

export function errorHandler(error, _request, response, _next) {
  const status =
    Number.isInteger(error?.statusCode) &&
    error.statusCode >= 400 &&
    error.statusCode < 600
      ? error.statusCode
      : 500;

  if (status >= 500) {
    console.error({
      level: 'error',
      message: error?.message ?? 'Internal server error',
      stack: error?.stack,
    });
  }

  response.status(status).json({
    error: {
      code:
        status >= 500
          ? 'INTERNAL_SERVER_ERROR'
          : 'REQUEST_ERROR',
      message:
        status >= 500
          ? 'An internal server error occurred.'
          : error.message,
    },
  });
}