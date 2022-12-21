import { z } from "zod";
import { match } from "./match";
import { MatcherError } from "./error";

const identity = <A>(a: A) => a;

const wrongSchema = z.object({ _: z.literal("_") }) as any;

const cases = [
  {
    name: "string",
    input: "abc",
    schema: z.string(),
  },
  {
    name: "number",
    input: 12345,
    schema: z.number(),
  },
  {
    name: "not a number",
    input: NaN,
    schema: z.nan(),
  },
  {
    name: "boolean",
    input: true,
    schema: z.boolean(),
  },
  {
    name: "date",
    input: new Date(),
    schema: z.date(),
  },
  {
    name: "object",
    input: { a: "a" },
    schema: z.object({ a: z.string() }),
  },
  {
    name: "array",
    input: ["a"],
    schema: z.array(z.string()),
  },
];

it.each(cases)("Should parse $name", ({ input, schema }) => {
  expect(match(input).case(schema, identity).parse()).toStrictEqual(input);
});

it.each(cases)("Should throw fail parse $name", ({ input, schema }) => {
  expect(() => match(input).case(wrongSchema, identity).parse()).toThrowError(
    MatcherError
  );
});

it.each(cases)("Should safely parse $name", ({ input, schema }) => {
  expect(match(input).case(schema, identity).safeParse()).toStrictEqual({
    success: true,
    data: input,
  });
});

it.each(cases)("Should safely fail parse $name", ({ input, schema }) => {
  expect(match(input).case(wrongSchema, identity).safeParse()).toStrictEqual({
    success: false,
    error: expect.any(MatcherError),
  });
});
