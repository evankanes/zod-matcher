import { ZodType, ZodUnknown } from "zod";
import { Case, CasesType, IsUnhandled, Mapper, Result, SafeParseResult } from "./types";
type Matcher<Input, Cases extends CasesType> = {
    case: <Schema extends ZodType, Output, Map extends Mapper<Schema["_type"], Output>>(schema: Schema, map: Map) => Matcher<Input, [...Cases, Case<Schema, Map>]>;
    default: <Output, Map extends Mapper<Input, Output>>(map: Map) => Matcher<Input, [...Cases, Case<ZodUnknown, Map>]>;
    parse: IsUnhandled<Input, Cases> extends never ? () => Result<Cases> : {
        message: "Unhandled cases. Add more cases or add default";
        missing: IsUnhandled<Input, Cases>;
    };
    safeParse: IsUnhandled<Input, Cases> extends never ? () => SafeParseResult<Result<Cases>> : {
        message: "Unhandled cases. Add more cases or add default";
        missing: IsUnhandled<Input, Cases>;
    };
};
export declare const match: <Input>(input: Input) => Matcher<Input, never[]>;
export {};
//# sourceMappingURL=index.d.ts.map