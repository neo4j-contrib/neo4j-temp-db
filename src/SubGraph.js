import { isRelationship, isNode } from "neo4j-driver/lib/graph-types.js";

export default class SubGraph {
  constructor() {
    this.nodes = [];
    this.relationships = [];
  }

  async fromSession(session) {
    let result = await session.run("MATCH (n) RETURN n");
    result.records.forEach(record => {
      this.add(record.get("n"));
    })

    result = await session.run("MATCH ()-[r]->() RETURN r");
    result.records.forEach(record => {
      this.add(record.get("r"));
    })
  }

  add(record) {
    if (isNode(record)) {
      this.nodes.push(record);
    } else if (isRelationship(record)) {
      this.relationships.push(record);
    }
  }

  getNodesForViz() {
    return this.nodes.map(node => ({
      ...node.properties,
      id: node.identity.toInt(),
      labels: node.labels,
    }));
  }

  getRelationshipsForViz() {
    return this.relationships.map(rel => ({
      ...rel.properties,
      type: rel.type,
      id: rel.identity.toInt(),
      start: rel.start.toInt(),
      end: rel.end.toInt(),
      source: rel.start.toInt(),
      target: rel.end.toInt(),
    }));
  }

  // static toMap(node) {
  //   final Map<String, Object> data = toMap((PropertyContainer) node);
  //   data.put("id", node.getId());
  //   final List<String> labelNames = getLabelNames(node);
  //   if (!labelNames.isEmpty()) data.put("labels",labelNames);
  //   return data;
  // }

  // static propertyContainerToMap(node) {
  //   return node.properties;
  //   // let result = {};
  //   // for (const prop of pc.getPropertyKeys()) {
  //   //   result.put(prop, pc.getProperty(prop));
  //   // }
  //   // return result;
  // }

  // static getLabelNames(node) {
  //   return node.labels;
  // }
}
