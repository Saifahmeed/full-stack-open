const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  const mostLiked = blogs.reduce((fav, current) =>
    fav.likes > current.likes ? fav : current
  );

  return {
    title: mostLiked.title,
    author: mostLiked.author,
    likes: mostLiked.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const blogCounts = _.countBy(blogs, (blog) => blog.author);
  const topAuthor = Object.keys(blogCounts).reduce((a, b) =>
    blogCounts[a] > blogCounts[b] ? a : b
  );

  return { author: topAuthor, blogs: blogCounts[topAuthor] };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const likesByAuthor = _(blogs)
    .groupBy("author")
    .map((blogList, author) => ({
      author,
      likes: _.sumBy(blogList, "likes"),
    }))
    .value();

  return likesByAuthor.reduce((top, current) =>
    top.likes > current.likes ? top : current
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
