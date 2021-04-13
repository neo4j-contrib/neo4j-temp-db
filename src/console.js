import neo4j from "neo4j-driver";
import { v4 as uuidv4 } from "uuid";
import CypherResult from "./CypherResult.js";

function getCurrentTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

export default class Neo4jTempDB {
  constructor(url, authToken, config) {
    this.databaseUrl = url;
    this.databaseAuthToken = authToken;
    this.databaseConfig = config;
  }

  getSystemDriver() {
    return neo4j.driver(
      this.databaseUrl,
      this.databaseAuthToken,
      this.databaseConfig
    )
  }

  // export async function createTempDb(url: string, authToken: Map<string, string>, config: Object) {
  async createDatabase() {
    const sessionId = uuidv4().replace(/-/g, "");
    const currentTimestamp = getCurrentTimestamp();
    const database = `console${sessionId}${currentTimestamp}`;

    const neo4jSystemDriver = this.getSystemDriver();

    const session = neo4jSystemDriver.session({
      database: "system",
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      await session.run(`CREATE DATABASE ${database} WAIT;`);
      await session.run(
        `CREATE USER ${database} SET PASSWORD '${database}' SET PASSWORD CHANGE NOT REQUIRED;`
      );
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
      await neo4jSystemDriver.close();
    }

    return database;
  }

  async deleteDatabaseUserAndRole(session, database) {
    await session.run(`STOP DATABASE ${database};`);
    await session.run(`DROP DATABASE ${database};`);
    await session.run(`DROP USER ${database};`);
    await session.run(`DROP ROLE ${database};`);
  }

  async cleanDatabase(database) {
    const neo4jSystemDriver = this.getSystemDriver();
    const session = neo4jSystemDriver.session({ database: "system" });
    try {
      await this.deleteDatabaseUserAndRole(session, database);
    } catch (error) {
      console.error(error);
    } finally {
      await session.close();
      await neo4jSystemDriver.close();
    }
  }

  async cleanDatabasesOlderThan(seconds) {
    const neo4jSystemDriver = this.getSystemDriver();
    const session = neo4jSystemDriver.session({ database: "system" });
    const result = await session.run("SHOW DATABASES");
    const shouldExpireAt = getCurrentTimestamp() - seconds;
    try {
      const records = this.filterConsoleDatabasesFromResult(result);
      console.log("Databases found: " + records.length);
      for (const record of records) {
        const database = record.get("name");
        const dbTimestamp = parseInt(database.slice(39), 10);
        const isExpired = dbTimestamp <= shouldExpireAt;
        if (isExpired) {
          console.log("Deleted expired database: " + database);
          await this.deleteDatabaseUserAndRole(session, database);
        } else {
          console.log("Not expired yet: " + database);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      await session.close();
      await neo4jSystemDriver.close();
    }
  }

  async cleanAllDatabases() {
    const neo4jSystemDriver = this.getSystemDriver();
    const session = neo4jSystemDriver.session({ database: "system" });
    const result = await session.run("SHOW DATABASES");
    try {
      const records = this.filterConsoleDatabasesFromResult(result);
      for (const record of records) {
        const database = record.get("name");
        await this.deleteDatabaseUserAndRole(session, database);
      }
    } catch (error) {
      console.error(error);
    } finally {
      await session.close();
      await neo4jSystemDriver.close();
    }
  }

  async runCypherOnDatabase(database, version, cypher, params) {
    const allowedVersions = ["3.5", "4.1", "4.2"];
    let cypherVersion = version || "3.5";
    if (allowedVersions.indexOf(cypherVersion) < 0) {
      cypherVersion = allowedVersions[0];
    }

    const sessionDriver = neo4j.driver(
      this.databaseUrl,
      neo4j.auth.basic(database, database),
      this.databaseConfig
    );
    const session = sessionDriver.session({
      database: database,
      defaultAccessMode: neo4j.session.WRITE,
    });
    try {
      const startTime = new Date().getTime();
      const query = `CYPHER ${version} ${cypher}`;
      const run = session.run(query, { ...params });
      const result = await run;
      const keys = await run.keys();
      const summary = result.summary;
      const records = result.records;
      const endTime = new Date().getTime();
      const runTime = endTime - startTime;
      const stats = summary.counters;
      const plan = null;

      const r = new CypherResult(
        keys,
        records,
        stats,
        runTime,
        plan,
        query,
        session
      );

      return {
        query: cypher,
        visualization: await r.cypherQueryViz(r),
        version: version,
        columns: keys,
        json: r.createJson(),
        plan: plan,
        stats: {
          ...stats._stats,
          rows: records.length,
          time: runTime,
          containsUpdates: stats.containsUpdates(),
        },
      };
    } catch (error) {
      console.error(error);
    } finally {
      await session.close();
      await sessionDriver.close();
    }
  }

  filterConsoleDatabasesFromResult(result) {
    return result.records.filter(
      (record) => record.get("name").indexOf("console") === 0
    );
  }
}
