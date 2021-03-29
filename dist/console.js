"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDatabase = createDatabase;
exports.cleanDatabase = cleanDatabase;
exports.removeDatabasesOlderThan = removeDatabasesOlderThan;
exports.cleanAllDatabases = cleanAllDatabases;
exports.runCypherOnDatabase = runCypherOnDatabase;
exports.filterConsoleDatabasesFromResult = filterConsoleDatabasesFromResult;
exports.neo4j_system_driver = void 0;

var _neo4jDriver = _interopRequireDefault(require("neo4j-driver"));

var _uuid = require("uuid");

var _CypherResult = _interopRequireDefault(require("./CypherResult.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var neo4j_system_driver = _neo4jDriver["default"].driver(process.env.CONSOLE_NEO4J_URI, _neo4jDriver["default"].auth.basic(process.env.CONSOLE_NEO4J_USER, process.env.CONSOLE_NEO4J_PASSWORD));

exports.neo4j_system_driver = neo4j_system_driver;

function getCurrentTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

function createDatabase() {
  return _createDatabase.apply(this, arguments);
}

function _createDatabase() {
  _createDatabase = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var sessionId, currentTimestamp, database, session;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sessionId = (0, _uuid.v4)().replace(/-/g, "");
            currentTimestamp = getCurrentTimestamp();
            database = "console".concat(sessionId).concat(currentTimestamp);
            session = neo4j_system_driver.session({
              database: "system",
              defaultAccessMode: _neo4jDriver["default"].session.WRITE
            });
            _context.prev = 4;
            _context.next = 7;
            return session.run("CREATE DATABASE ".concat(database, " WAIT;"));

          case 7:
            _context.next = 9;
            return session.run("CREATE USER ".concat(database, " SET PASSWORD '").concat(database, "' SET PASSWORD CHANGE NOT REQUIRED;"));

          case 9:
            _context.next = 11;
            return session.run("CREATE ROLE ".concat(database, ";"));

          case 11:
            _context.next = 13;
            return session.run("GRANT ROLE ".concat(database, " TO ").concat(database, ";"));

          case 13:
            _context.next = 15;
            return session.run("GRANT ALL ON DATABASE ".concat(database, " TO ").concat(database, ";"));

          case 15:
            _context.next = 17;
            return session.run("GRANT ACCESS ON DATABASE ".concat(database, " TO ").concat(database, ";"));

          case 17:
            _context.next = 19;
            return session.run("GRANT READ {*} ON GRAPH ".concat(database, " TO ").concat(database, ";"));

          case 19:
            _context.next = 21;
            return session.run("GRANT TRAVERSE ON GRAPH ".concat(database, " TO ").concat(database, ";"));

          case 21:
            _context.next = 23;
            return session.run("GRANT WRITE ON GRAPH ".concat(database, " TO ").concat(database, ";"));

          case 23:
            _context.next = 28;
            break;

          case 25:
            _context.prev = 25;
            _context.t0 = _context["catch"](4);
            console.error(_context.t0);

          case 28:
            _context.prev = 28;
            _context.next = 31;
            return session.close();

          case 31:
            return _context.finish(28);

          case 32:
            return _context.abrupt("return", database);

          case 33:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 25, 28, 32]]);
  }));
  return _createDatabase.apply(this, arguments);
}

function deleteDatabaseUserAndRole(_x, _x2) {
  return _deleteDatabaseUserAndRole.apply(this, arguments);
}

function _deleteDatabaseUserAndRole() {
  _deleteDatabaseUserAndRole = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(session, database) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return session.run("STOP DATABASE ".concat(database, ";"));

          case 2:
            _context2.next = 4;
            return session.run("DROP DATABASE ".concat(database, ";"));

          case 4:
            _context2.next = 6;
            return session.run("DROP USER ".concat(database, ";"));

          case 6:
            _context2.next = 8;
            return session.run("DROP ROLE ".concat(database, ";"));

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _deleteDatabaseUserAndRole.apply(this, arguments);
}

function cleanDatabase(_x3) {
  return _cleanDatabase.apply(this, arguments);
}

function _cleanDatabase() {
  _cleanDatabase = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(database) {
    var session;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            session = neo4j_system_driver.session({
              database: "system"
            });
            _context3.prev = 1;
            _context3.next = 4;
            return deleteDatabaseUserAndRole(session, database);

          case 4:
            _context3.next = 9;
            break;

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3["catch"](1);
            console.error(_context3.t0);

          case 9:
            _context3.prev = 9;
            _context3.next = 12;
            return session.close();

          case 12:
            return _context3.finish(9);

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 6, 9, 13]]);
  }));
  return _cleanDatabase.apply(this, arguments);
}

function removeDatabasesOlderThan(_x4) {
  return _removeDatabasesOlderThan.apply(this, arguments);
}

