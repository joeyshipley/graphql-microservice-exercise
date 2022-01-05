# AccountsService GraphQL

## Setup

*From repo root:*
- ``` > docker-compose up --build ```
- In Browser -> ``` http://localhost:3001/graphql ```

## Running the Tests
- ``` > docker-compose -f docker-compose.TESTS.yml up ```
- ``` > npm test ```

## Tech Info
- Boilerplate > https://github.com/finallyayo/typescript-graphql
- TypeGoose > https://github.com/typegoose/typegoose
- Mongoose > https://mongoosejs.com/docs/api.html
- TypeGraphQL > https://github.com/MichalLytek/type-graphql
- ClassValidator > https://github.com/typestack/class-validator
- TypeGraphQL && ClassValidator > https://typegraphql.com/docs/validation.html

## GraphQL Playground Examples
*Mutation: Create User*
```
mutation {
  createUser(request: { 
    username: "test user 1", 
    email: "test1@test.com" 
  }) {
    id
    email
    username
  }
}
```
*Query: All Users*
```
query {
  returnAllUsers {
    id
    email
    username
  }
}
```