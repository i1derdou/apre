/**
 * Author: Professor Krasso
 * Date: 10 September 2024
 * File: index.spec.js
 * Description: Test the agent performance API
 */

// Require the modules
const request = require('supertest');
const app = require('../../../../src/app');
const { mongo } = require('../../../../src/utils/mongo');

jest.mock('../../../../src/utils/mongo');

// Test the agent performance API
describe('Apre Agent Performance API', () => {
  afterEach(() => {
    mongo.mockClear();
  });

  // Test the call-duration-by-date-range endpoint
  it('should fetch call duration data for agents within a specified date range', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              agents: ['Agent A', 'Agent B'],
              callDurations: [120, 90]
            }
          ])
        })
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/agent-performance/call-duration-by-date-range?startDate=2023-01-01&endDate=2023-01-31');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        agents: ['Agent A', 'Agent B'],
        callDurations: [120, 90]
      }
    ]);
  });

  // Test the performance-by-customer-feedback endpoint
  it('should fetch performance data for agents by customer feedback', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              totalRating: 18,
              averageRating: 4.5,
              feedbackCount: 4,
              agentId: 1000,
              agentName: 'John Doe'
            }
          ])
        })
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/agent-performance/performance-by-customer-feedback');
    expect(response.status).toBe(200);
    expect(response.body).toContainEqual({
      totalRating: 18,
      averageRating: 4.5,
      feedbackCount: 4,
      agentId: 1000,
      agentName: 'John Doe'
    });
  });

  // Test invalid endpoint
  it('should return 404 for an invalid endpoint', async () => {
    const response = await request(app).get('/api/reports/agent-performance/invalid-endpoint');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Not Found',
      status: 404,
      type: 'error'
    });
  });
});
