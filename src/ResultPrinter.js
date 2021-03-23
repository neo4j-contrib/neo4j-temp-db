function calculateColumnSizes(columns, rows) {
  let sizes = {};
  for (let column of columns) {
    sizes[column] = column.length + 2;
  }

  for (let row of rows) {
    for (let column of columns) {
      sizes[column] = Math.max(sizes[column], text(row.get(column)).length + 2);
    }
  }

  return sizes;
}

function rowsTime(time, rowCount) {
  return rowCount + (rowCount == 1 ? " row" : " rows") + "\n" + time + " ms\n";
}

function queryStatisticsToString(queryStatistics) {
  if (!queryStatistics.containsUpdates()) {
    return "";
  }
  let s = "";
  s = addIfNonZero(s, "Nodes created: ", queryStatistics._stats.nodesCreated);
  s = addIfNonZero(s, "Relationships created: ", queryStatistics._stats.relationshipsCreated);
  s = addIfNonZero(s, "Properties set: ", queryStatistics._stats.propertiesSet);
  s = addIfNonZero(s, "Nodes deleted: ", queryStatistics._stats.nodesDeleted);
  s = addIfNonZero(s, "Relationships deleted: ", queryStatistics._stats.relationshipsDeleted);

  return s;
}

function addIfNonZero(string, message, count) {
  if (count > 0) {
    return string + message + count + "\n";
  }
  return string
}

function info(queryStatistics, hasData) {
	const hasStatistics = queryStatistics != null && queryStatistics.containsUpdates();
	if (hasData) {
		if (hasStatistics) {
      return queryStatisticsToString(queryStatistics);
		}
		return "";
	} else {
		if (hasStatistics) {
			return (
				"+-------------------+\n" +
				"| No data returned. |\n" +
        "+-------------------+\n" +
        queryStatisticsToString(queryStatistics)
      );
		} else {
			return (
				"+--------------------------------------------+\n" +
				"| No data returned, and nothing was changed. |\n" +
        "+--------------------------------------------+\n"
      );
		}
	}
}

function headerRow(columns, columnSizes) {
  let s = "| ";
  const size = columns.length;
  for (var i = 0; i < size; i++) {
    const column = columns[i];
    const width = columnSizes[column];
    const padding = ' '.repeat(width - column.length - 1);
    s = s + column + padding + "|";
    if (i < size - 1) {
      s = s + " ";
    }
  }
  return s;
}

function calculateTotalWidth(values) {
  let sum = values.length - 1; // borders
  for (const value of values) {
    sum += value;
  }
  return sum;
}

function text(value) {
  return "something";
  // if (value === null) {
  //   return "<null>";
  // }
  // if (value instanceof Value) {
  //   Value v = (Value) value;
  //   if (v.isNull()) {
  //       return "<null>";
  //   }
  //   if (value instanceof Node) {
  //       return value.toString() + props((Entity) value);
  //   }
  //   if (value instanceof Relationship) {
  //       Relationship rel = (Relationship) value;
  //       return ":" + rel.type() + "[" + rel.id() + "] " + props(rel);
  //   }
  //   value = v.asObject();
  // }
  // // TODO
  // // if (value instanceof Iterable) {
  // //     return formatIterator(((Iterable) value).iterator());
  // // }
  // // if (value.getClass().isArray()) {
  // //     return formatArray(value);
  // // }
  // // if (value instanceof String) {
  // //     return "'" + value + "'";
  // // }
  // return value.toString();
}

export function generateText(result) {
  let columnSizes = calculateColumnSizes(result.columns, result.rows);
  let totalWidth = calculateTotalWidth(_.values(columnSizes));

  const hasData = !_.isEmpty(result.columns);
  let string = "";
  if (hasData) {
    const delimiter = "+" + "-".repeat(totalWidth) + "+\n";
    string = string + delimiter;
    string = string + headerRow(result.columns, columnSizes);
    string = string + delimiter;

  //     for (Map<String, Object> row : rows) {
  //         out.println(row(columns, columnSizes, row));
  //     }
    string = string + delimiter;
  }
  
  string = string + rowsTime(result.time, result.rows.length);
  const stats = info(result.queryStatistics, hasData);
  if (!_.isEmpty(stats)) {
    string = string + stats;
  }
  return string;
}
