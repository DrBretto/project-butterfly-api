const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "TestUser",
      full_name: "Test",
      nickname: "Testing",
      password: "$2a$12$RcKSB8GYaOfuHYZfE8sHkunaBAaRGxWTCVei8hXHGVCSbntTQjBS2",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

function makeStrategiesArray(users) {
  return [
    {
      id: 1,
      title: "First strategy",
      author_id: users[0].password,
      date_published: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      title: "Second strategy",
      author_id: users[0].password,
      date_published: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      title: "Third strategy",
      author_id: users[0].password,
      date_published: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 4,
      title: "Fourth strategy",
      author_id: users[0].password,
      date_published: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

function makeStocksArray(users, strategies) {
  return [
    {
      id: 1,
      ticker: "MSFT",
      industry: "Technology",
      shares: 40,
      price: 280.51,
      color: "#0088FE",
      yield: 1.15,
      eps1: 5.18,
      author_id: users[0].password,
      date_published: new Date("2029-01-22T16:28:32.615Z"),
      strategy_id: strategies[0].id,
    },
    {
      id: 2,
      ticker: "BLAH",
      industry: "Other",
      shares: 10,
      price: 451,
      color: "#4444FE",
      yield: 1.5,
      eps1: 1.24,
      author_id: users[0].password,
      date_published: new Date("2029-01-22T16:28:32.615Z"),
      strategy_id: strategies[0].id,
    },
  ];
}

function makeExpectedStrategy(users, strategy, stocks = []) {
  const author = users.find((user) => user.id === strategy.author_id);

  const number_of_stocks = stocks.filter(
    (stock) => stock.strategy_id === strategy.id
  ).length;

  return {
    id: strategy.id,
    title: strategy.title,
    date_published: strategy.date_published.toISOString(),
  };
}

function makeExpectedStrategyStocks(users, strategyId, stocks) {
  const expectedStocks = stocks.filter(
    (stock) => stock.strategy_id === strategyId
  );

  return expectedStocks.map((stock) => {
    return {
      id: stock.id,
      ticker: stock.ticker,
      industry: stock.industry,
      shares: stock.shares,
      price: stock.price,
      color: stock.color,
      yield: stock.yield,
      eps1: stock.eps1,
      author_id: stock.author_id,
      date_published: new Date("2029-01-22T16:28:32.615Z"),
      strategy_id: strategyId,
    };
  });
}

function makeStrategiesFixtures() {
  const testUsers = makeUsersArray();
  const testStrategies = makeStrategiesArray(testUsers);
  const testStocks = makeStocksArray(testUsers, testStrategies);
  return { testUsers, testStrategies, testStocks };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE TABLE users, strategy, stock ;
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE strategy_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE stock_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('strategy_id_seq', 0)`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('stock_id_seq', 0)`),
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: "$2a$12$RcKSB8GYaOfuHYZfE8sHkunaBAaRGxWTCVei8hXHGVCSbntTQjBS2",
  }));
  return db
    .into("users")
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function seedStrategiesTables(db, users, strategies, stocks = []) {
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await trx.into("strategy").insert(strategies);
    await trx.raw(`SELECT setval('strategy_id_seq', ?)`, [
      strategies[strategies.length - 1].id,
    ]);
    if (stocks.length) {
      await trx.into("stock").insert(stocks);
      await trx.raw(`SELECT setval('stock_id_seq', ?)`, [
        stocks[stocks.length - 1].id,
      ]);
    }
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeStrategiesArray,
  makeExpectedStrategy,
  makeExpectedStrategyStocks,
  makeStocksArray,
  makeStrategiesFixtures,
  cleanTables,
  seedStrategiesTables,
  makeAuthHeader,
  seedUsers,
};
