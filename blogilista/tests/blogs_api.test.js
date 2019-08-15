const config = require('../utils/config.js');
const mongoose = require('mongoose');
const supertest = require('supertest');
const logger = require('../utils/logger.js');
const Blog = require('../models/blogModel.js');
const User = require('../models/userModel.js');
const app = require('../controllers/apiController.js');

const api = supertest(app);

const initialUserInfo = {
  userName: 'helvetinHerra',
  name: 'saatana',
  pw: 'perkhele'
};
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
];
const initialEntry = {
  title: 'wtf is node.js?',
  author: 'Gov. of Nodestania',
  url: 'http://blog.nodestania.org/article_1',
  likes: 69
};

let blogsInDb = [];
let initialized = false;
let usersInDb = [];
let initialUser = {};
let initialLogin = {};

beforeAll(async (done) => {
  
  console.error(process.env.NODE_ENV);
  
  const initialCreds = {userName: initialUserInfo.userName, pw: initialUserInfo.pw};
  try {
    await mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useFindAndModify: false});
    console.log('Connection to Atlas - MongoDB cloud: success');
  } catch (e) {
    console.error('Connection to Atlas - MongoDB cloud: failed');
  } finally {
    await resetUsers();
    console.log('users reset');
    await resetBlogs();
    console.log('blogs reset');
    await login();
    console.log(initialCreds,initialLogin);
    console.log('login reset');
    initialized = true;
    done();
  }
});

function newInfo(blog) {
  const updated = 'updated ';
  let updatedBlog = blog;
  updatedBlog.title = updated.concat(updatedBlog.title);
  return updatedBlog;
}

async function login() {
  initialLogin = await api.post('/api/login/', )
    .send({userName: initialUserInfo.userName, pw: initialUserInfo.pw})
    .then(res => {return res.body});
}

async function resetUsers() {
  await User.deleteMany({});
  await api.post('/api/users/').send(initialUserInfo);
  usersInDb = await User.find({});
  usersInDb = await usersInDb.map(u => u.toJSON());
  initialUser = usersInDb[0];
}

async function resetBlogs() {
  await Blog.deleteMany({});
  for (let i = 0; i < initialBlogs.length; i++) {
    const newBlog = new Blog({
      title: initialBlogs[i].title,
      author: initialBlogs[i].author,
      url: initialBlogs[i].url,
      likes: initialBlogs[i].likes,
      addedBy: initialUser.id
    });
    await newBlog.save();
  }
  console.error('db size: ', blogsInDb.length);
  const blogs = await api.get('/api/blogs/');
  blogsInDb = blogs.body;
  console.error('db size: ', blogsInDb.length);
  console.error(blogsInDb);
}

describe('login tests', () => {
  
  const validCreds = {userName: initialUserInfo.userName, pw: initialUserInfo.pw};
  const invalidCreds = {userName: initialUserInfo.pw, pw: initialUserInfo.userName};
  
  test('invalid credentials, unsuccessful login', async (done) => {
    const ans = await api.post('/api/login/')
      .send(invalidCreds)
      .expect(401)
      .expect('Content-Type', /application\/json/);
    console.log(ans.body);
    logger.info('invalid creds, fail');
    console.log('invalid creds, fail');
    done();
  });
  
  test('valid credentials, successful login', async (done) => {
    const ans = await api.post('/api/login/')
      .send(validCreds)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    console.log(ans.body);
    logger.info('valid creds, success');
    console.log('valid creds, success');
    done();
  });
  
});

