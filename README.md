# Work In Progress - Learning Exercise

### WARNING - Learning Exercise.
A lot of this will be rough as I explore these concepts. It will eventually be cleaned up, but for now individual miles will vary.

### License
- This repository is covered by the [MIT license](https://opensource.org/licenses/MIT).

### SETUP
- Required Node Version: 16.13.1 (@Apollo/Subgraph required >=12.13.0 && <17.0)
- Replace the ENCRYPT_[X] environment variables in the docker-compose file.

### RUN
- ``` > docker-compose up --build ```
- ``` BROWSER > http://localhost:3000 ```

### TODO
- Web-Client: finish tests.
- Web-Client: dockerize and attach to project docker-compose.
- Web-Client: Explore/Determine if using IronSession with NextJS causes our app to have statefulness and keeps us from scaling horizontally.
- Authentication Token Refresh (set expiration to 15-30 minutes when that happens).
- Feature: Change Password
- Feature: Verify Email Address
- Feature: Forgot Password
