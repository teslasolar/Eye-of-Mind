/*
@udt file/1.0
uuid: eom-models-femtojs-001
version: 0.1.0
tokens: 250
path: /models/femto.js
parent: /models
deps: []
tags: [model, core]
*/

// FemtoLLM - Ultra-lightweight routing and intent classification
export class FemtoLLM {
  constructor(dim = 32) {
    this.dim = dim;
    this.vocabSize = 256;
    this.routes = ['simple', 'complex', 'tool', 'search', 'code', 'chat'];
    this.intents = ['question', 'command', 'statement', 'greeting', 'clarify', 'confirm', 'reject', 'other'];
    this.initWeights();
    this.stats = { calls: 0, tokens: 0 };
  }

  initWeights() {
    // Embeddings: byte -> dim vector
    this.E = this.rand(this.vocabSize, this.dim);
    // Route classifier
    this.Wr = this.rand(this.dim, this.routes.length);
    // Intent classifier
    this.Wi = this.rand(this.dim, this.intents.length);
  }

  rand(rows, cols) {
    return Array(rows).fill(0).map(() =>
      Array(cols).fill(0).map(() => (Math.random() - 0.5) * 0.1)
    );
  }

  tokenize(text) {
    return text.split('').map(c => c.charCodeAt(0) % this.vocabSize);
  }

  embed(tokens) {
    const v = new Array(this.dim).fill(0);
    for (const t of tokens) {
      for (let i = 0; i < this.dim; i++) v[i] += this.E[t][i];
    }
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
    return v.map(x => x / norm);
  }

  softmax(arr) {
    const max = Math.max(...arr);
    const exp = arr.map(x => Math.exp(x - max));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(x => x / sum);
  }

  matmul(vec, mat) {
    return mat[0].map((_, j) => vec.reduce((s, v, i) => s + v * mat[i][j], 0));
  }

  applyHeuristics(text, routeProbs, intentProbs) {
    const lower = text.toLowerCase();
    const result = { route: null, intent: null };

    // Route heuristics
    if (/\b(search|find|look for|where)\b/.test(lower)) result.route = 'search';
    else if (/\b(run|execute|code|script|function)\b/.test(lower)) result.route = 'code';
    else if (/\b(tool|use|call|invoke)\b/.test(lower)) result.route = 'tool';
    else if (text.length > 100) result.route = 'complex';

    // Intent heuristics
    if (/^(hi|hello|hey|greetings)/i.test(text)) result.intent = 'greeting';
    else if (/\?$/.test(text.trim())) result.intent = 'question';
    else if (/^(yes|no|ok|sure|nope)/i.test(text)) result.intent = lower.includes('no') ? 'reject' : 'confirm';

    return result;
  }

  classify(text) {
    const start = performance.now();
    const tokens = this.tokenize(text);
    const emb = this.embed(tokens);

    const routeScores = this.softmax(this.matmul(emb, this.Wr));
    const intentScores = this.softmax(this.matmul(emb, this.Wi));

    const heuristics = this.applyHeuristics(text, routeScores, intentScores);

    const routeIdx = heuristics.route ? this.routes.indexOf(heuristics.route) : routeScores.indexOf(Math.max(...routeScores));
    const intentIdx = heuristics.intent ? this.intents.indexOf(heuristics.intent) : intentScores.indexOf(Math.max(...intentScores));

    this.stats.calls++;
    this.stats.tokens += tokens.length;

    return {
      route: this.routes[routeIdx],
      routeConf: routeScores[routeIdx],
      intent: this.intents[intentIdx],
      intentConf: intentScores[intentIdx],
      tokens: tokens.length,
      latency: performance.now() - start,
      heuristic: !!heuristics.route || !!heuristics.intent
    };
  }
}

export default FemtoLLM;
