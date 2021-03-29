"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _graphTypes = require("neo4j-driver/lib/graph-types.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SubGraph = /*#__PURE__*/function () {
  function SubGraph() {
    _classCallCheck(this, SubGraph);

    this.nodes = new Map();
    this.relationships = new Map();
  }

  _createClass(SubGraph, [{
    key: "fromSession",
    value: function () {
      var _fromSession = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(session) {
        var _this = this;

        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
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
      if ((0, _graphTypes.isNode)(record)) {
        this.nodes.set(record.identity.toInt(), record);
      } else if ((0, _graphTypes.isRelationship)(record)) {
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
      var _entry = _slicedToArray(entry, 2),
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
      } else if ((0, _graphTypes.isPath)(value)) {
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
      } else if ((0, _graphTypes.isPathSegment)(value)) {
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
      if ((0, _graphTypes.isNode)(value) && this.nodes.has(value.identity.toInt())) {
        var id = value.identity.toInt();
        var item = this.nodes.get(id);
        item.properties.selected = column;
        this.nodes.set(id, item);
      }

      if ((0, _graphTypes.isRelationship)(value) && this.relationships.has(value.identity.toInt())) {
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