CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE stations (
    id VARCHAR PRIMARY KEY ,
    name VARCHAR,
    latitude DECIMAL,
    longitude DECIMAL
);
CREATE TABLE journey (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
    "from" VARCHAR REFERENCES stations(id) NOT NULL,
    "to" VARCHAR REFERENCES stations(id) NOT NULL,
    via VARCHAR[]
);

-- DO NOT REMOVE
-- MUST BE THE LAST STATEMENT IN THIS FILE
-- Creates a duplicate of the 'assignment' database for the E2E tests
CREATE DATABASE assignment_test
WITH TEMPLATE assignment
OWNER postgres;