describe('adding and getting blogs', () => {
  test('blogs are returned as json', async (done) => {
    await api.get('/api/blogs', (res) => {
      expect(200);
      expect('Content-Type', /application\/json/);
      res.body.forEach(blog => {
        expect(blog.id);
      });
    });
    logger.info('blogs returned as json');
    console.log('blogs returned as json');
    done();
  });
  
  test('all blogs are returned', async (done) => {
    await api.get('/api/blogs', (res) => {
      expect(res.data.length).toBe(initialBlogs.length);
    });
    logger.info('all blogs returned');
    console.log('all blogs returned');
    done();
  });
  
  test('specific blog is within returned blogs', async (done) => {
    await api.get('/api/blogs', (res) => {
      let contents = res.data.map(blog => blog.title);
      expect(contents).toContain('React patterns');
    });
    logger.info('specific blogs returned');
    console.log('specific blogs returned');
    done();
  });
  
  test('adding new valid blog is successful', async (done) => {
    const entry = {
      title: initialEntry.title,
      author: initialEntry.author,
      url: initialEntry.url,
      likes: initialEntry.likes
    };
    
    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${initialLogin.token}`)
      .send(entry)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    logger.info('adding valid blog');
    console.log('adding valid blog');
    done();
  });
  
});

describe('adding blog without content is unsuccessful', () => {
  const noTitleEntry = {
    author: initialEntry.author,
    url: initialEntry.url,
    likes: initialEntry.likes,
    addedBy: initialUser.id
  };
  const noAuthorEntry = {
    title: initialEntry.title,
    url: initialEntry.url,
    likes: initialEntry.likes,
    addedBy: initialUser.id
  };
  const noUrlEntry = {
    title: initialEntry.title,
    author: initialEntry.author,
    likes: initialEntry.likes,
    addedBy: initialUser.id
  };
  const noUserEntry = {
    title: initialEntry.title,
    author: initialEntry.author,
    url: initialEntry.url,
    likes: initialEntry.likes
  };
  
  test('blog without title is failed', async (done) => {
    await api.post('/api/blogs')
      .send(noTitleEntry)
      .expect(400);
    logger.info('adding blog - no title');
    console.log('adding blog - no title');
    done();
  });
  
  test('blog without author is failed', async (done) => {
    await api.post('/api/blogs')
      .send(noAuthorEntry)
      .expect(400);
    logger.info('adding blog - no author');
    console.log('adding blog - no author');
    done();
  });
  
  test('blog without url is failed', async (done) => {
    await api.post('/api/blogs')
      .send(noUrlEntry)
      .expect(400);
    logger.info('adding blog - no url');
    console.log('adding blog - no url');
    done();
  });
  
  test('blog without adding user is failed', async (done) => {
    await api.post('/api/blogs')
      .send(noUserEntry)
      .expect(400);
    logger.info('adding blog - no user');
    console.log('adding blog - no user');
    done();
  });
  
});

describe('specific blog actions', () => {
  test('viewing blog with correct id is successful', async (done) => {
    await api.get(`/api/blogs/${blogsInDb[0].id}`, (res) => {
      expect(200);
      expect('Content-Type', /application\/json/);
      expect(res[0].title).toBe('React patterns');
    });
    
    logger.info('viewing blog - valid id');
    console.log('viewing blog - valid id');
    done();
  });
  
  test('viewing blog with incorrect id is unsuccessful', async (done) => {
    await api.get('/api/blogs/11')
      .expect(404);
    logger.info('viewing blog - invalid id');
    console.log('viewing blog - invalid id');
    done();
  });
  
  test('deleting blog with incorrect id is unsuccessful', async (done) => {
    await api.delete('/api/blogs/11')
      .set('Authorization', `Bearer ${initialLogin.token}`)
      .expect(401);
    logger.info('deleting blog - invalid id');
    console.log('deleting blog - invalid id');
    done();
  });
  
  test('deleting blog with correct id is successful', async (done) => {
    await api.delete(`/api/blogs/${blogsInDb[blogsInDb.length -1].id}`)
      .set('Authorization', `Bearer ${initialLogin.token}`)
      .expect(204);
    logger.info('deleting blog - valid id');
    console.log('deleting blog - valid id');
    done();
  });
  
  test('updating blog with correct id is successful', async (done) => {
    console.log(blogsInDb);
    console.log(blogsInDb[0]);
    const updatedInfo = newInfo(blogsInDb[0]);
    
    await api.put(`/api/blogs/${blogsInDb[0].id}`)
      .set('Authorization', `Bearer ${initialLogin.token}`)
      .send(updatedInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    logger.info('updating blog - valid id');
    console.log('updating blog - valid id');
    done();
  });
  
  test('updating blog with incorrect id is unsuccessful', async (done) => {
    console.log(blogsInDb);
    console.log(blogsInDb[0]);
    const updatedInfo = newInfo(blogsInDb[0]);
    
    await api.put('/api/blogs/11')
      .set('Authorization', `Bearer ${initialLogin.token}`)
      .send(updatedInfo)
      .expect(400);
    logger.info('updating blog - invalid id');
    console.log('updating blog - invalid id');
    done();
  });
});

describe('user actions', () => {
  
  test('adding unique user is successful', async (done) => {
    const usersAtStart = await User.find({});
    
    const newUser = {
      userName: 'katti',
      name: 'kissa',
      pw: 'miauuu'
    };
    
    console.log(newUser);
    
    const user = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    console.log(user.body);
    
    const usersAtEnd = await User.find({});
    expect(usersAtEnd.length).toBe(usersAtStart.length +1);
    
    const userNames = await usersAtEnd.map(u => u.userName);
    expect(userNames).toContain(newUser.userName);
  
    done();
    
  });
  
  test('adding user with existing username fails', async (done) => {
    const newUser = {
      userName: 'helvetinHerra',
      name: 'saatana',
      pw: 'perkhele'
    };
    
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    
    expect(result.body.error).toBe('user already exists');
  
    done();
  });
});

afterAll(() => {
  mongoose.connection.close();
});