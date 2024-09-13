-- TODO: Add your CREATE TABLE statements here

CREATE TABLE journey
(
    id: VARCHAR UNIQUE PRIMARY
    from: VARCHAR
    to: VARCHAR
    via: JSON
)

-- DO NOT REMOVE
-- MUST BE THE LAST STATEMENT IN THIS FILE
-- Creates a duplicate of the 'assignment' database for the E2E tests
CREATE DATABASE assignment_test
WITH TEMPLATE assignment
OWNER postgres;