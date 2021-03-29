"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _neo4jDriver = require("neo4j-driver");

var _graphTypes = require("neo4j-driver/lib/graph-types.js");

var _SubGraph = _interopRequireDefault(require("./SubGraph.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CypherResult = /*#__PURE__*/function () {
  function CypherResult(columns, rows, queryStatistics, time, plan, query, session) {
    _classCallCheck(this, CypherResult);

    this.query = query;
    this.columns = columns;
    this.queryStatistics = queryStatistics;
    this.time = time;
    this.rows = rows;
    this.plan = plan;
    this.session = session;
  }

  _createClass(CypherResult, [{
    key: "createJson",
    value: function createJson() {
      var rows = [];

      var _iterator = _createForOfIteratorHelper(this.rows),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var row = _step.value;
          var newRow = {};

          var _iterator2 = _createForOfIteratorHelper(this.columns),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var column = _step2.value;
              var value = row.get(column);
              newRow[column] = toJsonCompatible(value);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          rows.push(newRow);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return rows;
    }
  }, {
    key: "cypherQueryViz",
    value: function () {
      var _cypherQueryViz = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(result) {
        var sub;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                sub = new _SubGraph["default"]();
                _context.next = 3;
                return sub.fromSession(this.session);

              case 3:
                sub.markSelection(this);
                return _context.abrupt("return", {
                  nodes: sub.getNodesForViz(),
                  links: sub.getRelationshipsForViz()
                });

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function cypherQueryViz(_x) {
        return _cypherQueryViz.apply(this, arguments);
      }

      return cypherQueryViz;
    }()
  }]);

  return CypherResult;
}();

exports["default"] = CypherResult;

function toJsonCompatible(value) {
  if ((0, _graphTypes.isNode)(value)) {
    var result = value.properties;
    result["_id"] = value.identity.toInt();

    if (!_lodash["default"].isEmpty(value.labels)) {
      result["_labels"] = value.labels;
    }

    return result;
  }

  if ((0, _graphTypes.isRelationship)(value)) {
    var _result = value.properties;
    _result["_id"] = value.identity.toInt();
    _result["_start"] = value.start.toInt();
    _result["_end"] = value.end.toInt();
    _result["_type"] = value.type;
    return _result;
  }

  if (_lodash["default"].isArray(value)) {
    var _result2 = [];

    var _iterator3 = _createForOfIteratorHelper(value),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var inner = _step3.value;

        _result2.push(toJsonCompatible(inner));
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    return _result2;
  }

  if ((0, _neo4jDriver.isInt)(value)) {
    return value.toString();
  }

  if ((0, _graphTypes.isPath)(value)) {
    var _result3 = [];

    var _iterator4 = _createForOfIteratorHelper(value.segments),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var segment = _step4.value;
        _result3 = _result3.concat(toJsonCompatible(segment));
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }

    _result3.push(toJsonCompatible(value.end));

    return _result3;
  }

  if ((0, _graphTypes.isPathSegment)(value)) {
    var _result4 = [];

    _result4.push(toJsonCompatible(value.start));

    _result4.push(toJsonCompatible(value.relationship));

    return _result4;
  }

  return value;
}