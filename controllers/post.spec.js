const Category = require("../models/post");
const { getAll } = require("./post");

jest.mock("../models/post.js");

describe("Post Controller", () => {
  describe("getAll()", () => {
    it("should get all categories", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };


      const mockedPosts={
        
      }

      await getAll(req, res);
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({posts})


    });
  });
});
