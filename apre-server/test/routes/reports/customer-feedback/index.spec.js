/**
 * Author: Professor Krasso
 * Date: 10 September 2024
 * File: index.spec.js
 * Description: Test the customer feedback API
 */

const request = require('supertest');
const app = require('../../../../src/app');
const { mongo } = require('../../../../src/utils/mongo');

jest.mock('../../../../src/utils/mongo'); // Mock globally

describe("Apre Customer Feedback API", () => {
  beforeEach(() => {
    jest.spyOn(mongo, "mockImplementation").mockClear();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should fetch average customer feedback ratings by channel for a specified month", async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              channels: ["Email", "Phone"],
              ratingAvg: [4.5, 3.8],
            },
          ]),
        }),
      };
      await callback(db);
    });

    const response = await request(app).get("/api/reports/customer-feedback/channel-rating-by-month?month=1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        channels: ["Email", "Phone"],
        ratingAvg: [4.5, 3.8],
      },
    ]);
  });

  it("should return 400 if the month parameter is missing", async () => {
    const response = await request(app).get("/api/reports/customer-feedback/channel-rating-by-month");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "month and channel are required",
      status: 400,
      type: "error",
    });
  });

  it("should return 404 for an invalid endpoint", async () => {
    const response = await request(app).get("/api/reports/customer-feedback/invalid-endpoint");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Not Found",
      status: 404,
      type: "error",
    });
  });
});

describe("GET /customer-feedback-by-product", () => {
  beforeAll(async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnValue({
          aggregate: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([
              {
                _id: "Smartphone X",
                averageRating: 3.0,
                totalFeedback: 2,
                positiveFeedback: 1,
                neutralFeedback: 0,
                negativeFeedback: 1,
                feedbackDetails: [
                  {
                    customer: "Jim Halpert",
                    rating: 4,
                    feedbackText: "Great product!",
                    feedbackType: "Positive",
                    feedbackSource: "Phone",
                    date: new Date(),
                  },
                ],
              },
            ]),
          }),
        }),
      };
      await callback(db);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("Should return a 200 status and JSON response", async () => {
    const response = await request(app).get("/api/reports/customer-feedback/customer-feedback-by-product");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");
  });

  test("Should return aggregated feedback grouped by product", async () => {
    const response = await request(app).get("/api/reports/customer-feedback/customer-feedback-by-product");

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);

    const productNames = response.body.map((item) => item._id);
    expect(productNames).toContain("Smartphone X");

    const smartphoneXFeedback = response.body.find((item) => item._id === "Smartphone X");
    expect(smartphoneXFeedback.totalFeedback).toBe(2);
    expect(smartphoneXFeedback.positiveFeedback).toBe(1);
    expect(smartphoneXFeedback.negativeFeedback).toBe(1);
  });

  test("Should return an empty array if no feedback exists", async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnValue({
          aggregate: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([]), // Simulating empty DB
          }),
        }),
      };
      await callback(db);
    });

    const response = await request(app).get("/api/reports/customer-feedback/customer-feedback-by-product");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
