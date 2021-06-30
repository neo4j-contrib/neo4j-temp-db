"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _neo4jDriver = _interopRequireDefault(require("neo4j-driver"));

var _uuid = require("uuid");

var _CypherResult = _interopRequireDefault(require("./CypherResult.js"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function getCurrentTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

var Neo4jTempDB = /*#__PURE__*/function () {
  function Neo4jTempDB(url, authToken, config) {
    (0, _classCallCheck2["default"])(this, Neo4jTempDB);
    this.databaseUrl = url;
    this.databaseAuthToken = authToken;
    this.databaseConfig = _objectSpread(_objectSpread({}, config), {}, {
      maxConnectionPoolSize: 2,
      maxConnectionLifetime: 20 * 60 * 1000 // 2 minutes

    });
  }

  (0, _createClass2["default"])(Neo4jTempDB, [{
    key: "getSystemDriver",
    value: function getSystemDriver() {
      return _neo4jDriver["default"].driver(this.databaseUrl, this.databaseAuthToken, this.databaseConfig);
    } // export async function createTempDb(url: string, authToken: Map<string, string>, config: Object) {

  }, {
    key: "createDatabase",
    value: function () {
      var _createDatabase = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var sessionId, currentTimestamp, database, neo4jSystemDriver, session;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                sessionId = (0, _uuid.v4)().replace(/-/g, "");
                currentTimestamp = getCurrentTimestamp();
                database = "console".concat(sessionId).concat(currentTimestamp);
                neo4jSystemDriver = this.getSystemDriver();
                session = neo4jSystemDriver.session({
                  database: "system",
                  defaultAccessMode: _neo4jDriver["default"].session.WRITE
                });
                _context.prev = 5;
                _context.next = 8;
                return session.run("CREATE DATABASE ".concat(database, " WAIT;"));

              case 8:
                _context.next = 10;
                return session.run("CREATE USER ".concat(database, " SET PASSWORD '").concat(database, "' SET PASSWORD CHANGE NOT REQUIRED;"));

              case 10:
                _context.next = 12;
                return session.run("CREATE ROLE ".concat(database, ";"));

              case 12:
                _context.next = 14;
                return session.run("GRANT ROLE ".concat(database, " TO ").concat(database, ";"));

              case 14:
                _context.next = 16;
                return session.run("GRANT ALL ON DATABASE ".concat(database, " TO ").concat(database, ";"));

              case 16:
                _context.next = 18;
                return session.run("GRANT ACCESS ON DATABASE ".concat(database, " TO ").concat(database, ";"));

              case 18:
                _context.next = 20;
                return session.run("GRANT READ {*} ON GRAPH ".concat(database, " TO ").concat(database, ";"));

              case 20:
                _context.next = 22;
                return session.run("GRANT TRAVERSE ON GRAPH ".concat(database, " TO ").concat(database, ";"));

              case 22:
                _context.next = 24;
                return session.run("GRANT WRITE ON GRAPH ".concat(database, " TO ").concat(database, ";"));

              case 24:
                _context.next = 29;
                break;

              case 26:
                _context.prev = 26;
                _context.t0 = _context["catch"](5);
                console.error(_context.t0);

              case 29:
                _context.prev = 29;
                _context.next = 32;
                return session.close();

              case 32:
                _context.next = 34;
                return neo4jSystemDriver.close();

              case 34:
                return _context.finish(29);

              case 35:
                return _context.abrupt("return", database);

              case 36:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 26, 29, 35]]);
      }));

      function createDatabase() {
        return _createDatabase.apply(this, arguments);
      }

      return createDatabase;
    }()
  }, {
    key: "deleteDatabaseUserAndRole",
    value: function () {
      var _deleteDatabaseUserAndRole = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(session, database) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return session.run("STOP DATABASE ".concat(database, ";"));

              case 3:
                _context2.next = 8;
                break;

              case 5:
                _context2.prev = 5;
                _context2.t0 = _context2["catch"](0);
                console.error(_context2.t0);

              case 8:
                _context2.prev = 8;
                _context2.next = 11;
                return session.run("DROP DATABASE ".concat(database, ";"));

              case 11:
                _context2.next = 16;
                break;

              case 13:
                _context2.prev = 13;
                _context2.t1 = _context2["catch"](8);
                console.error(_context2.t1);

              case 16:
                _context2.prev = 16;
                _context2.next = 19;
                return session.run("DROP USER ".concat(database, ";"));

              case 19:
                _context2.next = 24;
                break;

              case 21:
                _context2.prev = 21;
                _context2.t2 = _context2["catch"](16);
                console.error(_context2.t2);

              case 24:
                _context2.prev = 24;
                _context2.next = 27;
                return session.run("DROP ROLE ".concat(database, ";"));

              case 27:
                _context2.next = 32;
                break;

              case 29:
                _context2.prev = 29;
                _context2.t3 = _context2["catch"](24);
                console.error(_context2.t3);

              case 32:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 5], [8, 13], [16, 21], [24, 29]]);
      }));

      function deleteDatabaseUserAndRole(_x, _x2) {
        return _deleteDatabaseUserAndRole.apply(this, arguments);
      }

      return deleteDatabaseUserAndRole;
    }()
  }, {
    key: "cleanDatabase",
    value: function () {
      var _cleanDatabase = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(database) {
        var neo4jSystemDriver, session;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                neo4jSystemDriver = this.getSystemDriver();
                session = neo4jSystemDriver.session({
                  database: "system"
                });
                _context3.prev = 2;
                _context3.next = 5;
                return this.deleteDatabaseUserAndRole(session, database);

              case 5:
                _context3.next = 10;
                break;

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](2);
                console.error(_context3.t0);

              case 10:
                _context3.prev = 10;
                _context3.next = 13;
                return session.close();

              case 13:
                _context3.next = 15;
                return neo4jSystemDriver.close();

              case 15:
                return _context3.finish(10);

              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[2, 7, 10, 16]]);
      }));

      function cleanDatabase(_x3) {
        return _cleanDatabase.apply(this, arguments);
      }

      return cleanDatabase;
    }()
  }, {
    key: "cleanDatabasesOlderThan",
    value: function () {
      var _cleanDatabasesOlderThan = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(seconds) {
        var neo4jSystemDriver, session, result, shouldExpireAt, records, _iterator, _step, record, database, dbTimestamp, isExpired;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                neo4jSystemDriver = this.getSystemDriver();
                session = neo4jSystemDriver.session({
                  database: "system"
                });
                _context4.next = 4;
                return session.run("SHOW DATABASES");

              case 4:
                result = _context4.sent;
                shouldExpireAt = getCurrentTimestamp() - seconds;
                _context4.prev = 6;
                records = this.filterConsoleDatabasesFromResult(result);
                console.log("Databases found: " + records.length);
                _iterator = _createForOfIteratorHelper(records);
                _context4.prev = 10;

                _iterator.s();

              case 12:
                if ((_step = _iterator.n()).done) {
                  _context4.next = 26;
                  break;
                }

                record = _step.value;
                database = record.get("name");
                dbTimestamp = parseInt(database.slice(39), 10);
                isExpired = dbTimestamp <= shouldExpireAt;

                if (!isExpired) {
                  _context4.next = 23;
                  break;
                }

                console.log("Deleted expired database: " + database);
                _context4.next = 21;
                return this.deleteDatabaseUserAndRole(session, database);

              case 21:
                _context4.next = 24;
                break;

              case 23:
                console.log("Not expired yet: " + database);

              case 24:
                _context4.next = 12;
                break;

              case 26:
                _context4.next = 31;
                break;

              case 28:
                _context4.prev = 28;
                _context4.t0 = _context4["catch"](10);

                _iterator.e(_context4.t0);

              case 31:
                _context4.prev = 31;

                _iterator.f();

                return _context4.finish(31);

              case 34:
                _context4.next = 39;
                break;

              case 36:
                _context4.prev = 36;
                _context4.t1 = _context4["catch"](6);
                console.error(_context4.t1);

              case 39:
                _context4.prev = 39;
                _context4.next = 42;
                return session.close();

              case 42:
                _context4.next = 44;
                return neo4jSystemDriver.close();

              case 44:
                return _context4.finish(39);

              case 45:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[6, 36, 39, 45], [10, 28, 31, 34]]);
      }));

      function cleanDatabasesOlderThan(_x4) {
        return _cleanDatabasesOlderThan.apply(this, arguments);
      }

      return cleanDatabasesOlderThan;
    }()
  }, {
    key: "cleanAllDatabases",
    value: function () {
      var _cleanAllDatabases = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        var neo4jSystemDriver, session, result, records, _iterator2, _step2, record, database;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                neo4jSystemDriver = this.getSystemDriver();
                session = neo4jSystemDriver.session({
                  database: "system"
                });
                _context5.next = 4;
                return session.run("SHOW DATABASES");

              case 4:
                result = _context5.sent;
                _context5.prev = 5;
                records = this.filterConsoleDatabasesFromResult(result);
                _iterator2 = _createForOfIteratorHelper(records);
                _context5.prev = 8;

                _iterator2.s();

              case 10:
                if ((_step2 = _iterator2.n()).done) {
                  _context5.next = 17;
                  break;
                }

                record = _step2.value;
                database = record.get("name");
                _context5.next = 15;
                return this.deleteDatabaseUserAndRole(session, database);

              case 15:
                _context5.next = 10;
                break;

              case 17:
                _context5.next = 22;
                break;

              case 19:
                _context5.prev = 19;
                _context5.t0 = _context5["catch"](8);

                _iterator2.e(_context5.t0);

              case 22:
                _context5.prev = 22;

                _iterator2.f();

                return _context5.finish(22);

              case 25:
                _context5.next = 30;
                break;

              case 27:
                _context5.prev = 27;
                _context5.t1 = _context5["catch"](5);
                console.error(_context5.t1);

              case 30:
                _context5.prev = 30;
                _context5.next = 33;
                return session.close();

              case 33:
                _context5.next = 35;
                return neo4jSystemDriver.close();

              case 35:
                return _context5.finish(30);

              case 36:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[5, 27, 30, 36], [8, 19, 22, 25]]);
      }));

      function cleanAllDatabases() {
        return _cleanAllDatabases.apply(this, arguments);
      }

      return cleanAllDatabases;
    }()
  }, {
    key: "runCypherOnDatabase",
    value: function () {
      var _runCypherOnDatabase = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(database, version, cypher, params) {
        var allowedVersions, cypherVersion, sessionDriver, session, startTime, query, run, result, keys, summary, records, endTime, runTime, stats, plan, r;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                allowedVersions = ["3.5", "4.1", "4.2"];
                cypherVersion = version || "3.5";

                if (allowedVersions.indexOf(cypherVersion) < 0) {
                  cypherVersion = allowedVersions[0];
                }

                sessionDriver = _neo4jDriver["default"].driver(this.databaseUrl, _neo4jDriver["default"].auth.basic(database, database), this.databaseConfig);
                session = sessionDriver.session({
                  database: database,
                  defaultAccessMode: _neo4jDriver["default"].session.WRITE
                });
                _context6.prev = 5;
                startTime = new Date().getTime();
                query = "CYPHER ".concat(version, " ").concat(cypher);
                run = session.run(query, _objectSpread({}, params));
                _context6.next = 11;
                return run;

              case 11:
                result = _context6.sent;
                _context6.next = 14;
                return run.keys();

              case 14:
                keys = _context6.sent;
                summary = result.summary;
                records = result.records;
                endTime = new Date().getTime();
                runTime = endTime - startTime;
                stats = summary.counters;
                plan = null;
                r = new _CypherResult["default"](keys, records, stats, runTime, plan, query, session);
                _context6.t0 = cypher;
                _context6.next = 25;
                return r.cypherQueryViz(r);

              case 25:
                _context6.t1 = _context6.sent;
                _context6.t2 = version;
                _context6.t3 = keys;
                _context6.t4 = r.createJson();
                _context6.t5 = plan;
                _context6.t6 = _objectSpread(_objectSpread({}, stats._stats), {}, {
                  rows: records.length,
                  time: runTime,
                  containsUpdates: stats.containsUpdates()
                });
                return _context6.abrupt("return", {
                  query: _context6.t0,
                  visualization: _context6.t1,
                  version: _context6.t2,
                  columns: _context6.t3,
                  json: _context6.t4,
                  plan: _context6.t5,
                  stats: _context6.t6
                });

              case 34:
                _context6.prev = 34;
                _context6.t7 = _context6["catch"](5);
                console.error(_context6.t7);

              case 37:
                _context6.prev = 37;
                _context6.next = 40;
                return session.close();

              case 40:
                _context6.next = 42;
                return sessionDriver.close();

              case 42:
                return _context6.finish(37);

              case 43:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[5, 34, 37, 43]]);
      }));

      function runCypherOnDatabase(_x5, _x6, _x7, _x8) {
        return _runCypherOnDatabase.apply(this, arguments);
      }

      return runCypherOnDatabase;
    }()
  }, {
    key: "filterConsoleDatabasesFromResult",
    value: function filterConsoleDatabasesFromResult(result) {
      return result.records.filter(function (record) {
        return record.get("name").indexOf("console") === 0;
      });
    }
  }]);
  return Neo4jTempDB;
}();

exports["default"] = Neo4jTempDB;