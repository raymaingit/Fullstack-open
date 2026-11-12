const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const newUser = {
    username: 'root',
    name: 'Superroot',
    password: 'password123'
  }

  await api.post('/api/users').send(newUser)

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'password123' })

  token = loginResponse.body.token

  const user = await User.findOne({ username: 'root' })
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog({ ...blog, user: user._id })
    const saved = await blogObject.save()
    user.blogs = user.blogs.concat(saved._id)
  }
  await user.save()
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json (4.8)', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned and amount is correct (4.8)', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have unique identifier named id instead of _id (4.9)', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added with token (4.10, 4.19)', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('Canonical string reduction'))
  })

  test('adding a blog fails with 401 Unauthorized if token is not provided (4.23)', async () => {
    const newBlog = {
      title: 'Unauthorized blog',
      author: 'No One',
      url: 'http://example.com',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('if likes property is missing, it defaults to 0 (4.11)', async () => {
    const newBlogWithoutLikes = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/06/07/Type_wars-api',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('backend responds with 400 if title or url is missing (4.12)', async () => {
    const blogWithoutTitle = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/missing-title.html',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutTitle)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid and owner deletes it (4.13, 4.21)', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})