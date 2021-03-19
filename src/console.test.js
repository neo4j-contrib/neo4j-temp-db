import { neo4j_system_driver, createSession, cleanSession, runCypherOnSession } from "./console.js";

let session;

beforeAll(async done => {
  session = neo4j_system_driver.session({database: "system"});
  done();
});

test('can create session', async () => {
  const sessionId = await createSession();
  const result = await session.run("SHOW DATABASE $sessionId", { sessionId });
  expect(result.records.length).toBe(1);
  const record = result.records[0];
  expect(record.get("name")).toBe(sessionId);
  expect(record.get("currentStatus")).toBe("online");
});

test('can clean up session', async () => {
  const sessionId = await createSession();
  const result = await session.run("SHOW DATABASE $sessionId", { sessionId });
  expect(result.records.length).toBe(1);

  await cleanSession(sessionId);
  const cleanResult = await session.run("SHOW DATABASE $sessionId", { sessionId });
  expect(cleanResult.records.length).toBe(0);
});

test('can run cypher on session', async () => {
  const sessionId = await createSession();
  const result = await runCypherOnSession(sessionId, "return 1;");
  expect(result).toBe(1);
});

afterAll(async done => {
  await session.close();
  neo4j_system_driver.close();
  done();
});
