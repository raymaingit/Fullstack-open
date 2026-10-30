import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchFilter, setSearchFilter] = useState('')
  
  // Notification states (Exercise 2.16 & 2.17)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const notify = (message, type = 'success') => {
    setNotificationMessage(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 4000)
  }

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = event => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (confirmUpdate) {
        const changedPerson = { ...existingPerson, number: newNumber }
        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(
              persons.map(p => (p.id !== existingPerson.id ? p : returnedPerson))
            )
            notify(`Updated phone number for ${returnedPerson.name}`)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            // Error handling for when entry was already deleted (Exercise 2.17)
            notify(
              `Information of '${existingPerson.name}' has already been removed from server`,
              'error'
            )
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
      return
    }

    const newPersonObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPersonObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        notify(`Added ${returnedPerson.name}`)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        notify(`Failed to add ${newName}`, 'error')
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          notify(`Deleted ${name}`)
        })
        .catch(error => {
          notify(
            `Information of '${name}' has already been removed from server`,
            'error'
          )
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleNameChange = event => setNewName(event.target.value)
  const handleNumberChange = event => setNewNumber(event.target.value)
  const handleFilterChange = event => setSearchFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notificationMessage} type={notificationType} />

      <Filter 
        searchFilter={searchFilter} 
        handleFilterChange={handleFilterChange} 
      />

      <h3>Add a new</h3>

      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons 
        persons={persons} 
        searchFilter={searchFilter} 
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App