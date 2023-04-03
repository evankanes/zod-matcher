import type { CasesType } from './types';

export class MatcherError extends Error {
  public name = 'MatcherError';

  public constructor(input: unknown, cases: CasesType) {
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
