import type { ZodType } from 'zod';
import type { MatcherError } from '../error';
import type { UnionToArray } from './union-to-array';
export type Mapper<Input, Output> = (input: Input) => Output;
export interface Case<Schema extends ZodType, Map> {
    schema: Schema;
    map: Map;
}
export type CasesType = Case<ZodType, unknown>[];
export type IsUnhandled<Input, Cases extends CasesType> = Exclude<Input, Cases[number]['schema']['_type']>;
export interface SafeParseSuccess<Data> {
    success: true;
    data: Data;
}
export interface SafeParseError {
    success: false;
    error: MatcherError;
}
export type SafeParseResult<Data> = SafeParseError | SafeParseSuccess<Data>;
export type Result<Cases extends CasesType, Items extends unknown[] = UnionToArray<Cases[number]['map']>, Accumulator extends unknown[] = []> = Items['length'] extends Accumulator['length'] ? Accumulator[number] : Result<Cases, Items, [
    Items[Accumulator['length']] extends (...a: any[]) => any ? ReturnType<Items[Accumulator['length']]> : Items[Accumulator['length']],
    ...Accumulator
]>;
export type HandledCases<Cases extends CasesType, Items extends unknown[] = UnionToArray<Cases[number]['schema']['_type']>, Accumulator extends unknown[] = []> = Items['length'] extends Accumulator['length'] ? Accumulator[number] : Result<Cases, Items, [
    Items[Accumulator['length']] extends (...a: any[]) => any ? ReturnType<Items[Accumulator['length']]> : Items[Accumulator['length']],
    ...Accumulator
]>;
