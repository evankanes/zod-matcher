import { CasesType } from './types';

export class MatcherError extends Error {
  name = 'MatcherError';
  constructor(input: unknown, cases: CasesType) {
    super(
      JSON.stringify(
        {
          input,
          cases: cases.map(({ schema }) => schema),
        },
        undefined,
        2,
      ),
    );
    Object.setPrototypeOf(this, MatcherError.prototype);
  }
}
