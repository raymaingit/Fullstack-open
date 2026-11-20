import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('<BlogForm /> component tests', () => {
  test('calls createBlog with right details when a new blog is created', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('write title here')
    const authorInput = screen.getByPlaceholderText('write author here')
    const urlInput = screen.getByPlaceholderText('write url here')
    const createButton = screen.getByRole('button', { name: 'create' })

    await user.type(titleInput, 'Testing React forms with RTL')
    await user.type(authorInput, 'Ray-Junior Mongwe')
    await user.type(urlInput, 'https://example.com/rtl-forms')
    await user.click(createButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Testing React forms with RTL',
      author: 'Ray-Junior Mongwe',
      url: 'https://example.com/rtl-forms'
    })
  })
})