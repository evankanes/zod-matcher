import type { CasesType } from './types';
export declare class MatcherError extends Error {
    name: string;
    constructor(input: unknown, cases: CasesType);
}
