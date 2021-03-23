import _ from "lodash";
import { isRelationship, isNode, isPath, isPathSegment } from "neo4j-driver/lib/graph-types.js";

export default class SubGraph {
  constructor() {
    this.nodes = new Map();
    this.relationships = new Map();
  }

  async fromSession(session) {
    let result = await session.run("MATCH (n) RETURN n");
    result.records.forEach((record) => {
      this.add(record.get("n"));
    });

    result = await session.run("MATCH ()-[r]->() RETURN r");
    result.records.forEach((record) => {
      this.add(record.get("r"));
    });
  }

  add(record) {
    if (isNode(record)) {
      this.nodes.set(record.identity.toInt(), record);
    } else if (isRelationship(record)) {
      this.relationships.set(record.identity.toInt(), record);
    }
  }

  getNodesForViz() {
    let keys = Array.from(this.nodes.keys()).sort();
    return keys.map(key => {
      const node = this.nodes.get(key)
      return {
        ...node.properties,
        id: node.identity.toInt(),
        labels: node.labels,
      };
    });
  }

  getRelationshipsForViz() {
    let keys = Array.from(this.relationships.keys()).sort();
    return keys.map(key => {
      const rel = this.relationships.get(key)
      return {
        ...rel.properties,
        type: rel.type,
        id: rel.identity.toInt(),
        start: rel.start.toInt(),
        end: rel.end.toInt(),
        source: rel.start.toInt(),
        target: rel.end.toInt(),
      };
    });
  }

  markSelection(result) {
    for (const row of result.rows) {
      for (const entry of row.entries()) {
        this.markEntry(entry);
      }
    }
  }

  markEntry(entry) {
    const [column, value] = entry;
    if (_.isArray(value)) {
      for (const inner of value) {
        this.markNodeOrRel(column, inner);
      }
    } else if (isPath(value)) {
      for (const segment of value.segments) {
        this.markEntry([column, segment]);
      }
    } else if (isPathSegment(value)) {
      this.markNodeOrRel(column, value.start);
      this.markNodeOrRel(column, value.relationship);
      this.markNodeOrRel(column, value.end);
    } else {
      this.markNodeOrRel(column, value);
    }
  }

  markNodeOrRel(column, value) {
    if (isNode(value) && this.nodes.has(value.identity.toInt())) {
      const id = value.identity.toInt();
      const item = this.nodes.get(id);
      item.properties.selected = column;
      this.nodes.set(id, item);
    }

    if (isRelationship(value) && this.relationships.has(value.identity.toInt())) {
      const id = value.identity.toInt();
      const item = this.relationships.get(id);
      item.properties.selected = column;
      this.relationships.set(id, item);
    }
  }
}
