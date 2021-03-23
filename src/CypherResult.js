import _ from "lodash";
import { isRelationship, isNode } from "neo4j-driver/lib/graph-types.js";
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
    // this.text = generateText();
		// this.json = createJson();
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
    return {
      nodes: sub.getNodesForViz(),
      links: sub.getRelationshipsForViz()
    }
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

  // if (value instanceof Map) {
  //     @SuppressWarnings("unchecked") Map<String,Object> map = (Map<String,Object>) value;
  //     final Map<String,Object> result = new LinkedHashMap<>(map.size());
  //     for (Map.Entry<String,Object> entry : map.entrySet()) {
  //         result.put(entry.getKey(), toJsonCompatible(entry.getValue()));
  //     }
  //     return result;
  // }
  // if (value instanceof Iterable) {
  //     final List<Object> result = new ArrayList<>();
  //     for (Object inner : (Iterable)value) {
  //         result.add(toJsonCompatible(inner));
  //     }
  //     return result;
  // }
  return value;
}
