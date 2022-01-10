# TEMP README

## License
- This repository is covered by the [MIT license](https://opensource.org/licenses/MIT).

### SETUP
- Required Node Version: 16.13.1 (>=12.13.0 && <17.0)
- Replace the ENCRYPT_[X] environment variables in the docker-compose file.
- If needed update the GraphGateway/src/supergraph-config.yaml ports based on docker-compose setup and then rebuild supergraph.graphql based on readme in GraphGateway project.

### RUN
- ``` > docker-compose up --build ```
- ``` BROWSER > http://localhost:3000 ```
