const app = require("../src/app");
const supertest = require("supertest");
const { expect } = require("chai");

describe("App", () => {
  it('GET / responds with 200containing "Hello, world!"', () => {
    return supertest(app).get("/").expect(200, "Hello, world!");
  });
});
