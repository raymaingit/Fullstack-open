import styled from 'styled-components'

const FormWrapper = styled.div`
  max-width: 400px;
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

const SubmitButton = styled.button`
  padding: 8px 16px;
  background-color: #1f6feb;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #1158c7;
  }
`

const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit
}) => {
  return (
    <FormWrapper>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <label htmlFor="login-username">username</label>
          <StyledInput
            id="login-username"
            type="text"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
          />
        </FieldGroup>
        <FieldGroup>
          <label htmlFor="login-password">password</label>
          <StyledInput
            id="login-password"
            type="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
          />
        </FieldGroup>
        <SubmitButton type="submit">login</SubmitButton>
      </form>
    </FormWrapper>
  )
}

export default LoginForm