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

type CaseType<Input, Cases extends CasesType> = <
  Schema extends ZodType,
  Output,
  Map extends Mapper<Schema['_type'], Output>,
>(
  schema: Schema,
  map: Map,
) => Matcher<Input, [...Cases, Case<Schema, Map>]>;

type DefaultType<Input, Cases extends CasesType> = <
  Output,
  Map extends Mapper<Exclude<Input, Result<Cases>>, Output>,
>(
  map: Map,
) => Omit<
  Matcher<Input, [...Cases, Case<ZodUnknown, Map>]>,
  'case' | 'default'
>;

type ParseType<Input, Cases extends CasesType> = IsUnhandled<
  Input,
  Cases
> extends never
  ? () => Result<Cases>
  : {
      message: 'Unhandled cases. Add more cases or add default.';
      missing: IsUnhandled<Input, Cases>;
    };

type SafeParseType<Input, Cases extends CasesType> = IsUnhandled<
  Input,
  Cases
> extends never
  ? () => SafeParseResult<Result<Cases>>
  : {
      message: 'Unhandled cases. Add more cases or add default.';
      missing: IsUnhandled<Input, Cases>;
    };

type Matcher<Input, Cases extends CasesType> = {
  /**
   * @param schema
   * Zod schema to match against.
   * @param map
   * Function passes type of schema as argument.
   */
  case: CaseType<Input, Cases>;
  /**
   * Fallback if no other cases match.
   * Can only be used *once* after all other cases.
   * @param map
   * Function passes narrowed type of schema as argument.
   */
  default: DefaultType<Input, Cases>;
  /**
   * Get result of match. Throws if no match found.
   */
  parse: ParseType<Input, Cases>;
  /**
   * Get result of match. Returns result union if no match found.
   * @example
   * | { success: true, data: x }
   * | { success: false, error: MatcherError }
   */
  safeParse: SafeParseType<Input, Cases>;
};

const matcher = <Input, Cases extends CasesType>(
  input: Input,
  cases: Cases,
): Matcher<Input, Cases> => ({
  case: (schema, map) => matcher(input, [...cases, { schema, map }]),

  default: (map => {
    const { parse, safeParse } = matcher(input, [
      ...cases,
      { schema: z.unknown(), map },
    ]);
    return { parse, safeParse };
  }) as DefaultType<Input, Cases>,

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
