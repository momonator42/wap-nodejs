const { default: RedisMock } = require('ioredis-mock');

module.exports = {
    createClient: jest.fn(() => new RedisMock()), // Verwende ioredis-mock als gemockten Redis-Client
};