# @neo4j-labs/temp-dbs

This library was created initialy to be used on https://portal.graphgist.org/ where users are able to run custom cypher queries directly on the browser, can change queries, and interact with the results.

This implementation may work with your project too.

Under the hood it creates a temporary database on a Neo4j instance (v4.0 or higher).
To prevent the running out of memory on the database, each temporary database is named with a timestamp to be used in a cleanup operation. 

## How to use:

```javascript
import neo4j from "neo4j-driver"
import Neo4jTempDb from "@neo4j-labs/temp-dbs"

const tempDb = new Neo4jTempDb(
  'neo4j://localhost',
  neo4j.auth.basic('neo4j', 'password')
)
```

### Create a temporary database

```javascript
const databaseName = tempDb.createDatabase()
```

### Run Cyphers on the temp database

```javascript
const result = neo4jTempDb.runCypherOnDatabase(databaseName, cypherVersion, cypher, params)
```

`result` is an object with the following properties:

key | description
----|------------
json | a JSON valid object containing all nodes and relationships returned by the cypher query
visualization | all nodes and relationships on the current database
columns | all the keys returned by the query run
query | the cypher query sent
version | the cypher version selected

### Clean up the database

This is important to free resources on your server since databases don't auto expire:

```javascript
await tempDb.cleanDatabase(database)
```
### Clean up databases expired databases 

```javascript
await tempDb.cleanDatabasesOlderThan(60 * 60 * 24) // 24h cleanup interval
```

### Clean up all databases

```javascript
await tempDb.cleanAllDatabases()
```

## Run development tests

Make sure you have the right credentials to your Neo4j database:

```shell
export CONSOLE_NEO4J_URI=bolt://localhost:7687
export CONSOLE_NEO4J_USER=neo4j
export CONSOLE_NEO4J_PASSWORD=123456
```

And to run tests:

```shell
npm test
```
