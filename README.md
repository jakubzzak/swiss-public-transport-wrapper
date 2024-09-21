## Introduction

The Swiss rail network is the densest in Europe and public transport is an integral part of the life of almost every person living in Switzerland. But what good would this extensive network do, if there was no way to easily look up these connections?

Here’s where you jump in! The goal of this assignment is to create a GraphQL backend that provides a way to search for stations, fetch connections between certain stations and to save your favourite journeys for later. To build this, you will be fetching data from a [publicly available API (https://transport.opendata.ch)](https://transport.opendata.ch) and save journeys to a PostgreSQL database.

## Prerequisites

Before you start the assignment, make sure you have the following installed on your development machine:

1. [Node.js (https://nodejs.org/)](https://nodejs.org/) - version 16 or higher
2. [pnpm (https://pnpm.io)](https://pnpm.io) - version 8 or higher
3. [Docker Engine and Docker Compose (https://docker.com/)](https://docker.com/) - version 24 or higher
4. [Git (https://git-scm.com)](https://git-scm.com) - for version control (optional but recommended).

## Getting Started

To get started, follow these steps:

1. Clone the project repository
2. Install the dependencies
   ```sh
   pnpm install
   ```
3. Start the postgres container. This will automatically run the migrations as defined in `./docker/migrations/create_tables.sql`
   ```sh
   docker compose up -d
   ```
4. Start the application in watch mode
   ```sh
   pnpm run start:dev
   ```

## Postman Collection

To help you with testing your solution, we have created a Postman collection for you. To use it, import the `graphql.postman_collection.json` file into Postman.

## Rerunning the Migrations

The migrations defined in `./docker/migrations/create_tables.sql` are only run once when the database container is started for the first time. If you want to rerun the migrations, you can do so by running the following command (this will also reset the database):

```sh
docker compose down && docker compose up -d
```

## Running the Tests

We have implemented a few tests to help you verify the correctness of your implementation. However, please note that
these tests are not exhaustive and you should not rely on them
to verify the functionality of your API.

To run the tests, execute the following command:

```sh
pnpm run test:e2e
```

**If you are unsure about any of the requirements below, it might be helpful have a look at the tests, as they contain concrete examples of how the API should behave in different scenarios.** If it is still unclear after that, please don't hesitate to ask us!

## Skeleton

We provide you with a skeleton project that already contains most of the boilerplate that you would otherwise have to write yourself. If you are not happy with any of the provided code, feel free to change it to your liking.

We have annotated the code with `TODO` comments to indicate where you will have to implement your own code. Apart from import statements, you should be able to implement the assignment without touching anything else. If you wish to change the skeloton anyway, feel free to do so.

## Description

Your task is to implement a GraphQL API that adheres to the schema as defined in `./final-schema.gql`. The schema, along with the provided tests and the explanations below should provide you with all the information you need to complete the assignment.

Let's have a closer look at the different GraphQL resolvers that you will have to implement:

### stations (query)

This query should return a list of stations that match the provided search term, acting as a gateway to the [OpenData Transport API](https://transport.opendata.ch). The following requirements apply:

- only locations of type `station` should be returned
- only stations with a non-null `id` should be returned
- no pagination has to be implemented
- data is fetched directly from the external API, nothing gets written to the database

### connections (query)

This query should return a paginated list of connections between the provided stations, acting as a gateway to the [OpenData Transport API](https://transport.opendata.ch). The following requirements apply:

- page size should always be 2, and is not configurable
- simple cursor-based pagination should be implemented (see `cursor.helpers.ts`)
- data is fetched directly from the external API, nothing gets written to the database

### saveJourney (mutation)

This mutation should save a journey to the database. To do so, it should fetch the journey stations from the external API and then save them to the database. The following requirements apply:

- saving the same journey twice is allowed and can result in two "equal" journeys in the database, but with differing ids (for reasons of simplicity)
- the database schema should be fully normalized
- uuid's should be used as primary keys for journeys (PostgreSQL supports `gen_random_uuid`)
- raw SQL or Kysely DSL should be used to interact with the database

### journey (query)

This query should return a single journey from the database. It is crucial that this query does **not** fetch any data from the external API but queries the database to fulfill the request. Naturally, if the `connections` field on the journey is requested, it is required to fetch those from the [OpenData Transport API](https://transport.opendata.ch). The following requirements apply:

- raw SQL or Kysely DSL should be used to interact with the database
