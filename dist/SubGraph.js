"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _lodash = _interopRequireDefault(require("lodash"));

var _neo4jDriverCore = require("neo4j-driver-core");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var SubGraph = /*#__PURE__*/function () {
  function SubGraph() {
    (0, _classCallCheck2["default"])(this, SubGraph);
    this.nodes = new Map();
    this.relationships = new Map();
  }

  (0, _createClass2["default"])(SubGraph, [{
    key: "fromSession",
    value: function () {
      var _fromSession = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(session) {
        var _this = this;

        var result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return session.run("MATCH (n) RETURN n");

              case 2:
                result = _context.sent;
                result.records.forEach(function (record) {
                  _this.add(record.get("n"));
                });
                _context.next = 6;
                return session.run("MATCH ()-[r]->() RETURN r");

              case 6:
                result = _context.sent;
                result.records.forEach(function (record) {
                  _this.add(record.get("r"));
                });

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function fromSession(_x) {
        return _fromSession.apply(this, arguments);
      }

      return fromSession;
    }()
  }, {
    key: "add",
    value: function add(record) {
      if ((0, _neo4jDriverCore.isNode)(record)) {
        this.nodes.set(record.identity.toInt(), record);
      } else if ((0, _neo4jDriverCore.isRelationship)(record)) {
        this.relationships.set(record.identity.toInt(), record);
      }
    }
  }, {
    key: "getNodesForViz",
    value: function getNodesForViz() {
      var _this2 = this;

      var keys = Array.from(this.nodes.keys()).sort();
      return keys.map(function (key) {
        var node = _this2.nodes.get(key);

        return _objectSpread(_objectSpread({}, node.properties), {}, {
          id: node.identity.toInt(),
          labels: node.labels
        });
      });
    }
  }, {
    key: "getRelationshipsForViz",
    value: function getRelationshipsForViz() {
      var _this3 = this;

      var keys = Array.from(this.relationships.keys()).sort();
      return keys.map(function (key) {
        var rel = _this3.relationships.get(key);

        return _objectSpread(_objectSpread({}, rel.properties), {}, {
          type: rel.type,
          id: rel.identity.toInt(),
          start: rel.start.toInt(),
          end: rel.end.toInt(),
          source: rel.start.toInt(),
          target: rel.end.toInt()
        });
      });
    }
  }, {
    key: "markSelection",
    value: function markSelection(result) {
      var _iterator = _createForOfIteratorHelper(result.rows),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var row = _step.value;

          var _iterator2 = _createForOfIteratorHelper(row.entries()),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var entry = _step2.value;
              this.markEntry(entry);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "markEntry",
    value: function markEntry(entry) {
      var _entry = (0, _slicedToArray2["default"])(entry, 2),
          column = _entry[0],
          value = _entry[1];

      if (_lodash["default"].isArray(value)) {
        var _iterator3 = _createForOfIteratorHelper(value),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var inner = _step3.value;
            this.markNodeOrRel(column, inner);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      } else if ((0, _neo4jDriverCore.isPath)(value)) {
        var _iterator4 = _createForOfIteratorHelper(value.segments),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var segment = _step4.value;
            this.markEntry([column, segment]);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      } else if ((0, _neo4jDriverCore.isPathSegment)(value)) {
        this.markNodeOrRel(column, value.start);
        this.markNodeOrRel(column, value.relationship);
        this.markNodeOrRel(column, value.end);
      } else {
        this.markNodeOrRel(column, value);
      }
    }
  }, {
    key: "markNodeOrRel",
    value: function markNodeOrRel(column, value) {
      if ((0, _neo4jDriverCore.isNode)(value) && this.nodes.has(value.identity.toInt())) {
        var id = value.identity.toInt();
        var item = this.nodes.get(id);
        item.properties.selected = column;
        this.nodes.set(id, item);
      }

      if ((0, _neo4jDriverCore.isRelationship)(value) && this.relationships.has(value.identity.toInt())) {
        var _id = value.identity.toInt();

        var _item = this.relationships.get(_id);

        _item.properties.selected = column;
        this.relationships.set(_id, _item);
      }
    }
  }]);
  return SubGraph;
}();

exports["default"] = SubGraph;