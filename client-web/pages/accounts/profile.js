import { withIronSessionSsr } from "iron-session/next"
import FETCHQL from '../../util/graphql.util';
import { SERVER_ONLY_ENV } from '../../util/environment-variables';
import { RESPONSE } from '../../util/response.util';
import { useState } from 'react';
import ValidatableField from '../../components/forms/field-validatable.element';
import Link from 'next/link';

export default function ProfilePage({ data }) {
  const [ validations, setValidations ] = useState(data.validations || []);
  const user = data.user || {};

  return (
    <div>
      <p>
        <Link href="/">
          <a>&laquo; Home</a>
        </Link>
      </p>

      <h1>Profile</h1>
      <ValidatableField validations={ validations } property={ 'none' } />

      <div>
        <label>Username: </label> <span>{ user.username }</span>
      </div>
      <div>
        <label>Email: </label> <span>{ user.email }</span>
      </div>
    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const authToken = (req.session && req.session.auth)
      ? req.session.auth.token
      : '';
    if (!authToken) {
      return RESPONSE.NOT_AUTHORIZED;
    }
    const result = await FETCHQL.mutate(`
      query {
        viewCurrentUser {
          user {
            id
            email
            username
            createdOn
          }
        }
      }
    `, { authToken });
    const data = (result.validations && result.validations.length > 0)
      ? result
      : result.data.viewCurrentUser
    return { props: { data } }
  },
  SERVER_ONLY_ENV.IRON_OPTIONS,
);