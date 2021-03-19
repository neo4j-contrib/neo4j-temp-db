import neo4j from "neo4j-driver";
import { v4 as uuidv4 } from "uuid";

export const neo4j_system_driver = neo4j.driver(
  process.env.CONSOLE_NEO4J_URI,
  neo4j.auth.basic(
    process.env.CONSOLE_NEO4J_USER,
    process.env.CONSOLE_NEO4J_PASSWORD
  ),
);

export async function createSession() {
  const sessionId = uuidv4().replace(/-/g, "");
  const currentTimestamp = Math.floor(new Date().getTime() / 1000);
  const database = `console${sessionId}${currentTimestamp}`;
  const session = neo4j_system_driver.session({database: "system", defaultAccessMode: neo4j.session.WRITE});

  const txc = session.beginTransaction();
  try {
    await txc.run(`CREATE DATABASE $database WAIT;`, { database });
    await txc.run(`CREATE USER $database SET PASSWORD '$database' SET PASSWORD CHANGE NOT REQUIRED;`, { database });
    await txc.run(`CREATE ROLE $database;`, { database });
    await txc.run(`GRANT ROLE $database TO $database;`, { database });
    await txc.run(`GRANT ALL ON DATABASE $database TO $database;`, { database });
    await txc.run(`GRANT ACCESS ON DATABASE $database TO $database;`, { database });
    await txc.run(`GRANT READ {*} ON GRAPH $database TO $database;`, { database });
    await txc.run(`GRANT TRAVERSE ON GRAPH $database TO $database;`, { database });
    await txc.run(`GRANT WRITE ON GRAPH $database TO $database;`, { database });
    await txc.commit();
  } catch (error) {
    console.error(error);
    await txc.rollback();
  } finally {
    await session.close();
  }

  return database;
}

export async function cleanSession(database) {
  const session = neo4j_system_driver.session({database: "system"});
  const txc = session.beginTransaction();
  try {
    await txc.run(`STOP DATABASE $database;`, { database });
    await txc.run(`DROP DATABASE $database;`, { database });
    await txc.run(`DROP USER $database;`, { database });
    await txc.run(`DROP ROLE $database;`, { database });
    await txc.commit();
  } catch (error) {
    console.error(error);
    await txc.rollback();
  } finally {
    await session.close();
  }
}

export async function runCypherOnSession(cypher, database, params) {
  const session_driver = neo4j.driver(
    process.env.CONSOLE_NEO4J_URI || "bolt://localhost:7687",
    neo4j.auth.basic(database, database),
  );
  const session = session_driver.session({
    database: database,
    defaultAccessMode: neo4j.session.WRITE
  });
  const txc = session.beginTransaction();
  try {
    // cypher 3.5 MATCH ...
    const result = await txc.run(cypher, {...params});
    await txc.commit();
    return "1";
    // return CypherResult
    // https://github.com/neo4j-contrib/rabbithole/blob/f9e4ed8b1dd9edbeba36ab2550613ef48575cf36/src/main/java/org/neo4j/community/console/CypherQueryExecutor.java#L212
  } catch (error) {
    console.error(error);
    await txc.rollback();
  } finally {
    await session.close();
    await session_driver.close();
  }
}
