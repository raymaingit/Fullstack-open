import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  const itemStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog => (
        <div key={blog.id} style={itemStyle} className="blog">
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default BlogList