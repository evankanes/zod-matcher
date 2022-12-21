# Zod Matcher

Rust inspired **pattern matching** for Zod schemas

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
const x = 1 as const

match(x)
    .case(z.literal(1), () => console.log('one'))
    .case(z.literal(2), () => console.log('two'))
    .case(z.literal(3), () => console.log('three'))
    .default(() => console.log('anything'))
    .parse()
```

## Features

### Type safety
Unhandled cases won't allow you to parse. You must handle every case or fallback to a default.

``` typescript
const x = 'x' as 'x' | 'y'

// Type error "Unhandled cases"
match(x)
    .case(z.literal('x'), console.log)
    .parse()

// Handle every case
match(x)
    .case(z.literal('x'), console.log)
    .case(z.literal('y'), console.log)
    .parse()

// Default for fallback
match(x)
    .case(z.literal('x'), console.log)
    .default(console.log)
    .parse()
```

### Safe parsing
You can throw on fail matches using .parse() or return a result union with .safeParse().

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