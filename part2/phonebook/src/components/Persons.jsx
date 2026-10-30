const Persons = ({ persons, searchFilter, deletePerson }) => {
  const personsToShow = searchFilter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : persons

  return (
    <div>
      {personsToShow.map(person => (
        <div key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
        </div>
      ))}
    </div>
  )
}

export default Persons