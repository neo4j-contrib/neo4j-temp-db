import _ from "lodash";
import { isInt, toString } from "neo4j-driver";
import { isRelationship, isNode, isPath, isPathSegment } from "neo4j-driver/lib/graph-types.js";
import SubGraph from "./SubGraph.js";

export default class CypherResult {
  constructor(columns, rows, queryStatistics, time, plan, query, session) {
    this.query = query;
    this.columns = columns;
    this.queryStatistics = queryStatistics;
    this.time = time;
    this.rows = rows;
    this.plan = plan;
    this.session = session;
  }

  createJson() {
    let rows = [];
    for (const row of this.rows) {
      const newRow = {};
      for (const column of this.columns) {
        const value = row.get(column);
        newRow[column] = toJsonCompatible(value);
      }
      rows.push(newRow);
    }
    return rows;
  }

  async cypherQueryViz(result) {
    const sub = new SubGraph();
    await sub.fromSession(this.session);
    sub.markSelection(this);
    return {
      nodes: sub.getNodesForViz(),
      links: sub.getRelationshipsForViz(),
    };
  }
}

function toJsonCompatible(value) {
  if (isNode(value)) {
    let result = value.properties;
    result["_id"] = value.identity.toInt();

    if (!_.isEmpty(value.labels)) {
      result["_labels"] = value.labels;
    }
    return result;
  }

  if (isRelationship(value)) {
    let result = value.properties;
    result["_id"] = value.identity.toInt();
    result["_start"] = value.start.toInt();
    result["_end"] = value.end.toInt();
    result["_type"] = value.type;
    return result;
  }

  if (_.isArray(value)) {
    let result = [];
    for (const inner of value) {
      result.push(toJsonCompatible(inner));
    }
    return result;
  }

  if (isInt(value)) {
    return value.toString();
  }

  if (isPath(value)) {
    let result = [];
    for (const segment of value.segments) {
      result = result.concat(toJsonCompatible(segment));
    }
    return result
  }

  if (isPathSegment(value)) {
    let result = [];
    result.push(toJsonCompatible(value.start));
    result.push(toJsonCompatible(value.relationship));
    result.push(toJsonCompatible(value.end));
    return result
  }

  return value;
}
