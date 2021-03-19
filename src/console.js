import neo4j from "neo4j-driver";
import { v4 as uuidv4 } from "uuid";

export const neo4j_system_driver = neo4j.driver(
  process.env.CONSOLE_NEO4J_URI,
  neo4j.auth.basic(
    process.env.CONSOLE_NEO4J_USER,
    process.env.CONSOLE_NEO4J_PASSWORD
  ),
);

function getCurrentTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

export async function createDatabase() {
  const sessionId = uuidv4().replace(/-/g, "");
  const currentTimestamp = getCurrentTimestamp();
  const database = `console${sessionId}${currentTimestamp}`;
  const session = neo4j_system_driver.session({database: "system", defaultAccessMode: neo4j.session.WRITE});

  try {
    await session.run(`CREATE DATABASE ${database} WAIT;`);
    await session.run(`CREATE USER ${database} SET PASSWORD '${database}' SET PASSWORD CHANGE NOT REQUIRED;`);
    await session.run(`CREATE ROLE ${database};`);
    await session.run(`GRANT ROLE ${database} TO ${database};`);
    await session.run(`GRANT ALL ON DATABASE ${database} TO ${database};`);
    await session.run(`GRANT ACCESS ON DATABASE ${database} TO ${database};`);
    await session.run(`GRANT READ {*} ON GRAPH ${database} TO ${database};`);
    await session.run(`GRANT TRAVERSE ON GRAPH ${database} TO ${database};`);
    await session.run(`GRANT WRITE ON GRAPH ${database} TO ${database};`);
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }

  return database;
}

async function deleteDatabaseUserAndRole(session, database) {
  await session.run(`STOP DATABASE ${database};`);
  await session.run(`DROP DATABASE ${database};`);
  await session.run(`DROP USER ${database};`);
  await session.run(`DROP ROLE ${database};`);
}

export async function cleanDatabase(database) {
  const session = neo4j_system_driver.session({database: "system"});
  try {
    await deleteDatabaseUserAndRole(session, database);
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
}

export async function removeDatabasesOlderThan(seconds) {
  const session = neo4j_system_driver.session({database: "system"});
  const result = await session.run("SHOW DATABASES");
  const shouldExpireAt = getCurrentTimestamp() - seconds;
  try {
    const records = filterConsoleDatabasesFromResult(result);
    for(const record of records) {
      const database = record.get("name");
      const dbTimestamp = parseInt(database.slice(39), 10);
      const isExpired = dbTimestamp <= shouldExpireAt;
      if (isExpired) {
        await deleteDatabaseUserAndRole(session, database);
      }
    };
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
}

export async function cleanAllDatabases() {
  const session = neo4j_system_driver.session({database: "system"});
  const result = await session.run("SHOW DATABASES");
  try {
    const records = filterConsoleDatabasesFromResult(result);
    for(const record of records) {
      const database = record.get("name");
      await deleteDatabaseUserAndRole(session, database);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
}

export async function runCypherOnDatabase(cypher, database, params) {
  const session_driver = neo4j.driver(
    process.env.CONSOLE_NEO4J_URI,
    neo4j.auth.basic(database, database),
  );
  const session = session_driver.session({
    database: database,
    defaultAccessMode: neo4j.session.WRITE
  });
  try {
    // cypher 3.5 MATCH ...
    const result = await session.run(cypher, {...params});
    return "1";
    // return CypherResult
    // https://github.com/neo4j-contrib/rabbithole/blob/f9e4ed8b1dd9edbeba36ab2550613ef48575cf36/src/main/java/org/neo4j/community/console/CypherQueryExecutor.java#L212
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
    await session_driver.close();
  }
}

export function filterConsoleDatabasesFromResult(result) {
  return result.records.filter((record) => record.get("name").indexOf("console") === 0);
}
