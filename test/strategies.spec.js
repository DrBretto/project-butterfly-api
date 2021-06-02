const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Strategies Endpoints", function () {
  let db;

  const {
    testUsers,
    testStrategies,
    testStocks,
  } = helpers.makeStrategiesFixtures();

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

  describe(`GET /api/strategy`, () => {
    context("Given there are strategies in the database", () => {
      beforeEach("insert strategies", () =>
        helpers.seedStrategiesTables(db, testUsers, testStrategies, testStocks)
      );

      it("responds with 200 and all of the strategies", () => {
        const expectedStrategies = testStrategies.map((strategy) =>
          helpers.makeExpectedStrategy(testUsers, strategy, testStocks)
        );
        return supertest(app)
          .get("/api/strategy")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedStrategies);
      });
    });
  });

  describe(`GET /api/strategy/:strategy_id`, () => {
    context(`Given no strategies`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const strategyId = 123456;
        return supertest(app)
          .get(`/api/strategy/${strategyId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, {
            "error": {
              "message": "strategy doesn't exist",
            },
          });
      });
    });

    context("Given there are strategies in the database", () => {
      beforeEach("insert strategies", () =>
        helpers.seedStrategiesTables(db, testUsers, testStrategies, testStocks)
      );

      it("responds with 200 and the specified strategy", () => {
        const strategyId = 2;
        const expectedStrategy = helpers.makeExpectedStrategy(
          testUsers,
          testStrategies[strategyId - 1],
          testStocks
        );

        return supertest(app)
          .get(`/api/strategy/${strategyId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedStrategy);
      });
    });
  });

  describe(`POST /api/strategy`, () => {
    beforeEach("insert strategies", () =>
      helpers.seedStrategiesTables(db, testUsers, testStrategies)
    );

    it(`creates a strategy, responding with 201`, function () {
      this.retries(3);
      const testStrategy = testStrategies[0];
      const testUser = testUsers[0];
      const newStrategy = {
        title: "TEST",
        author_id:
          "$2a$12$RcKSB8GYaOfuHYZfE8sHkunaBAaRGxWTCVei8hXHGVCSbntTQjBS2",
        date_published: new Date("2029-01-22T16:28:32.615Z"),
      };
      return supertest(app)
        .post("/api/strategy")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newStrategy)
        .expect(201)
        .expect((res) =>
          db
            .from("strategy")
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
  });
});
