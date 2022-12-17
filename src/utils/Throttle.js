const throttle = require('express-rate-limit') ;


const meta = {
    message: 'Exceed 30 request per second',
    status: 'HTTP_TOO_MANY_REQUESTS',
    statusCode: 429,
    errors: null
};

// Blocking when exceed more than 15 request per second
const ThrottleExpressMiddleware = throttle({
    windowMs: 1000, // 1 second
    max: 30, // start blocking after 30 request
    message: meta
});

module.exports= {ThrottleExpressMiddleware};