const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelpler = require("../utils/list_helpler");

const singleEntry = [
  {
    _id: "6a422aa71b54a676234d17f8",
    title: "Efficient Algorithms",
    author: "Donald Knuth",
    url: "http://example.com/efficient-algorithms",
    likes: 8,
    __v: 0,
  },
];

const multipleEntries = [
  {
    _id: "6a422a851b54a676234d17f7",
    title: "Deep Learning Advancements",
    author: "Yann LeCun",
    url: "http://example.com/deep-learning",
    likes: 15,
    __v: 0,
  },
  {
    _id: "6a422aa71b54a676234d17f8",
    title: "Efficient Algorithms",
    author: "Donald Knuth",
    url: "http://example.com/efficient-algorithms",
    likes: 8,
    __v: 0,
  },
  {
    _id: "6a422b3a1b54a676234d17f9",
    title: "Optimized Data Structures",
    author: "Robert Tarjan",
    url: "http://example.com/optimized-ds",
    likes: 20,
    __v: 0,
  },
  {
    _id: "6a422b891b54a676234d17fa",
    title: "Agile Development Principles",
    author: "Martin Fowler",
    url: "http://example.com/agile-dev",
    likes: 12,
    __v: 0,
  },
  {
    _id: "6a422ba71b54a676234d17fb",
    title: "Code Readability Best Practices",
    author: "Martin Fowler",
    url: "http://example.com/code-readability",
    likes: 3,
    __v: 0,
  },
  {
    _id: "6a422bc61b54a676234d17fc",
    title: "Scalable Backend Architectures",
    author: "Robert Tarjan",
    url: "http://example.com/scalable-backend",
    likes: 10,
    __v: 0,
  },
];

describe("Basic Functionality", () => {
  test("should return 1 for dummy function", () => {
    const blogs = [];
    expect(listHelpler.dummy(blogs)).toBe(1);
  });
});

describe("Total Likes Calculation", () => {
  test("should return correct total likes for multiple blogs", () => {
    expect(listHelpler.totalLikes(multipleEntries)).toBe(68);
  });

  test("should return likes count for a single entry", () => {
    expect(listHelpler.totalLikes(singleEntry)).toBe(8);
  });

  test("should return 0 if the list is empty", () => {
    expect(listHelpler.totalLikes([])).toBe(0);
  });
});

describe("Most Liked Blog Entry", () => {
  test("should return the blog with the highest likes", () => {
    expect(listHelpler.favoriteBlog(multipleEntries)).toEqual({
      _id: "6a422b3a1b54a676234d17f9",
      title: "Optimized Data Structures",
      author: "Robert Tarjan",
      url: "http://example.com/optimized-ds",
      likes: 20,
      __v: 0,
    });
  });

  test("should return the single entry itself if only one blog exists", () => {
    expect(listHelpler.favoriteBlog(singleEntry)).toEqual(singleEntry[0]);
  });

  test("should return null if the blog list is empty", () => {
    expect(listHelpler.favoriteBlog([])).toBe(null);
  });
});

describe("Author with Most Blog Posts", () => {
  test("should return the author with the highest number of posts", () => {
    expect(listHelpler.mostBlogs(multipleEntries)).toEqual({
      author: "Martin Fowler",
      blogs: 2,
    });
  });

  test("should return the author if only one blog is available", () => {
    expect(listHelpler.mostBlogs(singleEntry)).toEqual({
      author: singleEntry[0].author,
      blogs: 1,
    });
  });

  test("should return null for an empty blog list", () => {
    expect(listHelpler.mostBlogs([])).toBe(null);
  });
});

describe("Author with Most Total Likes", () => {
  test("should return the author whose blogs have the most cumulative likes", () => {
    expect(listHelpler.mostLikes(multipleEntries)).toEqual({
      author: "Robert Tarjan",
      likes: 30,
    });
  });

  test("should return the author and likes for a single blog entry", () => {
    expect(listHelpler.mostLikes(singleEntry)).toEqual({
      author: singleEntry[0].author,
      likes: 8,
    });
  });

  test("should return null for an empty blog list", () => {
    expect(listHelpler.mostLikes([])).toBe(null);
  });
});
