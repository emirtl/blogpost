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

  describe("login()", () => {
    it("should return error if required fields are missing", async () => {
      const req = {
        body: {},
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "auth body is needed" });
    });

    it("should return error if user does not exist", async () => {
      const req = {
        body: { email: "tlemir55@gmail.com", password: "simplePassword" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.findOne.mockReturnValueOnce(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "user with thease credentials does not exist",
      });
    });

    it("should verify password before generating token", async () => {
      const req = {
        body: { email: "tlemir55@gmail.com", password: "simplePassword" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.findOne.mockReturnValueOnce({
        _id: "2312da23",
        username: "tlemir55",
        email: "tlemir55gmail.com",
        password: "hashedPassword",
      });

      await login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        req.body.password,
        "hashedPassword"
      );
    });

    it("should generate token if password is valid", async () => {
      const req = {
        body: { email: "tlemir55@gmail.com", password: "simplePassword" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const existedUser = {
        _id: "2312da23",
        username: "tlemir55",
        email: "tlemir55@gmail.com",
        password: "hashedPassword",
        admin: false,
        owner: false,
      };

      User.findOne.mockReturnValueOnce(existedUser);
      bcrypt.compare.mockReturnValueOnce(true);
      jwt.sign.mockReturnValueOnce("mockedToken");

      await login(req, res);

      const tokenPayload = {
        email: existedUser.email,
        id: existedUser._id,
        isAdmin: existedUser.admin,
        isOwner: existedUser.owner,
      };

      expect(jwt.sign).toHaveBeenCalledWith(tokenPayload, process.env.SECRET, {
        algorithm: "HS256",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ token: "mockedToken" });
    });

    it("should handle unexpected errors", async () => {
      const req = {
        body: { email: "test@example.com", password: "password" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      User.findOne.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "user creation failed",
        e: new Error('Unexpected error'),
      });
    });
  });
});
