import { neo4j_system_driver, createDatabase, cleanDatabase, runCypherOnDatabase, cleanAllDatabases, filterConsoleDatabasesFromResult, removeDatabasesOlderThan } from "./console.js";
import { advanceBy as advanceDateBy, clear as clearDateMock } from 'jest-date-mock';

let session;

beforeAll(async done => {
  session = neo4j_system_driver.session({database: "system"});
  done();
});

// test('can run cypher on database', async () => {
//   const database = await createDatabase();
//   const result = await runCypherOnDatabase(`
//     CREATE
//       (Episode1:Movie {name: 'Episode I: The Phantom Menace'}),
//       (r2_d2:Droid {name: 'R2-D2'}),
//       (yoda:Person {name: 'YODA'}),
//       (r2_d2)-[:SPEAKS_WITH]->(yoda),
//       (yoda)-[:APPEARS_IN]->(Episode1);
//   `, database, "3.5");
//   // expect(result).toBe("1");
// });

test('returns data', async () => {
  const database = await createDatabase();
  await runCypherOnDatabase(`
    CREATE
      (Episode1:Movie {name: 'Episode I: The Phantom Menace'}),
      (r2_d2:Droid {name: 'R2-D2'}),
      (yoda:Person {name: 'YODA'}),
      (r2_d2)-[:SPEAKS_WITH]->(yoda),
      (yoda)-[:APPEARS_IN]->(Episode1);
  `, database, "3.5");
  const result = await runCypherOnDatabase(`MATCH (n)-[r]->(m) RETURN n, r, m;`, database, "3.5");
  console.log(result);
  // expect(result).toBe("1");
});

afterAll(async done => {
  await session.close();
  await cleanAllDatabases();
  neo4j_system_driver.close();
  done();
});
