import { ZodType } from "zod";
import { MatcherError } from "./error";


export type Mapper<Input, Output> = Output | ((input: Input) => Output);

export type Case<Schema extends ZodType, Map> = {
  schema: Schema;
  map: Map;
};

export type CasesType = Case<ZodType, unknown>[];

export type IsUnhandled<Input, Cases extends CasesType> = Exclude<
  Input,
  Cases[number]["schema"]["_type"]
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
  Acc extends unknown[] = []
  > = 
  Items['length'] extends Acc['length'] ? Acc : 
  Result<Cases, Items, [Items[Acc['length']] extends (() => unknown) ? ReturnType<Items[Acc['length']]> : Items[Acc['length']], ...Acc]>



// credits goes to https://stackoverflow.com/a/50375286
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

// Converts union to overloaded function
type UnionToOvlds<U> = UnionToIntersection<
  U extends any ? (f: U) => void : never
>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

// Finally me)
type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A];

interface Person {
  name: string;
  age: number;
  surname: string;
  children: number;
}

