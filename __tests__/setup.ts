const { RateLimitService } = require("../src/domain/rateLimit.service");

RateLimitService.checkLimit = jest.fn(() => true);