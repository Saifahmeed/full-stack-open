// Import necessary models
const Blog = require("../models/blog");
const User = require("../models/user");

// Fetch all blogs in the database
const getAllBlogs = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

// Fetch all users in the database
const getAllUsers = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

// Sample blog entries for initial database setup
const sampleBlogs = [
  {
    title: "A Beginner's Guide to GraphQL",
    author: "Lucas Perry",
    url: "https://graphql.org/",
    likes: 15,
    user: "64774e0edf6e771f4abcfafa",
  },
  {
    title: "Optimizing SQL Queries for Performance",
    author: "Rachel Simmons",
    url: "https://www.thoughtspot.com/data-trends/data-modeling/optimizing-sql-queries",
    likes: 8,
    user: "64774e0edf6e771f4abcfafa",
  },
];

// Blog post template for testing new blog creation
const newBlogEntry = {
  title: "How to Debug JavaScript",
  author: "Ethan Wright",
  url: "https://saucelabs.com/resources/blog/best-debugging-tools",
  likes: 6,
  user: "64774e0edf6e771f4abcfafa",
};

// Blog post missing the 'likes' property (should default to 0)
const blogWithoutLikes = {
  title: "Understanding REST vs GraphQL",
  author: "Olivia Johnson",
  url: "https://mytechhub.ca/",
  user: "64774e0edf6e771f4abcfafa",
};

// Blog post missing the 'title' field (should return 400 error)
const blogMissingTitle = {
  author: "Nathaniel Brooks",
  url: "https://www.goodreads.com/author/list/14253458.QuickRead",
  likes: 4,
  user: "64774e0edf6e771f4abcfafa",
};

// Blog post missing the 'url' field (should return 400 error)
const blogMissingUrl = {
  title: "Common Mistakes in React",
  author: "Samantha Clark",
  likes: 7,
  user: "64774e0edf6e771f4abcfafa",
};

// Blog post missing the 'author' field (should return 400 error)
const blogWithoutAuthor = {
  title: "An Intro to web",
  url: "https://web.dev/",
  likes: 3,
  user: "64774e0edf6e771f4abcfafa",
};

// Export all test helpers
module.exports = {
  sampleBlogs,
  newBlogEntry,
  blogWithoutLikes,
  blogMissingTitle,
  blogMissingUrl,
  blogWithoutAuthor,
  getAllBlogs,
  getAllUsers,
};
