const category = require("../models/category");
const Category = require("../models/category");
const { getAll, insert, update, delete: remove } = require("./category");

jest.mock("../models/category.js");

describe("Category Controller", () => {
  describe("getAll()", () => {
    it("should get All categories", async () => {
      const req = {
        body: {
          title: "categoryTitle",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockedCategories = [
        {
          title: "categoryTitle",
          _id: "656c600e2d7e1882ba292acb",
          createdAt: "2023-12-03T11:01:34.922Z",
          updatedAt: "2023-12-03T11:01:34.922Z",
          __v: 0,
          id: "656c600e2d7e1882ba292acb",
        },
      ];
      Category.find.mockResolvedValueOnce(mockedCategories);

      await getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ categories: mockedCategories });
    });

    it("shoud throw an error if Unexpected error occurs", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Category.find.mockRejectedValueOnce(new Error("Unexpected error"));
      // Category.find.mockImplementation(() => {
      //   throw new Error("Unexpected error");
      // });

      await getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "fetching categories failed",
        e: new Error("Unexpected error"),
      });
    });

    it("should throw an error if no categories exists", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Category.find.mockResolvedValueOnce(null);

      await getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "fetching categories failed",
      });
    });
  });

  describe("insert()", () => {
    it("should return an error if body was not provided", async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await insert(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "category title is needed",
      });
    });

    it("should insert an category", async () => {
      const req = { body: { title: "categoryTitle" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockedCategory = {
        title: "categoryTitle",
        _id: "656c600e2d7e1882ba292acb",
        createdAt: "2023-12-03T11:01:34.922Z",
        updatedAt: "2023-12-03T11:01:34.922Z",
        __v: 0,
        id: "656c600e2d7e1882ba292acb",
      };
      Category.create.mockResolvedValueOnce(mockedCategory);
      await insert(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ category: mockedCategory });
    });

    it("should throw an error if creating category failed", async () => {
      const req = { body: { title: "categoryTitle" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockedCategory = {
        title: "categoryTitle",
        _id: "656c600e2d7e1882ba292acb",
        createdAt: "2023-12-03T11:01:34.922Z",
        updatedAt: "2023-12-03T11:01:34.922Z",
        __v: 0,
        id: "656c600e2d7e1882ba292acb",
      };
      Category.create.mockResolvedValueOnce(null);
      await insert(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "category creation failed",
      });
    });

    it("it should throw an error if Unexpected error occurs", async () => {
      const req = { body: { title: "categoryTitle" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Category.create.mockImplementation(() => {
        throw new Error("Unexpected error");
      });
      await insert(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "category creation failed",
        e: new Error("Unexpected error"),
      });
    });
  });

  describe("update()", () => {
    it("should throw an error if param was not provided", async () => {
      const req = { params: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await update(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "category id missing",
      });
    });

    it("should throw an error if param id is not valid", async () => {
      const req = { params: { id: "not-valid" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await update(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "category id not valid",
      });
    });

    it("should update category", async () => {
      const req = {
        params: { id: "656c600e2d7e1882ba292acb" },
        body: { title: "categoryTitle" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUpdatedValue = {
        title: "categoryTitle",
        _id: "656c600e2d7e1882ba292acb",
        createdAt: "2023-12-03T11:01:34.922Z",
        updatedAt: "2023-12-03T11:01:34.922Z",
        __v: 0,
        id: "656c600e2d7e1882ba292acb",
      };

      Category.findByIdAndUpdate.mockResolvedValueOnce(mockUpdatedValue);

      await update(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        updatedCategory: mockUpdatedValue,
      });
    });

    it("should throw an error if updating category failed", async () => {
      const req = {
        params: { id: "656c600e2d7e1882ba292acb" },
        body: { title: "categoryTitle" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Category.findByIdAndUpdate.mockResolvedValueOnce(null);

      await update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "updating category failed. please try later",
      });
    });

    it("should throw an error if Unexpected error occurs", async () => {
      const req = {
        params: { id: "656c600e2d7e1882ba292acb" },
        body: { title: "categoryTitle" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      Category.findByIdAndUpdate.mockRejectedValueOnce(
        new Error("Unexpected error")
      );

      await update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "updating category failed. please try later",
        e: new Error("Unexpected error"),
      });
    });
  });

  describe("delete()", () => {
    it("should throw an error if param id was not provided", async () => {
      const req = {
        params: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "category id missing",
      });
    });

    it("should throw an error if id is not valid", async () => {
      const req = {
        params: { id: "not-valid" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "category id not valid",
      });
    });

    it("should delete category", async () => {
      const req = {
        params: { id: "656c600e2d7e1882ba292acb" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const deletedCategory = {
        title: "categoryTitle",
        _id: "656c600e2d7e1882ba292acb",
        createdAt: "2023-12-03T11:01:34.922Z",
        updatedAt: "2023-12-03T11:01:34.922Z",
        __v: 0,
        id: "656c600e2d7e1882ba292acb",
      };

      category.findByIdAndDelete.mockResolvedValueOnce(deletedCategory);

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "category deleted",
      });
    });

    it("should throw an error if deleting category failed", async () => {
      const req = {
        params: { id: "656c600e2d7e1882ba292acb" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      category.findByIdAndDelete.mockResolvedValueOnce(null);

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "deleting category failed. please try later",
      });
    });

    it("should throw an error if Unexpected error occurs", async () => {
      const req = {
        params: { id: "656c600e2d7e1882ba292acb" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      category.findByIdAndDelete.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "deleting category failed. please try later",
        e: new Error("Unexpected error"),
      });
    });
  });
});
