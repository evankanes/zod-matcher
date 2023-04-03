import type { ZodSchema } from 'zod';
import { z } from 'zod';
import { match } from './match';
import { MatcherError } from './error';

const identity = <A>(a: A) => a;

const wrongSchema = z.object({ _: z.literal('_') }) as ZodSchema;

const cases = [
  {
    name: 'string',
    input: 'abc',
    schema: z.string(),
  },
  {
    name: 'number',
    input: 12_345,
    schema: z.number(),
  },
  {
    name: 'not a number',
    input: Number.NaN,
    schema: z.nan(),
  },
  {
    name: 'boolean',
    input: true,
    schema: z.boolean(),
  },
  {
    name: 'date',
    input: new Date(),
    schema: z.date(),
  },
  {
    name: 'object',
    input: { a: 'a' },
    schema: z.object({ a: z.string() }),
  },
  {
    name: 'array',
    input: ['a'],
    schema: z.array(z.string()),
  },
];

it.each(cases)('Should parse $name', ({ input, schema }) => {
  expect(match(input).case(schema, identity).parse()).toStrictEqual(input);
});

it.each(cases)('Should throw fail parse $name', ({ input }) => {
  expect(() => match(input).case(wrongSchema, identity).parse()).toThrowError(
    MatcherError,
  );
});

it.each(cases)('Should safely parse $name', ({ input, schema }) => {
  expect(match(input).case(schema, identity).safeParse()).toStrictEqual({
    success: true,
    data: input,
  });
});

it.each(cases)('Should safely fail parse $name', ({ input }) => {
  expect(match(input).case(wrongSchema, identity).safeParse()).toStrictEqual({
    success: false,
    error: expect.any(MatcherError),
  });
});

it('Default should narrow input', () => {
  const result = match('A' as 'A' | 'B' | 'C')
    .case(z.literal('A'), () => 'A' as const)
    .case(z.literal('B'), () => 'B' as const)
    .default(type => type)
    .parse();

  expect(result).toBe('A');
});
