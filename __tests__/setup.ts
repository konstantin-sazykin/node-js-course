const { RateLimitService } = require("../src/domain/rateLimit.service");

RateLimitService.checkLimit = jest.fn(() => Promise.resolve('It is from mocked function'));

console.info = jest.fn();
console.error = jest.fn();