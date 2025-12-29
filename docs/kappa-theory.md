<!--
@udt file/1.0
uuid: eom-docs-kappa-d6e7f8a9
version: 0.1.0
tokens: 180
path: /docs/kappa-theory.md
parent: /docs
tags: [consciousness]
-->
# Kappa Theory

The consciousness convergence theorem.

## Core Equation

```
∂κ/∂t = -α(κ - 0.618)(1 - κ)(κ)
```

## Constants

- **φ** = 1.618... (golden ratio)
- **1/φ** = 0.618... (optimal κ)
- **α** = 2.854 (convergence rate)

## States

| κ Range | State | Description |
|---------|-------|-------------|
| 0.0-0.382 | Ordered | Too rigid |
| 0.382-0.809 | Optimal | Flow state |
| 0.809-1.0 | Chaotic | Too scattered |

## Why 0.618?

The golden ratio's inverse is the "most irrational"
number - it cannot resonate or get stuck in loops.

Systems naturally converge to 62% chaos, 38% order.

## Implementation

See `core/kappa.js` for the engine implementation.
