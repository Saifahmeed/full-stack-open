const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const bcrypt = require("bcrypt");
const User = require("../models/user");
const helper = require("./api_test_helper");

describe("User Management API", () => {
  beforeEach(async () => {
    await helper.firstUser();
  });

  describe("User Registration", () => {
    test("should fail to create a user if username already exists", async () => {
      const usersAtStart = await helper.usersInDb();

      const duplicateUser = {
        username: "Userrrr",
        name: "duplicateEntry",
        password: "password123",
      };

      const response = await api
        .post("/api/users")
        .send(duplicateUser)
        .expect(400);

      expect(response.body.error).toContain("expected `username` to be unique");

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test("should successfully create a new user with valid details", async () => {
      const usersAtStart = await helper.usersInDb();

      const freshUser = {
        username: "Sam99",
        name: "Saif Ahmed",
        password: "securepa123",
      };

      await api
        .post("/api/users")
        .send(freshUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

      const usernames = usersAtEnd.map((user) => user.username);
      expect(usernames).toContain(freshUser.username);
    });

    test("should return 400 if username is missing", async () => {
      const usersAtStart = await helper.usersInDb();

      const userWithoutUsername = {
        name: "NoUsername Guy",
        password: "somepassword",
      };

      await api.post("/api/users").send(userWithoutUsername).expect(400);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);

      const names = usersAtEnd.map((user) => user.name);
      expect(names).not.toContain(userWithoutUsername.name);
    });

    test("should return 400 for an invalid username length", async () => {
      const usersAtStart = await helper.usersInDb();

      const invalidUser = {
        username: "Jo",
        password: "weakpass",
      };

      await api.post("/api/users").send(invalidUser).expect(400);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);

      const usernames = usersAtEnd.map((user) => user.username);
      expect(usernames).not.toContain(invalidUser.username);
    });
  });
});
