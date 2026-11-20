import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import Blog from './Blog'

describe('<Blog /> single blog view tests', () => {
  const blog = {
    id: '5a43fde2cbd20b12a2c34e91',
    title: 'The Joel Test: 12 Steps to Better Code',
    author: 'Joel Spolsky',
    url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/',
    likes: 7,
    user: {
      id: '5a43e6b6c37f3d065eaaa581',
      username: 'mluukkai',
      name: 'Matti Luukkainen'
    }
  }

  const creatorUser = {
    id: '5a43e6b6c37f3d065eaaa581',
    username: 'mluukkai',
    name: 'Matti Luukkainen'
  }

  const otherUser = {
    id: '5a43e6b6c37f3d065eaaa999',
    username: 'otheruser',
    name: 'Other User'
  }

  let handleLike
  let handleDelete

  beforeEach(() => {
    handleLike = vi.fn()
    handleDelete = vi.fn()
  })

  test('displays blog info and likes to unauthenticated users without action buttons', () => {
    render(
      <Blog
        blog={blog}
        handleLike={handleLike}
        handleDelete={handleDelete}
        currentUser={null}
        alwaysShowDetails
      />
    )

    expect(screen.getByText(/The Joel Test: 12 Steps to Better Code/)).toBeInTheDocument()
    expect(screen.getByText(/Joel Spolsky/)).toBeInTheDocument()
    expect(screen.getByText(blog.url)).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('Matti Luukkainen')).toBeInTheDocument()

    expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('shows only the like button to authenticated users who are not the creator', async () => {
    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        handleLike={handleLike}
        handleDelete={handleDelete}
        currentUser={otherUser}
        alwaysShowDetails
      />
    )

    const likeButton = screen.getByRole('button', { name: 'like' })
    expect(likeButton).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()

    await user.click(likeButton)
    expect(handleLike).toHaveBeenCalledTimes(1)
  })

  test('shows both like and delete buttons to the blog creator', async () => {
    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        handleLike={handleLike}
        handleDelete={handleDelete}
        currentUser={creatorUser}
        alwaysShowDetails
      />
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    await user.click(screen.getByRole('button', { name: 'remove' }))

    expect(confirmSpy).toHaveBeenCalledTimes(1)
    expect(handleDelete).toHaveBeenCalledWith(blog.id)
    confirmSpy.mockRestore()
  })
})