const request = require("supertest");
const app = require("../index");

let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTk2NjQ4ZGE5OGI2YTI5NzFiZWJjNTIiLCJpYXQiOjE3MDQzNTU3ODQsImV4cCI6MTcwNDQ0MjE4NH0.gBHasGAWLD51QNLPkWGbQg2HcsmRqQCBNDs4I93qMpk";
const payload = {
  name: "test",
  email: "test@gmail.com",
  password: "123456",
};

describe("Authentication Tests", () => {
  it("should get user information", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Successfully get me");
    expect(response.body.data).toHaveProperty(
      "_id",
      "6596648da98b6a2971bebc52"
    );
  });
});

describe("Notes Test Case", () => {
  it("should get notes for authenticaed user", async () => {
    const response = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Successfully get notes");
  });

  it("should add note for authenticaed user", async () => {
    const response = await request(app)
      .post("/api/notes/")
      .send({ title: "first", description: "this is description" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Successfully added note");
  });

  it("should get note by id for authenticaed user", async () => {
    const response = await request(app)
      .get("/api/notes/65966d7d97ce7c3922f00505")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Successfully get note by id"
    );
  });

  it("should update note by id for authenticaed user", async () => {
    const response = await request(app)
      .put("/api/notes/65966d7d97ce7c3922f00505")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Successfully updated note by id"
    );
  });

  // it("should delete note by id for authenticaed user", async () => {
  //   const response = await request(app)
  //     .delete("/api/notes/65966d7d97ce7c3922f00505")
  //     .set("Authorization", `Bearer ${token}`);

  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toHaveProperty(
  //     "message",
  //     "Successfully deleted note by id"
  //   );
  // });

  // it("should share note to user for authenticaed user", async () => {
  //   const response = await request(app)
  //     .post(
  //       "/api/notes/65966d7d97ce7c3922f00505/share?toUserId=6595491f09403e7cd2860e4d"
  //     )
  //     .set("Authorization", `Bearer ${token}`);

  //   expect(response.statusCode).toBe(200);
  //   expect(response.body).toHaveProperty(
  //     "message",
  //     "Successfully shared note to user"
  //   );
  // });
});
