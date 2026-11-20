import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, Navigate, useNavigate, useMatch } from 'react-router-dom'
import styled from 'styled-components'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
`

const NavBar = styled.nav`
  padding: 10px 16px;
  background-color: #e9ecef;
  border-radius: 6px;
  margin-bottom: 16px;
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;

  a {
    color: #0d6efd;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`

const LogoutButton = styled.button`
  margin-left: 8px;
  padding: 4px 10px;
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #adb5bd;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #f8f9fa;
  }
`

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const blogFormRef = useRef()
  const navigate = useNavigate()

  const notify = (message, type = 'success') => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  useEffect(() => {
    blogService.getAll().then(initialBlogs =>
      setBlogs(initialBlogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const match = useMatch('/blogs/:id')
  const matchedBlog = match
    ? blogs.find(b => String(b.id) === String(match.params.id))
    : null

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(loggedUser)
      )
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
      notify(`Welcome back, ${loggedUser.name}!`)
      navigate('/')
    } catch (exception) {
      console.error(exception)
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      if (blogFormRef.current) {
        blogFormRef.current.toggleVisibility()
      }
      const blogWithUser = typeof createdBlog.user === 'string'
        ? { ...createdBlog, user: { id: createdBlog.user, username: user.username, name: user.name } }
        : createdBlog

      setBlogs(prevBlogs => prevBlogs.concat(blogWithUser))
      notify(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      navigate('/')
    } catch (exception) {
      console.error(exception)
      notify('failed to create blog', 'error')
    }
  }

  const handleLike = async (id, updatedBlogData) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlogData)
      setBlogs(prevBlogs => prevBlogs.map(blog => {
        if (blog.id !== id) {
          return blog
        }
        const mergedUser = typeof returnedBlog.user === 'object' && returnedBlog.user !== null
          ? returnedBlog.user
          : blog.user

        return { ...returnedBlog, user: mergedUser }
      }))
    } catch (exception) {
      console.error(exception)
      notify('failed to update likes', 'error')
    }
  }

  const handleDelete = async (id) => {
    const blogToDelete = blogs.find(b => b.id === id)
    try {
      await blogService.remove(id)
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== id))
      notify(`removed blog ${blogToDelete?.title || ''}`)
      navigate('/')
    } catch (exception) {
      console.error(exception)
      notify('failed to remove blog', 'error')
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <PageContainer>
      <NavBar>
        <Link to="/">blogs</Link>
        {user ? (
          <>
            <Link to="/create">create blog</Link>
            <span>
              {user.name} logged-in <LogoutButton onClick={handleLogout}>logout</LogoutButton>
            </span>
          </>
        ) : (
          <Link to="/login">login</Link>
        )}
      </NavBar>

      <Notification message={notification} type={notificationType} />

      <Routes>
        <Route path="/" element={<BlogList blogs={sortedBlogs} />} />
        <Route
          path="/login"
          element={
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          }
        />
        <Route
          path="/create"
          element={
            user ? (
              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={handleCreateBlog} />
              </Togglable>
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={matchedBlog}
              handleLike={handleLike}
              handleDelete={handleDelete}
              currentUser={user}
              alwaysShowDetails
            />
          }
        />
      </Routes>
    </PageContainer>
  )
}

export default App