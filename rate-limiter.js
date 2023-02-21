const rateLimit = require('express-rate-limit');
const { logger } = require('./expressLogger');

const getKey = (req) => {
  // @ts-ignore
  const id = req.user?._id;
  const key = id ? req.ip + '-_-' + id : req.ip;
  return key;
};
const defaultRequestsPerSecond = 20;

const getRateLimiter = () => {
  const limiter = rateLimit({
    handler: (request, response, next, options) => {
      response.status(options.statusCode).json({
        error: 'Too many requests, please try again later',
      });
      const key = getKey(request);
      logger.info(
        `${key} tried to access ${
          request.originalUrl
        } too many times. ${JSON.stringify(options, null, 2)}`
      );
      next(`Rate limited for ${request.originalUrl}: ${key}`);
    },
    // Use a custom key made up of the users id and ip, instead of just the ip.
    // This is useful if you have multiple users on the same IP address.
    // But will still limit the ip to only allow an ip address to attempt a login every so often etc...
    // each logged in user will have their own key and be limited separately
    keyGenerator: getKey,
    max: 20, // limit each IP to X requests per windowMS
    windowMs: 1 * 60 * 1000, // 1 minute
  });
  return limiter;
};

module.exports = {
    getRateLimiter,
}
