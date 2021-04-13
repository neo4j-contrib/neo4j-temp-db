import neo4j from "neo4j-driver";
import Neo4jTempDB from "../src";
import {
  advanceBy as advanceDateBy,
  clear as clearDateMock,
} from "jest-date-mock";

let neo4jSystemDriver;
let session;
let tempDb;

beforeAll(async (done) => {
  tempDb = new Neo4jTempDB(
    process.env.CONSOLE_NEO4J_URI,
    neo4j.auth.basic(
      process.env.CONSOLE_NEO4J_USER,
      process.env.CONSOLE_NEO4J_PASSWORD
    )
  );
  neo4jSystemDriver = tempDb.getSystemDriver();
  session = neo4jSystemDriver.session({ database: "system" });
  done();
});

test("can create database", async () => {
  const database = await tempDb.createDatabase();

  const result = await session.run("SHOW DATABASE $database", { database });
  expect(result.records.length).toBe(1);

  const record = result.records[0];
  expect(record.get("name")).toBe(database);
  expect(record.get("currentStatus")).toBe("online");

  await tempDb.cleanDatabase(database);
});

test("can run cypher on database", async () => {
  const database = await tempDb.createDatabase();
  const result = await tempDb.runCypherOnDatabase(database, "3.5", "RETURN 1;");
  await tempDb.cleanDatabase(database);
});

test("can clean up database", async () => {
  const database = await tempDb.createDatabase();
  const result = await session.run("SHOW DATABASE $database", { database });
  expect(result.records.length).toBe(1);

  await tempDb.cleanDatabase(database);
  const cleanResult = await session.run("SHOW DATABASE $database", {
    database,
  });
  expect(cleanResult.records.length).toBe(0);
});

test("can clean up expired console databases", async () => {
  let result, databases;

  advanceDateBy(-1000 * 60 * 60 * 24); // 24h ago
  await tempDb.createDatabase();

  clearDateMock();
  await tempDb.createDatabase();

  result = await session.run("SHOW DATABASES");
  databases = tempDb.filterConsoleDatabasesFromResult(result);
  expect(databases.length).toBe(2);

  await tempDb.cleanDatabasesOlderThan(60 * 60 * 24); // 24h

  result = await session.run("SHOW DATABASES");
  databases = tempDb.filterConsoleDatabasesFromResult(result);
  expect(databases.length).toBe(1);

  await tempDb.cleanAllDatabases();
});

// test("can clean up all console databases", async () => {
//   let result, databases;

//   await tempDb.createDatabase();
//   await tempDb.createDatabase();

//   result = await session.run("SHOW DATABASES");
//   databases = tempDb.filterConsoleDatabasesFromResult(result);
//   expect(databases.length).toBe(2);

//   await tempDb.cleanAllDatabases();

//   result = await session.run("SHOW DATABASES");
//   databases = tempDb.filterConsoleDatabasesFromResult(result);
//   expect(databases.length).toBe(0);
// });

afterAll(async (done) => {
  await session.close();
  await neo4jSystemDriver.close();
  done();
});
