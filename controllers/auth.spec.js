const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { register, login } = require("./auth");
const jwt = require("jsonwebtoken");

jest.mock("../models/user.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  describe("register()", () => {
    it("should return error if required fields are missing", async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "auth body is needed" });
    });

    it("should return error if user with email already exists", async () => {
      const req = {
        body: {
          username: "test",
          email: "test@example.com",
          password: "password",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockReturnValueOnce({
        username: "tlemir55",
        email: "test@example.com",
      });
      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "user with thease credentials already exists",
      });
    });

    it("should hash password and create user", async () => {
      const req = {
        body: {
          username: "tlemir55",
          email: "tlemir55@gmail.com",
          password: "simplePassword",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.findOne.mockReturnValueOnce(null);

      jest
        .spyOn(bcrypt, "hash")
        .mockReturnValueOnce("hashedSimplePassword", 10);

      User.create.mockReturnValueOnce({
        username: "tlemir55",
        email: "tlemir55@gmail.com",
        password: "hashedSimplePassword",
      });

      await register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});
