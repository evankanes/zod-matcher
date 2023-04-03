import type { ZodType, ZodUnknown } from 'zod';
import type { Case, CasesType, HandledCases, IsUnhandled, Mapper, Result, SafeParseResult } from './types';
type CaseType<Input, Cases extends CasesType> = <Schema extends ZodType, Output, Map extends Mapper<Schema['_type'], Output>>(schema: Schema, map: Map) => Matcher<Input, [...Cases, Case<Schema, Map>]>;
type DefaultType<Input, Cases extends CasesType> = <Output, Map extends Mapper<Exclude<Input, HandledCases<Cases>>, Output>>(map: Map) => Omit<Matcher<Input, [...Cases, Case<ZodUnknown, Map>]>, 'case' | 'default'>;
type ParseType<Input, Cases extends CasesType> = IsUnhandled<Input, Cases> extends never ? () => Result<Cases> : {
    _message: 'Unhandled cases. Add more cases or add default.';
    _missing: IsUnhandled<Input, Cases>;
};
type SafeParseType<Input, Cases extends CasesType> = IsUnhandled<Input, Cases> extends never ? () => SafeParseResult<Result<Cases>> : {
    _message: 'Unhandled cases. Add more cases or add default.';
    _missing: IsUnhandled<Input, Cases>;
};
interface Matcher<Input, Cases extends CasesType> {
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
}
export declare const match: <Input>(input: Input) => Matcher<Input, []>;
export {};
