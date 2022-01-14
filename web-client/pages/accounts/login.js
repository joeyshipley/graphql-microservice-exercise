import { useState } from 'react'
import FETCHQL from '../../util/graphql.util';
import ValidatableField from '../../components/forms/field-validatable.element';

export default function LoginPage() {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ validations, setValidations ] = useState([]);

  const login = async () => {
    const result = await FETCHQL.mutate(`
      mutation {
        login(request: {
          email: "${ email }",
          password: "${ password }"
        }) {
          token
        }
      }
    `);
    setValidations(result.validations);
    if(result.data && result.data.login) {

      // TODO: do something with > result.data.login.token

      clearPage();
      alert(`You have logged in. Let's look at your profile now.`);
      window.location = '/accounts/profile';
    }
  };

  const clearPage = () => {
    setEmail('');
    setPassword('');
    setValidations([]);
  }

  return (
    <div>
      <h1>Login</h1>

      <ValidatableField validations={ validations } property={ 'email' }>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" placeholder="Email Address"
          value={ email } onChange={ (e) => setEmail(e.target.value) }
        />
      </ValidatableField>

      <ValidatableField validations={ validations } property={ 'password' }>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="Password"
          value={ password } onChange={ (e) => setPassword(e.target.value) }
        />
      </ValidatableField>

      <div>
        <button onClick={ login }>Login</button>
      </div>

    </div>
  )
}
