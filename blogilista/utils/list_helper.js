const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };
  
  return blogs.length === 0 ?
    0 :
    blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  let fBlog = null;
  blogs.forEach(blog => {
    if (fBlog === null) {
      fBlog = blog;
    } else {
      if (fBlog.likes < blog.likes) {
        fBlog = blog;
      }
    }
  });
  return {title: fBlog.title, author: fBlog.author, likes: fBlog.likes};
};

const mostBlogs = (blogs) => {
  const grouped = _.groupBy(blogs, 'author');
  const sorted = _.sortBy(grouped, 'length');
  const mostLiked = _.orderBy(sorted[sorted.length -1], ['likes'], ['desc']);
  return blogs.length === 0 ?
    0 :
    {author: mostLiked[0].author, blogs: sorted[sorted.length -1].length};
};

const mostLikes = (blogs) => {
  const sorted = _.orderBy(blogs, ['likes', 'author'], ['desc', 'asc']);
  return blogs.length === 0 ?
    0 :
    {author: sorted[0].author, title: sorted[0].title, likes: sorted[0].likes}
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};