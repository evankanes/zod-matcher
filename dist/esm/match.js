"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.match = void 0;
var zod_1 = require("zod");
var error_1 = require("./error");
var matcher = function (input, cases) { return ({
    case: function (schema, map) { return matcher(input, __spreadArray(__spreadArray([], cases, true), [{ schema: schema, map: map }], false)); },
    default: (function (map) {
        var _a = matcher(input, __spreadArray(__spreadArray([], cases, true), [
            { schema: zod_1.z.unknown(), map: map },
        ], false)), parse = _a.parse, safeParse = _a.safeParse;
        return { parse: parse, safeParse: safeParse };
    }),
    parse: (function () { return parse(input, cases); }),
    safeParse: (function () { return safeParse(input, cases); }),
}); };
var match = function (input) { return matcher(input, []); };
exports.match = match;
var safeParse = function (input, cases) {
    for (var _i = 0, cases_1 = cases; _i < cases_1.length; _i++) {
        var _a = cases_1[_i], schema = _a.schema, map = _a.map;
        var result = schema.safeParse(input);
        if (result.success)
            return {
                success: true,
                data: typeof map === 'function' ? map(result.data) : map,
            };
    }
    return {
        success: false,
        error: new error_1.MatcherError(input, cases),
    };
};
var parse = function (input, cases) {
    var result = safeParse(input, cases);
    if (result.success)
        return result.data;
    throw result.error;
};
