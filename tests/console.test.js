import {
  neo4j_system_driver,
  createDatabase,
  cleanDatabase,
  runCypherOnDatabase,
  cleanAllDatabases,
  filterConsoleDatabasesFromResult,
  removeDatabasesOlderThan,
} from "../src";
import {
  advanceBy as advanceDateBy,
  clear as clearDateMock,
} from "jest-date-mock";

let session;

beforeAll(async (done) => {
  session = neo4j_system_driver.session({ database: "system" });
  done();
});

test("can create database", async () => {
  const database = await createDatabase();

  const result = await session.run("SHOW DATABASE $database", { database });
  expect(result.records.length).toBe(1);

  const record = result.records[0];
  expect(record.get("name")).toBe(database);
  expect(record.get("currentStatus")).toBe("online");

  await cleanDatabase(database);
});

test("can run cypher on database", async () => {
  const database = await createDatabase();
  const result = await runCypherOnDatabase("RETURN 1;", database, "3.5");
  // console.error("TO DO: confirm old console returns this as the JSON");
  // // also
  // // - add typescript?
  // // - does SubGraph is complete? maybe its missing stuff when running queries
  // // - make driver/session setup/teardown global for tests, it is conflicting when running all tests together
  // // -
  // expect(result.json).toStrictEqual([{ 1: "1" }]);
  await cleanDatabase(database);
});

test("can clean up database", async () => {
  const database = await createDatabase();
  const result = await session.run("SHOW DATABASE $database", { database });
  expect(result.records.length).toBe(1);

  await cleanDatabase(database);
  const cleanResult = await session.run("SHOW DATABASE $database", {
    database,
  });
  expect(cleanResult.records.length).toBe(0);
});

test("can clean up expired console databases", async () => {
  let result, databases;

  advanceDateBy(-1000 * 60 * 60 * 24); // 24h ago
  await createDatabase();

  clearDateMock();
  await createDatabase();

  result = await session.run("SHOW DATABASES");
  databases = filterConsoleDatabasesFromResult(result);
  expect(databases.length).toBe(2);

  await removeDatabasesOlderThan(60 * 60 * 24); // 24h

  result = await session.run("SHOW DATABASES");
  databases = filterConsoleDatabasesFromResult(result);
  expect(databases.length).toBe(1);

  await cleanAllDatabases();
});

// test("can clean up all console databases", async () => {
//   let result, databases;

//   await createDatabase();
//   await createDatabase();

//   result = await session.run("SHOW DATABASES");
//   databases = filterConsoleDatabasesFromResult(result);
//   expect(databases.length).toBe(2);

//   await cleanAllDatabases();

//   result = await session.run("SHOW DATABASES");
//   databases = filterConsoleDatabasesFromResult(result);
//   expect(databases.length).toBe(0);
// });

afterAll(async (done) => {
  await session.close();
  await neo4j_system_driver.close();
  done();
});
