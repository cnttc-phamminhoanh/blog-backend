## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Use database postgres with docker
```bash
$ docker compose up -d
```

## Execute postgres query in container bash
```bash
$ docker exec -it {containerName} bash
```
```bash
$ psql -U {userName} -W {databaseName}
```
```bash
$ select * from {tableName};
```
##### Connect to postgres database in bash:
 ```bash
$ \c {databaseName}
```
##### View table of current database in bash: 
 ```bash
$ \dt
```

## Migration
##### Create migration
```bash
$ npm run migration:create ./src/database/migrations/{fileName}
```

##### Generate migration with local.env
```bash
$ npm run migration:generate:local ./src/database/migrations/{fileName} 
```

##### Run migration with local.env
```bash
$ npm run migration:up:local
```

##### Revert migration with local.env
```bash
$ npm run migration:down:local
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development with local.env file
$ npm run start

# watch mode with dev.env file
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - Pham Minh Oanh
- Email - oanhpham41121@gmail.com
- Github - [https://github.com/cnttc-phamminhoanh](https://github.com/cnttc-phamminhoanh)
