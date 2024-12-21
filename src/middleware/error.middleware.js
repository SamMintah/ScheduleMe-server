// middleware/error-handler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging

    // Check if the error has a specific status code; otherwise, default to 500
    const statusCode = err.statusCode || 500;

    // Determine the error message. Use a generic message for 500 errors in production.
    let message = err.message;
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        message = 'Internal Server Error';
    }

    // Prepare the error response object
    const errorResponse = {
        status: 'error',
        statusCode,
        message,
    };

    // Include detailed error information in development mode
    if (process.env.NODE_ENV !== 'production') {
        errorResponse.stack = err.stack;
        if (err.errors) {
            errorResponse.errors = err.errors
        }
    }

    res.status(statusCode).json(errorResponse);
};

export default errorHandler;