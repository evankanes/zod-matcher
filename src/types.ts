import { ZodType } from "zod";
import { MatcherError } from "./error";

export type Mapper<Input, Output> = (input: Input) => Output;

export type Case<Schema extends ZodType, Map extends Mapper<any, any>> = {
  schema: Schema;
  map: Map;
};

export type CasesType = Case<ZodType, Mapper<any, any>>[];

export type IsUnhandled<Input, Cases extends CasesType> = Exclude<
  Input,
  Cases[number]["schema"]["_type"]
>;

export type Result<Cases extends CasesType> = ReturnType<Cases[number]["map"]>;

export type SafeParseSuccess<Data> = {
  success: true;
  data: Data;
};

export type SafeParseError = {
  success: false;
  error: MatcherError;
};

export type SafeParseResult<Data> = SafeParseSuccess<Data> | SafeParseError;
