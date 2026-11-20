import { useState } from 'react'
import styled from 'styled-components'

const FormWrapper = styled.div`
  max-width: 450px;
  margin: 16px 0;
  padding: 20px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  background-color: #ffffff;
`

const FieldGroup = styled.div`
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const StyledInput = styled.input`
  padding: 8px 10px;
  border: 1px solid #8c959f;
  border-radius: 6px;
  font-size: 14px;
`

const CreateButton = styled.button`
  padding: 8px 16px;
  background-color: #2da44e;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <FormWrapper>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <FieldGroup>
          <label htmlFor="blog-title">title:</label>
          <StyledInput
            id="blog-title"
            type="text"
            value={title}
            name="Title"
            placeholder="write title here"
            onChange={({ target }) => setTitle(target.value)}
          />
        </FieldGroup>
        <FieldGroup>
          <label htmlFor="blog-author">author:</label>
          <StyledInput
            id="blog-author"
            type="text"
            value={author}
            name="Author"
            placeholder="write author here"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </FieldGroup>
        <FieldGroup>
          <label htmlFor="blog-url">url:</label>
          <StyledInput
            id="blog-url"
            type="text"
            value={url}
            name="Url"
            placeholder="write url here"
            onChange={({ target }) => setUrl(target.value)}
          />
        </FieldGroup>
        <CreateButton type="submit">create</CreateButton>
      </form>
    </FormWrapper>
  )
}

export default BlogForm