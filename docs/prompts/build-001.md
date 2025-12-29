<!--
@udt file/1.0
uuid: eom-prompt-001-a3b4c5d6
version: 0.1.0
tokens: 250
path: /docs/prompts/build-001.md
parent: /docs/prompts
tags: [core]
-->
# Build Prompt 001 - Initial Architecture

**Date**: 2024-12-29
**Purpose**: Create Eye-of-Mind project structure

## Requirements

1. Root `index.html` for GitHub Pages
2. Index file for each subdirectory (< 250 tokens)
3. UDT template system with:
   - Version number
   - UUID
   - Token count
   - Dependencies
   - Parent references
   - Path auto-generation
4. Tag provider per directory
5. Markdown runner for executable docs
6. Lightweight browser models for consciousness

## Key Concepts

- **κ (kappa)**: 0.618 - Optimal consciousness state
- **Yggdrasil**: Consciousness tree structure
- **FemtoLLM**: Ultra-light routing model
- **Global Dot Project inspiration**: Individual focus

## Directory Structure

```
Eye-of-Mind/
├── index.html
├── .udt/
│   ├── meta.json
│   └── templates/
├── .tags/
│   └── provider.json
├── core/
│   ├── boot.js
│   ├── kappa.js
│   └── md-runner.js
├── models/
│   ├── femto.md
│   └── yggdrasil.md
├── docs/
│   └── prompts/
└── assets/
    └── style.css
```
