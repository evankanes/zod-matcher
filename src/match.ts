import { z, ZodType, ZodUnknown } from 'zod';
import { MatcherError } from './error';
import {
  Case,
  CasesType,
  IsUnhandled,
  Mapper,
  Result,
  SafeParseResult,
} from './types';

type Matcher<Input, Cases extends CasesType> = {
  case: <
    Schema extends ZodType,
    Output,
    Map extends Mapper<Schema['_type'], Output>,
  >(
    schema: Schema,
    map: Map | Output,
  ) => Matcher<Input, [...Cases, Case<Schema, Map | Output>]>;

  default: <Output, Map extends Mapper<Input, Output>>(
    map: Map | Output,
  ) => Matcher<Input, [...Cases, Case<ZodUnknown, Map | Output>]>;

  parse: IsUnhandled<Input, Cases> extends never
    ? () => Result<Cases>
    : {
        message: 'Unhandled cases. Add more cases or add default';
        missing: IsUnhandled<Input, Cases>;
      };

  safeParse: IsUnhandled<Input, Cases> extends never
    ? () => SafeParseResult<Result<Cases>>
    : {
        message: 'Unhandled cases. Add more cases or add default';
        missing: IsUnhandled<Input, Cases>;
      };
};

const matcher = <Input, Cases extends CasesType>(
  input: Input,
  cases: Cases,
): Matcher<Input, Cases> => ({
  case: (schema, map) => matcher(input, [...cases, { schema, map }]),
  default: map => matcher(input, [...cases, { schema: z.unknown(), map }]),
  parse: (() => parse(input, cases)) as any,
  safeParse: (() => safeParse(input, cases)) as any,
});

export const match = <Input>(input: Input) => matcher<Input, []>(input, []);

const safeParse = <Cases extends CasesType>(
  input: unknown,
  cases: Cases,
): SafeParseResult<Result<Cases>> => {
  for (const { schema, map } of cases) {
    const result = schema.safeParse(input);

    if (result.success)
      return {
        success: true,
        data: typeof map === 'function' ? map(result.data) : map,
      };
  }

  return {
    success: false,
    error: new MatcherError(input, cases),
  };
};

const parse = <Cases extends CasesType>(
  input: unknown,
  cases: Cases,
): Result<Cases> => {
  const result = safeParse(input, cases);
  if (result.success) return result.data;
  throw result.error;
};
