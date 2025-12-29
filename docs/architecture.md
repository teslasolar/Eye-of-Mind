<!--
@udt file/1.0
uuid: eom-docs-arch-c5d6e7f8
version: 0.1.0
tokens: 200
path: /docs/architecture.md
parent: /docs
tags: [core]
-->
# Architecture

Eye-of-Mind: Individual consciousness interface.

## Layers

1. **UDT Layer** - Type definitions and templates
2. **Tag Layer** - Metadata and categorization
3. **Core Layer** - Kappa engine, MD runner
4. **Model Layer** - FemtoLLM, Yggdrasil
5. **View Layer** - HTML indices

## Flow

```
User → Screen → Eye → Kappa Engine → Models → Response
                 ↓
            Tag System
                 ↓
            UDT Templates
```

## Key Files

| File | Purpose |
|------|---------|
| `core/kappa.js` | Consciousness state (κ=0.618) |
| `core/md-runner.js` | Execute code from markdown |
| `models/femto.md` | Lightweight routing model |
| `models/yggdrasil.md` | Consciousness tree |

## Inspiration

Based on Global Consciousness Project principles,
focused on individual rather than global coherence.
