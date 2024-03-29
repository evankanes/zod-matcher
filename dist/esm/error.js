"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatcherError = void 0;
var MatcherError = /** @class */ (function (_super) {
    __extends(MatcherError, _super);
    function MatcherError(input, cases) {
        var _this = _super.call(this, JSON.stringify({
            input: input,
            cases: cases.map(function (_a) {
                var schema = _a.schema;
                return schema;
            }),
        }, undefined, 2)) || this;
        _this.name = 'MatcherError';
        Object.setPrototypeOf(_this, MatcherError.prototype);
        return _this;
    }
    return MatcherError;
}(Error));
exports.MatcherError = MatcherError;
