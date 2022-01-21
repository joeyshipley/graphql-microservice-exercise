import { useState } from 'react'
import ValidatableField from '../../components/forms/field-validatable.element';
import { FETCH } from '../../util/fetch.util';
import Link from 'next/link';

export default function LoginPage() {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ validations, setValidations ] = useState([]);

  const login = async () => {
    const result = await FETCH.post('/api/login', { email, password });
    setValidations(result.validations);
    console.log(result);
    if(result.data) {
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
      <p>
        <Link href="/">
          <a>&laquo; Home</a>
        </Link>
      </p>

      <h1>Login</h1>

      <ValidatableField validations={ validations } property={ 'none' } />

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

      <br />

      <p>
        New user? Head on over to
        <Link href="/accounts/register">
          <a> Register &raquo;</a>
        </Link>
      </p>

    </div>
  )
}
