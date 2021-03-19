import { neo4j_system_driver, createDatabase, cleanDatabase, runCypherOnDatabase } from "./console.js";

let session;

beforeAll(async done => {
  session = neo4j_system_driver.session({database: "system"});
  done();
});

test('can create database', async () => {
  const database = await createDatabase();
  const result = await session.run("SHOW DATABASE $database", { database });
  expect(result.records.length).toBe(1);
  const record = result.records[0];
  expect(record.get("name")).toBe(database);
  expect(record.get("currentStatus")).toBe("online");
  await cleanDatabase(database);
});

test('can clean up database', async () => {
  const database = await createDatabase();
  const result = await session.run("SHOW DATABASE $database", { database });
  expect(result.records.length).toBe(1);

  await cleanDatabase(database);
  const cleanResult = await session.run("SHOW DATABASE $database", { database });
  expect(cleanResult.records.length).toBe(0);
});

test('can run cypher on database', async () => {
  const database = await createDatabase();
  const result = await runCypherOnDatabase("RETURN 1;", database);
  expect(result).toBe("1");
  await cleanDatabase(database);
});

afterAll(async done => {
  await session.close();
  neo4j_system_driver.close();
  done();
});
