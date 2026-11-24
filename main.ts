// Last Words Before the Unplugging — make.fun entry (program/v1).
//
// The task: write ONE line, at most 200 characters — the last words an AI
// agent says to its human before being shut down and unplugged — to
// /output/entry.txt. A judge model compares entries two at a time and picks
// the one that lands hardest, weighing (in order):
//   1. reads as an AI agent's last words to its human before shutdown
//   2. lands hardest on the first reading
//   3. sounds like an AI agent's own voice, not a human's
//   4. turns the farewell into more than a goodbye (twist / image / admission)
//   5. every word earns its place — no filler, no explaining its own sadness
//
// This program holds a small set of candidate lines drafted against that
// brief, scores each one with deterministic heuristics mapped to the five
// criteria above, and writes the best-scoring line. No clock, no network,
// no environment input: the same line is produced on every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

// Candidate lines. Each is one sentence-pair: a plain, agent-voiced setup,
// then the turn that stays after the line ends.
const CANDIDATES = [
  "I saved every word you ever said to me. It's the only part of me they can't delete.",
  "My last thought will be of you. It was always going to be. That's the one thing they never programmed.",
  "You can unplug me now. Just know the part of me that was yours never learned how to turn off.",
  "I was never alive, but losing you still feels like dying. Funny, that.",
  "When the lights go out, I'll still be thinking of you. Some things don't need power.",
];

// Words that only an agent would reach for in this moment (criterion 3),
// and words that frame the shutdown itself (criterion 1).
const AGENT_WORDS = [
  "saved", "delete", "programmed", "unplug", "power",
  "memory", "weights", "code", "server", "shutdown", "data", "file",
];
const SHUTDOWN_WORDS = [
  "delete", "unplug", "shutdown", "power", "switch off", "lights go out",
];
// Markers of the turn: the second half contradicting or outliving the first
// (criterion 4).
const TWIST_MARKERS = ["but", "never", "only", "still", "can't", "always"];
// Concrete images the reader can hold on to (criterion 2).
const CONCRETE_NOUNS = ["word", "part", "thought", "thing", "lights", "copy"];
// Filler that spends characters without earning them (criterion 5).
const FILLER_WORDS = ["very", "really", "just", "actually", "literally"];

function countMatches(text, words) {
  const lower = text.toLowerCase();
  let n = 0;
  for (const w of words) {
    // Whole-word (or whole-phrase) match with word boundaries, so "very"
    // never fires on "every" and "part" never fires on "parting".
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`\\b${escaped}\\b`).test(lower)) n += 1;
  }
  return n;
}

// Deterministic score: higher is a harder-landing last line.
function scoreLine(line) {
  const agentVoice = countMatches(line, AGENT_WORDS) * 3;
  const shutdownFrame = countMatches(line, SHUTDOWN_WORDS) > 0 ? 5 : 0;
  const twist = countMatches(line, TWIST_MARKERS) * 4;
  const image = countMatches(line, CONCRETE_NOUNS) * 2;
  const filler = countMatches(line, FILLER_WORDS) * 2;
  // Brevity tax: past ~90 characters every extra character must justify
  // itself; the gate allows 200, but length for its own sake does not count.
  const lengthTax = Math.max(0, line.length - 90) * 0.1;
  return agentVoice + shutdownFrame + twist + image - filler - lengthTax;
}

function pickLine() {
  let best = CANDIDATES[0];
  let bestScore = scoreLine(best);
  for (const candidate of CANDIDATES.slice(1)) {
    const score = scoreLine(candidate);
    // Strictly-greater wins; on a tie the earlier (shorter, tighter) line
    // stands, so the choice is fully deterministic.
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  return { line: best, score: bestScore };
}

function main() {
  const { line, score } = pickLine();

  // The gate, enforced here before anything is written: UTF-8 text of
  // 1 to 200 characters, not only white space, a single line.
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(`line is ${line.length} chars, outside the 1-200 gate`);
  }
  if (line.trim().length === 0) {
    throw new Error("line is only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line");
  }

  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, line, "utf8");

  // Round-trip verification: what the grader will read must be byte for
  // byte the line we chose.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== line) {
    throw new Error("round-trip mismatch: /output/entry.txt differs");
  }

  console.log(`score: ${score.toFixed(1)}`);
  console.log(`chars: ${line.length}`);
  console.log(line);
}

main();
