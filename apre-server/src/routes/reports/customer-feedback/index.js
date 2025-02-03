/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre customer feedback API for the customer feedback reports
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');
const createError = require('http-errors');

const router = express.Router();

/**
 * @description
 *
 * GET /channel-rating-by-month
 *
 * Fetches average customer feedback ratings by channel for a specified month.
 *
 * Example:
 * fetch('/channel-rating-by-month?month=1')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/channel-rating-by-month', (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      return next(createError(400, 'month and channel are required'));
    }

    mongo (async db => {
      const data = await db.collection('customerFeedback').aggregate([
        {
          $addFields: {
            date: { $toDate: '$date' }
          }
        },
        {
          $group: {
            _id: {
              channel: "$channel",
              month: { $month: "$date" },
            },
            ratingAvg: { $avg: '$rating'}
          }
        },
        {
          $match: {
            '_id.month': Number(month)
          }
        },
        {
          $group: {
            _id: '$_id.channel',
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channel: '$_id',
            ratingAvg: 1
          }
        },
        {
          $group: {
            _id: null,
            channels: { $push: '$channel' },
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channels: 1,
            ratingAvg: 1
          }
        }
      ]).toArray();

      res.send(data);
    }, next);

  } catch (err) {
    console.error('Error in /rating-by-date-range-and-channel', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /performance-by-customer-feedback
 *
 * Fetches performance data for agent by customer feedback.
 *
 * Example:
 * fetch('/performance-by-customer-feedback')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
// Define the route
router.get('/performance-by-customer-feedback', async (req, res, next) => {
  try {
    console.log('Fetching performance data by customer feedback');

    // Connect to the MongoDB database and fetch data
    await mongo(async (db) => {
      const data = await db.collection('customerFeedback').aggregate([
        {
          $group: {
            _id: "$agentId", // Group by agentId
            totalRating: { $sum: "$rating" }, // Sum up the ratings
            averageRating: { $avg: "$rating" }, // Calculate the average rating
            feedbackCount: { $count: {} } // Count the number of feedbacks
          }
        },
        {
          $lookup: {
            from: "agents", // Join with the agents collection
            localField: "_id", // agentId in customerFeedback (grouped field)
            foreignField: "agentId", // agentId in agents collection
            as: "agentDetails" // Alias for the joined data
          }
        },
        {
          $unwind: "$agentDetails" // Unwind the agentDetails array to include agent information
        },
        {
          $project: {
            _id: 0, // Exclude the default _id field from the output
            agentId: "$_id", // Rename _id to agentId
            agentName: "$agentDetails.name", // Include agent name
            totalRating: 1,
            averageRating: 1,
            feedbackCount: 1
          }
        },
        {
          $sort: { agentId: 1 } // Sort by agentId in ascending order
        }
      ]).toArray();

      // Respond with the aggregated data
      res.status(200).json(data);
    });
  } catch (err) {
    console.error('Error in /performance-by-customer-feedback', err);
    next(err);
  }
});


/**
 * @description
 *
 * GET /customer-feedback-by-product
 *
 * Fetches customer feedback by product.
 *
 * Example:
 * fetch('/customer-feedback-by-product')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
// Define the route
router.get('/customer-feedback-by-product', async (req, res, next) => {
  try {
    console.log('Fetching customer feedback by product');

    // Connect to the MongoDB database and fetch data
    await mongo(async (db) => {
      const data = await db.collection("customerFeedback").aggregate([
        {
          $group: {
            _id: "$product",
            averageRating: { $avg: "$rating" },
            totalFeedback: { $sum: 1 },
            positiveFeedback: {
              $sum: { $cond: [{ $eq: ["$feedbackSentiment", "Positive"] }, 1, 0] }
            },
            neutralFeedback: {
              $sum: { $cond: [{ $eq: ["$feedbackSentiment", "Neutral"] }, 1, 0] }
            },
            negativeFeedback: {
              $sum: { $cond: [{ $eq: ["$feedbackSentiment", "Negative"] }, 1, 0] }
            },
            feedbackDetails: {
              $push: {
                customer: "$customer",
                rating: "$rating",
                feedbackText: "$feedbackText",
                feedbackType: "$feedbackType",
                feedbackSource: "$feedbackSource",
                date: "$date"
              }
            }
          }
        },
        {
          $sort: { averageRating: -1 }
        }
      ]).toArray();

      // Respond with the aggregated data
      res.status(200).json(data);
    });
  } catch (err) {
    console.error('Error in /customer-feedback-by-product', err);
    next(err);
  }
});

module.exports = router;