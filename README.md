# Zod Matcher

Rust inspired **pattern matching** for Zod schemas

## Installation

```bash
yarn add zod-matcher
```

```bash
npm install zod-matcher
```

## Basic usage
Example match in Rust

``` rust
let x = 1;

match x {
    1 => println!("one"),
    2 => println!("two"),
    3 => println!("three"),
    _ => println!("anything"),
}
```

Equivalent with zod-matcher

``` typescript
declare const x : number

match(x)
    .case(z.literal(1), () => console.log('one'))
    .case(z.literal(2), () => console.log('two'))
    .case(z.literal(3), () => console.log('three'))
    .default(() => console.log('anything'))
    .parse()
```

## Why use zod-matcher

### Type safety
Unhandled cases won't allow you to parse. You must handle every case or fallback to a default.

``` typescript
const x = 'A' as 'A' | 'B'

// Error "Unhandled cases"
match(x)
    .case(z.literal('A'), console.log)
    .parse()

// Resolve by adding case
match(x)
    .case(z.literal('A'), console.log)
    .case(z.literal('B'), console.log)
    .parse()

// Or by adding default
match(x)
    .case(z.literal('A'), console.log)
    .default(console.log)
    .parse()
```

### Type narrowing
The .default() method passes the input value as an argument typed excluding any previously handled cases.

``` typescript
const x = 'A' as 'A' | 'B' | 'C';

match(x)
  .case(z.literal('A'), console.log)
  .case(z.literal('B'), console.log)
  .default(x => x) // <== Type of x is "C"
  .parse();
```

### Union return
The return type is a union of all the return types of each case.

``` typescript
const x = 'A' as 'A' | 'B' | 'C';

// Type of result is "A1" | "B2" | "C3"
const result = match(x)
  .case(z.literal('A'), x => `${x}1` as const)
  .case(z.literal('B'), x => `${x}2` as const)
  .case(z.literal('C'), x => `${x}3` as const)
  .parse();
```

### No unnecessary cases!
If all possible cases are already accounted for we remove the option to add more.

``` typescript
const x = 'A' as const

const result = match(x)
  .case(z.literal('A'), console.log)
  .case(z.literal('B'), console.log) // <== Error. All cases already handled
  .parse();
```

### Safe parsing
You can throw on failed matches using .parse() or return a result union with .safeParse().

``` typescript
// Throws error if no match
const result = match(x)
    .case(z.string(), console.log)
    .parse()

// Returns result of union type
// | { success: true, data: x }
// | { success: false, error: MatcherError }
const result = match(x)
    .case(z.string(), console.log)
    .safeParse()
```