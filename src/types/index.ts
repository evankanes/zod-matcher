import { ZodType } from 'zod';
import { MatcherError } from '../error';
import { UnionToArray } from './union-to-array';

export type Mapper<Input, Output> = Output | ((input: Input) => Output);

export type Case<Schema extends ZodType, Map> = {
  schema: Schema;
  map: Map;
};

export type CasesType = Case<ZodType, unknown>[];

export type IsUnhandled<Input, Cases extends CasesType> = Exclude<
  Input,
  Cases[number]['schema']['_type']
>;

export type SafeParseSuccess<Data> = {
  success: true;
  data: Data;
};

export type SafeParseError = {
  success: false;
  error: MatcherError;
};

export type SafeParseResult<Data> = SafeParseSuccess<Data> | SafeParseError;

export type Result<
  Cases extends CasesType,
  Items extends unknown[] = UnionToArray<Cases[number]['map']>,
  Acc extends unknown[] = [],
> = Items['length'] extends Acc['length']
  ? Acc
  : Result<
      Cases,
      Items,
      [
        Items[Acc['length']] extends () => unknown
          ? ReturnType<Items[Acc['length']]>
          : Items[Acc['length']],
        ...Acc,
      ]
    >;
