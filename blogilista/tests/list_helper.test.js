const list_helper = require('../utils/list_helper.js');

test('dummy returns one', () => {
  const blogs = [];
  
  const result = list_helper.dummy(blogs);
  
  expect(result).toBe(1);
});

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ];
  const listWithSameBlogMultipleTimes = [
    {
      _id: "5d0a892a859bbd6837e4ee31",
      title: "68: 69 for nerds",
      author: "dirtyNerd",
      url: "http://fuck.this.org/shieeet",
      likes: 69,
      __v: 0
    },
    {
      _id: "5d0a892a859bbd6837e4ee31",
      title: "68: 69 for nerds",
      author: "dirtyNerd",
      url: "http://fuck.this.org/shieeet",
      likes: 69,
      __v: 0
    },
    {
      _id: "5d0a892a859bbd6837e4ee31",
      title: "68: 69 for nerds",
      author: "dirtyNerd",
      url: "http://fuck.this.org/shieeet",
      likes: 69,
      __v: 0
    }
  ];
  const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }
  ];
  
  test('when list has only one blog equals the likes of that', () => {
    const result = list_helper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });
  test('of a bigger list is calculated right', () => {
    const result = list_helper.totalLikes(blogs);
    expect(result).toBe(36);
  });
  test('of empty list is zero', () => {
    const result = list_helper.totalLikes([]);
    expect(result).toBe(0);
  });
  test('of list most likes get returned', () => {
    const result = list_helper.favoriteBlog(blogs);
    expect(result).toEqual({title: 'Canonical string reduction',author: 'Edsger W. Dijkstra',likes: 12});
  });
  test('of list most blogs', () => {
    const result = list_helper.mostBlogs(blogs);
    expect(result).toEqual({author: 'Robert C. Martin', blogs: 3});
  });
  test('of list most likes', () => {
    const result = list_helper.mostLikes(blogs);
    expect(result).toEqual({author: 'Edsger W. Dijkstra', title: 'Canonical string reduction', likes: 12});
  });
});