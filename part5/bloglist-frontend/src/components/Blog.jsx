import { useState } from 'react'
import styled from 'styled-components'

const BlogCard = styled.div`
  padding: 14px 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  margin-bottom: 10px;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
`

const BlogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const BlogDetails = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const ToggleButton = styled.button`
  padding: 4px 10px;
  background-color: #f8f9fa;
  color: #212529;
  border: 1px solid #adb5bd;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e9ecef;
  }
`

const LikeButton = styled.button`
  margin-left: 8px;
  padding: 3px 10px;
  background-color: #0d6efd;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0b5ed7;
  }
`

const RemoveButton = styled.button`
  align-self: flex-start;
  margin-top: 4px;
  padding: 4px 12px;
  background-color: #dc3545;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #bb2d3b;
  }
`

const Blog = ({ blog, handleLike, handleDelete, currentUser, alwaysShowDetails = false }) => {
  const [visible, setVisible] = useState(alwaysShowDetails)

  if (!blog) {
    return null
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const onLikeClick = () => {
    if (!currentUser) {
      return
    }

    const userId = typeof blog.user === 'object' && blog.user !== null
      ? blog.user.id || blog.user._id
      : blog.user

    handleLike(blog.id, {
      user: userId,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    })
  }

  const onDeleteClick = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      handleDelete(blog.id)
    }
  }

  const blogUserObj = typeof blog.user === 'object' && blog.user !== null
    ? blog.user
    : null
  const blogUserId = blogUserObj ? (blogUserObj.id || blogUserObj._id) : blog.user
  const blogUsername = blogUserObj ? blogUserObj.username : null

  const matchesUsername = Boolean(
    currentUser?.username && blogUsername && blogUsername === currentUser.username
  )
  const matchesId = Boolean(
    currentUser?.id && blogUserId && String(blogUserId) === String(currentUser.id)
  )

  const canLike = Boolean(currentUser)
  const canDelete = Boolean(currentUser && (matchesUsername || matchesId))

  return (
    <BlogCard className="blog">
      <BlogHeader>
        <span className="blog-title-author">{blog.title} {blog.author}</span>
        {!alwaysShowDetails && (
          <ToggleButton onClick={toggleVisibility}>
            {visible ? 'hide' : 'view'}
          </ToggleButton>
        )}
      </BlogHeader>

      {visible && (
        <BlogDetails className="blog-details">
          <div>{blog.url}</div>
          <div>
            likes <span className="blog-likes">{blog.likes}</span>
            {canLike && (
              <LikeButton onClick={onLikeClick}>like</LikeButton>
            )}
          </div>
          <div>{blog.user?.name}</div>
          {canDelete && (
            <RemoveButton onClick={onDeleteClick}>remove</RemoveButton>
          )}
        </BlogDetails>
      )}
    </BlogCard>
  )
}

export default Blog