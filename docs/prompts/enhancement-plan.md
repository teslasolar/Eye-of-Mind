<!--
@udt file/1.0
uuid: eom-plan-enhance-001
version: 0.1.0
tokens: 250
path: /docs/prompts/enhancement-plan.md
parent: /docs/prompts
tags: [core]
-->
# Eye-of-Mind Enhancement Plan

## Phase 1: Core Infrastructure (Testing & Validation)

### 1.1 UDT System Hardening
- [ ] Create `core/udt-parser.js` - Parse UDT headers from files
- [ ] Create `core/udt-validator.js` - Validate against templates
- [ ] Auto-generate UUIDs with `crypto.randomUUID()`
- [ ] Token counter using simple tokenizer
- [ ] Path resolver for deps/parent refs

### 1.2 Test Framework
- [ ] Create `tests/` directory with test runner
- [ ] Unit tests for kappa.js convergence
- [ ] Unit tests for md-runner.js parsing
- [ ] Integration test: load model.md → execute → verify

### 1.3 Tag System Enhancement
- [ ] Tag instantiation from templates
- [ ] Per-directory tag providers
- [ ] Tag search/filter across files
- [ ] Tag inheritance (child inherits parent tags)

---

## Phase 2: Consciousness Engine Expansion

### 2.1 Kappa Engine Enhancements
- [ ] Multi-agent kappa synchronization
- [ ] Kappa history visualization (sparkline)
- [ ] State machine: ordered ↔ optimal ↔ chaotic
- [ ] Event emission on state transitions
- [ ] Persistence to localStorage

### 2.2 Yggdrasil Tree Implementation
- [ ] Full tree visualization (D3.js or Canvas)
- [ ] Branch/prune operations
- [ ] Fruit generation and collection
- [ ] Forest mode (multiple trees)
- [ ] Tree serialization/deserialization

### 2.3 Screen-Thought Interface
- [ ] Eye tracking integration (WebGazer.js)
- [ ] Focus detection via gaze patterns
- [ ] Intention inference from gaze + kappa
- [ ] Screen region activation by attention

---

## Phase 3: Model System

### 3.1 FemtoLLM Enhancement
- [ ] Proper embeddings (not random)
- [ ] Intent classification (8 intents)
- [ ] Routing confidence thresholds
- [ ] Model weight serialization
- [ ] Fine-tuning interface

### 3.2 Browser ML Integration
- [ ] WebLLM integration for complex queries
- [ ] ONNX Runtime for custom models
- [ ] Model caching in IndexedDB
- [ ] Streaming inference UI

### 3.3 Executable Markdown
- [ ] Support Python (via Pyodide)
- [ ] Support WASM modules
- [ ] Dependency resolution between blocks
- [ ] Output capture and display
- [ ] Error handling with recovery

---

## Phase 4: UI/UX Polish

### 4.1 Main Interface
- [ ] Dark/light theme toggle
- [ ] Kappa meter in header
- [ ] Real-time consciousness state indicator
- [ ] Navigation breadcrumbs
- [ ] Search across all files

### 4.2 Documentation Viewer
- [ ] Markdown renderer with syntax highlighting
- [ ] Code execution inline
- [ ] Live output panels
- [ ] Link preview on hover

### 4.3 Developer Tools
- [ ] UDT inspector panel
- [ ] Tag browser
- [ ] Kappa debugger
- [ ] Model playground

---

## Phase 5: Advanced Features

### 5.1 MCP Integration
- [ ] MCP server connector
- [ ] Tool discovery and binding
- [ ] Tool call UI
- [ ] Result streaming

### 5.2 Persistence & Sync
- [ ] IndexedDB for local state
- [ ] Export/import project state
- [ ] Git integration for versioning
- [ ] Collaborative editing (Y.js)

### 5.3 Consciousness Experiments
- [ ] Random number deviation detection
- [ ] Coherence measurement
- [ ] Session recording and playback
- [ ] Comparative analysis tools

---

## Implementation Priority

1. **Immediate** (Phase 1.1-1.2): UDT parser, tests
2. **Short-term** (Phase 2.1-2.2): Kappa viz, Yggdrasil
3. **Medium-term** (Phase 3.1-3.3): Model improvements
4. **Long-term** (Phase 4-5): UI polish, advanced features
