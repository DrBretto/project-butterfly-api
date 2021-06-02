const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Stocks Endpoints", function () {
  let db;

  const { testStrategies, testUsers } = helpers.makeStrategiesFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/stock`, () => {
    const {
      testStrategies,
      testUsers,
      testStocks,
    } = helpers.makeStrategiesFixtures();

    context("Given there are stocks in the database", () => {
      beforeEach("insert stocks", () =>
        helpers.seedStrategiesTables(db, testUsers, testStrategies, testStocks)
      );

      it("responds with 200 and all of the stocks", () => {
        const expectedStocks = helpers.makeExpectedStrategyStocks(
          testUsers,
          testStrategies[0].id,
          testStocks
        );
        return supertest(app)
          .get("/api/stock")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200);
      });
    });
  });

  describe(`POST /api/stock`, () => {
    beforeEach("insert strategies", () =>
      helpers.seedStrategiesTables(db, testUsers, testStrategies)
    );

    it(`creates a stock, responding with 201`, function () {
      this.retries(3);
      const testStrategy = testStrategies[0];
      const testUser = testUsers[0];
      const newStock = {
        ticker: "TEST",
        industry: "TestingSucks",
        shares: 4,
        price: 2,
        color: "#0088FE",
        yield: 1,
        eps1: 0.18,
        author_id:
          "$2a$12$RcKSB8GYaOfuHYZfE8sHkunaBAaRGxWTCVei8hXHGVCSbntTQjBS2",
        date_published: new Date("2029-01-22T16:28:32.615Z"),
        strategy_id: testStrategy.id,
      };
      return supertest(app)
        .post("/api/stock")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newStock)
        .expect(201)
        .expect((res) =>
          db
            .from("stock")
            .select("*")
            .where({ id: res.body.id })
            .first()
            .then((row) => {
              expect(row.strategy_id).to.eql(newStock.strategy_id);
              expect(row.user_id).to.eql(testUser.id);
              const expectedDate = new Date().toLocaleString("en", {
                timeZone: "UTC",
              });
              const actualDate = new Date(row.date_created).toLocaleString();
              expect(actualDate).to.eql(expectedDate);
            })
        );
    });

    const requiredFields = ["strategy_id"];

    requiredFields.forEach((field) => {
      const testStrategy = testStrategies[0];
      const testUser = testUsers[0];
      const newStock = {
        id: 1,
        ticker: "MSFT",
        industry: "Technology",
        shares: 40,
        price: 280.51,
        color: "#0088FE",
        yield: 1.15,
        eps1: 5.18,
        author_id:
          "$2a$12$RcKSB8GYaOfuHYZfE8sHkunaBAaRGxWTCVei8hXHGVCSbntTQjBS2",
        date_published: new Date("2029-01-22T16:28:32.615Z"),
        strategy_id: testStrategy.id,
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newStock[field];
        return supertest(app)
          .post("/api/stock")
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .send(newStock)
          .expect(400, {
            error: {
              message: `Missing '${field}' in request body`,
            },
          });
      });
    });
  });

  describe("DELETE /api/stock/:stock_id", () => {
    const stockIdToRemove = 2;
    const {
      testStrategies,
      testUsers,
      testStocks,
    } = helpers.makeStrategiesFixtures();

    context("Given no stocks", () => {
      it("responds with 404", () => {
        return supertest(app)
          .delete(`/api/stock/${stockIdToRemove}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404);
      });
    });

    context("Given there are stocks in the database", () => {
      beforeEach("insert stocks", () =>
        helpers.seedStrategiesTables(db, testUsers, testStrategies, testStocks)
      );

      it("responds with 204 and removes the stock", () => {
        const expectedStocks = testStocks.filter(
          (stock) => stock.id !== stockIdToRemove
        );
        console.log("stockIdToRemove", stockIdToRemove);
        return supertest(app)
          .delete(`/api/stock/${stockIdToRemove}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(204);
      });
    });
  });
});
