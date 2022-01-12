import { agent } from 'supertest';
import * as express from 'express';

export async function loadUser(app: express.Express, email: string = 'test@test.com', username: string = 'Test User', password: string = 'TEST@test123') {
  const res = await agent(app)
    .post('/graphql')
    .send({ query: `
        mutation {
          registerUser(request: {
            username: "${ username }",
            email: "${ email }",
            password: "${ password }",
            passwordConfirmation: "${ password }"
          }) {
            user {
              id
            }
          }
        }
      `});
  return res.body.data.registerUser.user.id;
}