function _removeDatabasesOlderThan() {
  _removeDatabasesOlderThan = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(seconds) {
    var session, result, shouldExpireAt, records, _iterator, _step, record, database, dbTimestamp, isExpired;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            session = neo4j_system_driver.session({
              database: "system"
            });
            _context4.next = 3;
            return session.run("SHOW DATABASES");

          case 3:
            result = _context4.sent;
            shouldExpireAt = getCurrentTimestamp() - seconds;
            _context4.prev = 5;
            records = filterConsoleDatabasesFromResult(result);
            _iterator = _createForOfIteratorHelper(records);
            _context4.prev = 8;

            _iterator.s();

          case 10:
            if ((_step = _iterator.n()).done) {
              _context4.next = 20;
              break;
            }

            record = _step.value;
            database = record.get("name");
            dbTimestamp = parseInt(database.slice(39), 10);
            isExpired = dbTimestamp <= shouldExpireAt;

            if (!isExpired) {
              _context4.next = 18;
              break;
            }

            _context4.next = 18;
            return deleteDatabaseUserAndRole(session, database);

          case 18:
            _context4.next = 10;
            break;

          case 20:
            _context4.next = 25;
            break;

          case 22:
            _context4.prev = 22;
            _context4.t0 = _context4["catch"](8);

            _iterator.e(_context4.t0);

          case 25:
            _context4.prev = 25;

            _iterator.f();

            return _context4.finish(25);

          case 28:
            _context4.next = 33;
            break;

          case 30:
            _context4.prev = 30;
            _context4.t1 = _context4["catch"](5);
            console.error(_context4.t1);

          case 33:
            _context4.prev = 33;
            _context4.next = 36;
            return session.close();

          case 36:
            return _context4.finish(33);

          case 37:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[5, 30, 33, 37], [8, 22, 25, 28]]);
  }));
  return _removeDatabasesOlderThan.apply(this, arguments);
}

function cleanAllDatabases() {
  return _cleanAllDatabases.apply(this, arguments);
}

function _cleanAllDatabases() {
  _cleanAllDatabases = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var session, result, records, _iterator2, _step2, record, database;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            session = neo4j_system_driver.session({
              database: "system"
            });
            _context5.next = 3;
            return session.run("SHOW DATABASES");

          case 3:
            result = _context5.sent;
            _context5.prev = 4;
            records = filterConsoleDatabasesFromResult(result);
            _iterator2 = _createForOfIteratorHelper(records);
            _context5.prev = 7;

            _iterator2.s();

          case 9:
            if ((_step2 = _iterator2.n()).done) {
              _context5.next = 16;
              break;
            }

            record = _step2.value;
            database = record.get("name");
            _context5.next = 14;
            return deleteDatabaseUserAndRole(session, database);

          case 14:
            _context5.next = 9;
            break;

          case 16:
            _context5.next = 21;
            break;

          case 18:
            _context5.prev = 18;
            _context5.t0 = _context5["catch"](7);

            _iterator2.e(_context5.t0);

          case 21:
            _context5.prev = 21;

            _iterator2.f();

            return _context5.finish(21);

          case 24:
            _context5.next = 29;
            break;

          case 26:
            _context5.prev = 26;
            _context5.t1 = _context5["catch"](4);
            console.error(_context5.t1);

          case 29:
            _context5.prev = 29;
            _context5.next = 32;
            return session.close();

          case 32:
            return _context5.finish(29);

          case 33:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[4, 26, 29, 33], [7, 18, 21, 24]]);
  }));
  return _cleanAllDatabases.apply(this, arguments);
}

function runCypherOnDatabase(_x5, _x6, _x7, _x8) {
  return _runCypherOnDatabase.apply(this, arguments);
}

function _runCypherOnDatabase() {
  _runCypherOnDatabase = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(cypher, database, version, params) {
    var session_driver, session, startTime, query, run, result, keys, summary, records, endTime, runTime, stats, plan, r;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            session_driver = _neo4jDriver["default"].driver(process.env.CONSOLE_NEO4J_URI, _neo4jDriver["default"].auth.basic(database, database));
            session = session_driver.session({
              database: database,
              defaultAccessMode: _neo4jDriver["default"].session.WRITE
            });
            _context6.prev = 2;
            startTime = new Date().getTime();
            query = "CYPHER ".concat(version, " ").concat(cypher);
            run = session.run(query, _objectSpread({}, params));
            _context6.next = 8;
            return run;

          case 8:
            result = _context6.sent;
            _context6.next = 11;
            return run.keys();

          case 11:
            keys = _context6.sent;
            summary = result.summary;
            records = result.records;
            endTime = new Date().getTime();
            runTime = endTime - startTime;
            stats = summary.counters;
            plan = null;
            r = new _CypherResult["default"](keys, records, stats, runTime, plan, query, session);
            _context6.t0 = cypher;
            _context6.next = 22;
            return r.cypherQueryViz(r);

          case 22:
            _context6.t1 = _context6.sent;
            _context6.t2 = version;
            _context6.t3 = keys;
            _context6.t4 = r.createJson();
            _context6.t5 = plan;
            _context6.t6 = _objectSpread(_objectSpread({}, stats._stats), {}, {
              rows: records.length,
              time: runTime,
              // text: stats.toString(),
              containsUpdates: stats.containsUpdates()
            });
            return _context6.abrupt("return", {
              query: _context6.t0,
              visualization: _context6.t1,
              version: _context6.t2,
              init: null,
              columns: _context6.t3,
              json: _context6.t4,
              plan: _context6.t5,
              stats: _context6.t6
            });

          case 31:
            _context6.prev = 31;
            _context6.t7 = _context6["catch"](2);
            console.error(_context6.t7);

          case 34:
            _context6.prev = 34;
            _context6.next = 37;
            return session.close();

          case 37:
            _context6.next = 39;
            return session_driver.close();

          case 39:
            return _context6.finish(34);

          case 40:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[2, 31, 34, 40]]);
  }));
  return _runCypherOnDatabase.apply(this, arguments);
}

function filterConsoleDatabasesFromResult(result) {
  return result.records.filter(function (record) {
    return record.get("name").indexOf("console") === 0;
  });
}