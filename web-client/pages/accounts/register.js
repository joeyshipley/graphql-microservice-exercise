import { useState } from 'react'
import FETCHQL from '../../util/graphql.util';
import ValidatableField from '../../components/forms/field-validatable.element';

export default function RegisterPage() {
  const [ email, setEmail ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ passwordConfirmation, setPasswordConfirmation ] = useState('');
  const [ validations, setValidations ] = useState([]);

  const register = async () => {
    const result = await FETCHQL.mutate(`
      mutation {
        registerUser(request: {
          email: "${ email }",
          username: "${ username }",
          password: "${ password }",
          passwordConfirmation: "${ passwordConfirmation }"
        }) {
          user {
            id,
            email,
            username,
            createdOn
          }
        }
      }
    `);
    setValidations(result.validations);
    if(result.data && result.data.registerUser) {
      clearPage();
      alert(`You have registered! Now time to login.`);
      window.location = '/accounts/login';
    }
  };

  const clearPage = () => {
    setEmail('');
    setUsername('');
    setPassword('');
    setPasswordConfirmation('');
    setValidations([]);
  }

  return (
    <div>
      <h1>Register</h1>

      <ValidatableField validations={ validations } property={ 'email' }>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" placeholder="Email Address"
          value={ email } onChange={ (e) => setEmail(e.target.value) }
        />
      </ValidatableField>

      <ValidatableField validations={ validations } property={ 'username' }>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" placeholder="Username"
          value={ username } onChange={ (e) => setUsername(e.target.value) }
        />
      </ValidatableField>

      <ValidatableField validations={ validations } property={ 'password' }>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="Password"
          value={ password } onChange={ (e) => setPassword(e.target.value) }
        />
      </ValidatableField>

      <ValidatableField validations={ validations } property={ 'passwordConfirmation' }>
        <label htmlFor="passwordConfirmation">Password Confirmation</label>
        <input id="passwordConfirmation" type="password" placeholder="Repeat Password"
          value={ passwordConfirmation } onChange={ (e) => setPasswordConfirmation(e.target.value) }
        />
      </ValidatableField>

      <div>
        <button onClick={ register }>Register</button>
      </div>

    </div>
  )
}
