import { useState } from 'react'
import FETCHQL from '../../util/graphql.util';
import ValidatableField from '../../components/forms/field-validatable.element';
import Link from 'next/link';
import WINDOW from '../../util/window.util';

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
      WINDOW.setLocation('/accounts/login');
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
      <p>
        <Link href="/">
          <a>&laquo; Home</a>
        </Link>
      </p>

      <h1>Register</h1>

      <ValidatableField validations={ validations } property={ 'email' }>
        <label htmlFor="email">Email</label>
        <input id="email" role="email-input"
          type="text" placeholder="Email Address"
          value={ email } onChange={ (e) => setEmail(e.target.value) }
        />
      </ValidatableField>

      <ValidatableField validations={ validations } property={ 'username' }>
        <label htmlFor="username">Username</label>
        <input id="username" role="username-input"
          type="text" placeholder="Username"
          value={ username } onChange={ (e) => setUsername(e.target.value) }
        />
      </ValidatableField>

      <ValidatableField validations={ validations } property={ 'password' }>
        <label htmlFor="password">Password</label>
        <input id="password" role="password-input"
          type="password" placeholder="Password"
          value={ password } onChange={ (e) => setPassword(e.target.value) }
        />
      </ValidatableField>

      <ValidatableField validations={ validations } property={ 'passwordConfirmation' }>
        <label htmlFor="passwordConfirmation">Password Confirmation</label>
        <input id="passwordConfirmation" role="passwordConfirmation-input"
          type="password" placeholder="Repeat Password"
          value={ passwordConfirmation } onChange={ (e) => setPasswordConfirmation(e.target.value) }
        />
      </ValidatableField>

      <div>
        <button role="register-action" onClick={ register }>Register</button>
      </div>

      <br />

      <p>
        Already registered? Head on over to
        <Link href="/accounts/login">
          <a> Login &raquo;</a>
        </Link>
      </p>
    </div>
  )
}
