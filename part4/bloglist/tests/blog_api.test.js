const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const BlogEntry = require("../models/blog");
const UserAccount = require("../models/user");
const testHelper = require("./test_helper");

beforeEach(async () => {
  await BlogEntry.deleteMany({});
  await BlogEntry.insertMany(testHelper.sampleBlogs);
  await UserAccount.deleteMany({});
  await testHelper.setupUser();
});

describe("Fetching blog entries", () => {
  test("should retrieve blogs in JSON format", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("should return the expected number of blogs", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(testHelper.sampleBlogs.length);
  });

  test("should have 'id' as the identifier field", async () => {
    const response = await api.get("/api/blogs");
    response.body.forEach((entry) => {
      expect(entry.id).toBeDefined();
      expect(entry._id).toBeUndefined();
    });
  });
});

describe("Adding a new blog entry", () => {
  test("should successfully store a new blog", async () => {
    const blogsBefore = await testHelper.blogsFromDb();
    const loggedUser = await api
      .post("/api/login")
      .send(testHelper.userCredentials);

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${loggedUser.body.token}`)
      .send(testHelper.newBlogPost)
      .expect(201);

    const storedBlog = response.body;
    const blogsAfter = await testHelper.blogsFromDb();

    expect(storedBlog.title).toBe(testHelper.newBlogPost.title);
    expect(storedBlog.author).toBe(testHelper.newBlogPost.author);
    expect(storedBlog.url).toBe(testHelper.newBlogPost.url);
    expect(storedBlog.user.username).toBe(loggedUser.body.username);
    expect(blogsAfter).toHaveLength(blogsBefore.length + 1);
  });

  test("should assign 0 likes if likes field is absent", async () => {
    const blogsBefore = await testHelper.blogsFromDb();
    const loggedUser = await api
      .post("/api/login")
      .send(testHelper.userCredentials);

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${loggedUser.body.token}`)
      .send(testHelper.blogWithoutLikes)
      .expect(201);

    const storedBlog = response.body;
    const blogsAfter = await testHelper.blogsFromDb();

    expect(storedBlog.likes).toBe(0);
    expect(blogsAfter).toHaveLength(blogsBefore.length + 1);
  });

  test("should reject a blog without a title", async () => {
    const blogsBefore = await testHelper.blogsFromDb();
    const loggedUser = await api
      .post("/api/login")
      .send(testHelper.userCredentials);

    await api
      .post("/api/blogs/")
      .set("Authorization", `Bearer ${loggedUser.body.token}`)
      .send(testHelper.blogMissingTitle)
      .expect(400);

    const blogsAfter = await testHelper.blogsFromDb();
    expect(blogsAfter).toHaveLength(blogsBefore.length);
  });

  test("should reject a blog without a URL", async () => {
    const blogsBefore = await testHelper.blogsFromDb();
    const loggedUser = await api
      .post("/api/login")
      .send(testHelper.userCredentials);

    await api
      .post("/api/blogs/")
      .set("Authorization", `Bearer ${loggedUser.body.token}`)
      .send(testHelper.blogMissingUrl)
      .expect(400);

    const blogsAfter = await testHelper.blogsFromDb();
    expect(blogsAfter).toHaveLength(blogsBefore.length);
  });
});

describe("Modifying an existing blog", () => {
  test("should update the likes count successfully", async () => {
    const blogsBefore = await testHelper.blogsFromDb();
    const blogToModify = { ...blogsBefore[0] };
    blogToModify.likes++;

    await api
      .put(`/api/blogs/${blogToModify.id}`)
      .send(blogToModify)
      .expect(200);

    const blogsAfter = await testHelper.blogsFromDb();
    expect(blogsAfter).toHaveLength(testHelper.sampleBlogs.length);

    const updatedBlog = blogsAfter.find(
      (entry) => entry.id === blogToModify.id
    );
    expect(updatedBlog.likes).toBe(blogToModify.likes);
  });

  test("should return 404 when modifying a non-existent blog", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    await api.put(`/api/blogs/${invalidId}`).send({ likes: 10 }).expect(404);
  });
});

describe("Removing a blog", () => {
  test("should delete a blog with a valid token", async () => {
    const blogsBefore = await testHelper.blogsFromDb();
    const loggedUser = await api
      .post("/api/login")
      .send(testHelper.userCredentials);

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${loggedUser.body.token}`)
      .send(testHelper.newBlogPost);

    const blogsAfterCreation = await testHelper.blogsFromDb();

    await api
      .delete(`/api/blogs/${response.body.id}`)
      .set("Authorization", `Bearer ${loggedUser.body.token}`)
      .expect(204);

    const blogsAfterDeletion = await testHelper.blogsFromDb();

    expect(blogsAfterCreation).toHaveLength(blogsBefore.length + 1);
    expect(blogsAfterDeletion).toHaveLength(blogsAfterCreation.length - 1);
  });

  test("should return 404 when attempting to delete a non-existent blog", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    await api.delete(`/api/blogs/${invalidId}`).expect(404);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
