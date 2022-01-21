import { withIronSessionApiRoute } from 'iron-session/next';
import FETCHQL from '../../util/graphql.util';
import { SERVER_ONLY_ENV } from '../../util/environment-variables';

export default withIronSessionApiRoute(
  async function handler(req, res) {
    const { email, password } = req.body;
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

    if(result.validations && result.validations.length > 0) {
      return res.status(200).json(result);
    }

    req.session.auth = {
      token: result.data.login.token
    };
    await req.session.save();
    res.status(200).json(result);
  },
  SERVER_ONLY_ENV.IRON_OPTIONS
);