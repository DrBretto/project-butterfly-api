const knex = require("knex");
const bcrypt = require("bcryptjs");
const supertest = require("supertest");
const { expect } = require("chai");

const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Users endpoints", () => {
  let db;

  const { testUsers } = helpers.makeStrategiesFixtures();
  const testUser = testUsers[0];

  before("create knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  before("cleanup", () => helpers.cleanTables(db));

  after("destroy connection", () => db.destroy());

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe("POST /api/users", () => {
    context("User Validation", () => {
      beforeEach("insert users", () => {
        helpers.seedUsers(db, testUsers);
      });

      const requiredFields = ["full_name", "user_name", "password"];

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          full_name: "Testy Testofferson",
          username: "TestyTest",
          password: "passw0rd!",
        };
        it(`responds 400 required error when ${field} is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post("/api/users")
            .send(registerAttemptBody)
            .expect(400);
        });
      });
    });

    context("Happy Path", () => {
      it("responds 201, serialized user, storing bcrypted password", function () {
        this.retries(3);

        const newUser = {
          id: 1,
          user_name: "TestUser",
          full_name: "Test",
          nickname: "Testing",
          password:
            "$2a$12$RcKSB8GYaOfuHYZfE8sHkunaBAaRGxWTCVei8hXHGVCSbntTQjBS2",
          date_created: new Date("2029-01-22T16:28:32.615Z"),
        };
        return supertest(app)
          .post("/api/users")
          .send(newUser)
          .expect(201)
          .expect((res) => {
            expect(res.body).to.have.property("id");
            expect(res.body.username).to.eql(newUser.username);
            expect(res.body.full_name).to.eql(newUser.full_name);
            expect(res.body).to.not.have.property("password");
          })
          .expect((res) => {
            db("users")
              .select("*")
              .where({ id: res.body.id })
              .first()
              .then((row) => {
                expect(row.username).to.eql(newUser.username);
                expect(row.full_name).to.eql(newUser.full_name);
                return bcrypt.compare(newUser.password, row.password);
              })
              .then((compareMatch) => {
                expect(compareMatch).to.be.true;
              });
          });
      });
    });
  });
});
