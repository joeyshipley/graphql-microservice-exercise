# AccountsService GraphQL

## NOTE!
- Apollo Federation restricts Node to maximum of v16.13.1

## Setup

*From repo root:*
- ``` > docker-compose up --build ```
- In Browser -> ``` http://localhost:3001/graphql ```

## Running the Tests
- ``` > npm install ```
- ``` > docker-compose -f docker-compose.TESTS.yml up ```
- ``` > npm test ```

## Tech Info
- Boilerplate > https://github.com/finallyayo/typescript-graphql
- TypeGoose > https://github.com/typegoose/typegoose
- Mongoose > https://mongoosejs.com/docs/api.html
- TypeGraphQL > https://github.com/MichalLytek/type-graphql
- ClassValidator > https://github.com/typestack/class-validator
- TypeGraphQL && ClassValidator > https://typegraphql.com/docs/validation.html
- GraphQL Federation > https://github.com/MichalLytek/type-graphql/tree/master/examples/apollo-federation

## GraphQL Playground Examples
*Mutation: Create User*
```
mutation {
  registerUser(request: { 
    username: "test user 1", 
    email: "test1@test.com",
    password: "TEST@test123",
    passwordConfirmation: "TEST@test123"
  }) {
    user {
      id
      email
      username
      createdOn
    }
  }
}
```
*Query: All Users*
```
query {
  allUsers {
    id
    email
    username
    createdOn
  }
}
```