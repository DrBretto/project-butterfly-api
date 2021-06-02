const express = require("express");
const StockService = require("./stock-service");
const xss = require("xss");
const stockRouter = express.Router();
const jsonParser = express.json();
const path = require("path");
const { requireAuth } = require("../middleware/jwt-auth");

const serializeStock = (stock) => ({
  id: stock.id,
  ticker: stock.ticker,
  industry: stock.industry,
  shares: stock.shares,
  price: stock.price,
  eps1: stock.eps1,
  color: stock.color,
  yield: stock.yield,
  strategy_id: stock.strategy_id,
  author_id: stock.author_id,
  date_published: stock.date_published,
});

stockRouter
  .route("/")
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    const userId = req.user.password;

    StockService.getAllStocks(knexInstance, userId)
      .then((stock) => {
        res.json(stock.map(serializeStock));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      ticker,
      industry,
      shares,
      price,
      eps1,
      color,
      yield,
      strategy_id,
    } = req.body;
    const newStock = {
      ticker,
      industry,
      shares,
      price,
      eps1,
      color,
      yield,
      strategy_id,
    };
    const userId = req.user.password;
    newStock.author_id = userId;

    for (const [key, value] of Object.entries(newStock))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    StockService.insertStock(req.app.get("db"), newStock)
      .then((stock) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${stock.id}`))
          .json(serializeStock(stock));
      })
      .catch(next);
  });

stockRouter
  .all(requireAuth)
  .route("/:id")
  .all((req, res, next) => {
    StockService.getById(req.app.get("db"), req.params.id)
      .then((stock) => {
        if (!stock) {
          return res.status(404).json({
            error: { message: `stock doesn't exist` },
          });
        }
        res.stock = stock;
        next();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    StockService.deleteStock(req.app.get("db"), req.params.id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = stockRouter;
