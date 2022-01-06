# CharactersService GraphQL

## Setup

*From repo root:*
- ``` > docker-compose up --build ```
- In Browser -> ``` http://localhost:3002/graphql ```

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

## GraphQL Playground Examples
*Mutation: Create Character*
```
mutation {
  createCharacter(request: { 
    name: "Sir Big Bird",
  }) {
    character {
      id
      playerId
      name
      createdOn
    }
  }
}
```
*Query: All Characters*
```
query {
  allCharacters {
    id
    playerId
    name
    createdOn
  }
}
```