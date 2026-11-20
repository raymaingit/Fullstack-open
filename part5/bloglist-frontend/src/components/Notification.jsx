import styled from 'styled-components'

const Banner = styled.div`
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  color: ${props => (props.$type === 'error' ? '#842029' : '#0f5132')};
  background-color: ${props => (props.$type === 'error' ? '#f8d7da' : '#d1e7dd')};
  border: 2px solid ${props => (props.$type === 'error' ? '#dc3545' : '#198754')};
`

const Notification = ({ message, type = 'success' }) => {
  if (!message) {
    return null
  }

  return (
    <Banner className={type} $type={type}>
      {message}
    </Banner>
  )
}

export default Notification