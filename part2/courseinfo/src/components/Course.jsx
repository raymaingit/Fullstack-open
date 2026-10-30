const Header = ({ course }) => <h2>{course}</h2>

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}

const Course = ({ course }) => {
  const total = course.parts.reduce((s, p) => s + p.exercises, 0)

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <p><b>total of {total} exercises</b></p>
    </div>
  )
}

export default Course