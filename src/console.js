import neo4j from "neo4j-driver";
import { v4 as uuidv4 } from "uuid";

export const neo4j_system_driver = neo4j.driver(
  process.env.CONSOLE_NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.CONSOLE_NEO4J_USER || "neo4j",
    process.env.CONSOLE_NEO4J_PASSWORD || "neo4j"
  ),
);

export async function createSession() {
  const sessionId = uuidv4().replace(/-/g, "");
  const currentTimestamp = Math.floor(new Date().getTime() / 1000);
  const dbName = `console${sessionId}${currentTimestamp}`;
  const session = neo4j_system_driver.session({database: "system", defaultAccessMode: neo4j.session.WRITE});

  const txc = session.beginTransaction();
  try {
    await txc.run(`CREATE DATABASE $dbName WAIT;`, { dbName });
    await txc.run(`CREATE USER $dbName SET PASSWORD '$dbName' SET PASSWORD CHANGE NOT REQUIRED;`, { dbName });
    await txc.run(`CREATE ROLE $dbName;`, { dbName });
    await txc.run(`GRANT ROLE $dbName TO $dbName;`, { dbName });
    await txc.run(`GRANT ALL ON DATABASE $dbName TO $dbName;`, { dbName });
    await txc.run(`GRANT ACCESS ON DATABASE $dbName TO $dbName;`, { dbName });
    await txc.run(`GRANT READ {*} ON GRAPH $dbName TO $dbName;`, { dbName });
    await txc.run(`GRANT TRAVERSE ON GRAPH $dbName TO $dbName;`, { dbName });
    await txc.run(`GRANT WRITE ON GRAPH $dbName TO $dbName;`, { dbName });
    await txc.commit();
  } catch (error) {
    console.error(error);
    await txc.rollback();
  } finally {
    await session.close();
  }

  return dbName;
}

export async function cleanSession(sessionId) {
  const session = neo4j_system_driver.session({database: "system"});
  const txc = session.beginTransaction();
  try {
    await txc.run(`STOP DATABASE $sessionId;`, { sessionId });
    await txc.run(`DROP DATABASE $sessionId;`, { sessionId });
    await txc.run(`DROP USER $sessionId;`, { sessionId });
    await txc.run(`DROP ROLE $sessionId;`, { sessionId });
    await txc.commit();
  } catch (error) {
    console.error(error);
    await txc.rollback();
  } finally {
    await session.close();
  }
}

export async function runCypherOnSession(cypher, sessionId, params) {
  const session_driver = neo4j.driver(
    process.env.CONSOLE_NEO4J_URI || "bolt://localhost:7687",
    neo4j.auth.basic(sessionId, sessionId),
  );
  const session = session_driver.session({
    database: sessionId,
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
