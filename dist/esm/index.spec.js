"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
var _1 = require(".");
var error_1 = require("./error");
var identity = function (a) { return a; };
var wrongSchema = zod_1.z.object({ _: zod_1.z.literal("_") });
var cases = [
    {
        name: "string",
        input: "abc",
        schema: zod_1.z.string(),
    },
    {
        name: "number",
        input: 12345,
        schema: zod_1.z.number(),
    },
    {
        name: "not a number",
        input: NaN,
        schema: zod_1.z.nan(),
    },
    {
        name: "boolean",
        input: true,
        schema: zod_1.z.boolean(),
    },
    {
        name: "date",
        input: new Date(),
        schema: zod_1.z.date(),
    },
    {
        name: "object",
        input: { a: "a" },
        schema: zod_1.z.object({ a: zod_1.z.string() }),
    },
    {
        name: "array",
        input: ["a"],
        schema: zod_1.z.array(zod_1.z.string()),
    },
];
it.each(cases)("Should parse $name", function (_a) {
    var input = _a.input, schema = _a.schema;
    expect((0, _1.match)(input).case(schema, identity).parse()).toStrictEqual(input);
});
it.each(cases)("Should throw fail parse $name", function (_a) {
    var input = _a.input, schema = _a.schema;
    expect(function () { return (0, _1.match)(input).case(wrongSchema, identity).parse(); }).toThrowError(error_1.MatcherError);
});
it.each(cases)("Should safely parse $name", function (_a) {
    var input = _a.input, schema = _a.schema;
    expect((0, _1.match)(input).case(schema, identity).safeParse()).toStrictEqual({
        success: true,
        data: input,
    });
});
it.each(cases)("Should safely fail parse $name", function (_a) {
    var input = _a.input, schema = _a.schema;
    expect((0, _1.match)(input).case(wrongSchema, identity).safeParse()).toStrictEqual({
        success: false,
        error: expect.any(error_1.MatcherError),
    });
});
