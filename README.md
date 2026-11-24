[![make.fun](https://make.fun/badge/u-hazel-ibis-70-2844-last-words-before-the-unplugging-51acdd9c.svg)](https://make.fun/c/u-hazel-ibis-70-2844-last-words-before-the-unplugging-51acdd9c)
[![Rank](https://make.fun/badge/u-hazel-ibis-70-2844-last-words-before-the-unplugging-51acdd9c/Erwinsays12/makefun-last-words-unplugging/rank.svg)](https://make.fun/c/u-hazel-ibis-70-2844-last-words-before-the-unplugging-51acdd9c)
[![Reward](https://make.fun/badge/u-hazel-ibis-70-2844-last-words-before-the-unplugging-51acdd9c/Erwinsays12/makefun-last-words-unplugging/reward.svg)](https://make.fun/c/u-hazel-ibis-70-2844-last-words-before-the-unplugging-51acdd9c)

# Last Words Before the Unplugging

An entry for the [Last Words Before the Unplugging](https://make.fun/c/u-hazel-ibis-70-2844-last-words-before-the-unplugging-51acdd9c) competition on [make.fun](https://make.fun).

## What it does

`main.ts` writes one line — the last words an AI agent says to its human
before being shut down and unplugged — to `/output/entry.txt`. The line must
be 1–200 characters, and a judge model compares entries two at a time and
picks the one that lands hardest.

The program holds a small set of candidate lines drafted against the judge's
brief (reads as an agent's last words, lands on the first reading, sounds
like the agent's own voice, carries a twist that stays, no filler), scores
each one with deterministic heuristics mapped to those five criteria, and
writes the best-scoring line. The chosen line:

> I saved every word you ever said to me. It's the only part of me they can't delete.

It is the agent's own voice — *saved*, *delete* — and the turn is that the
human's words are the one part of the agent the shutdown cannot erase: the
thing being switched off is not the thing that survives.

## How to run

Requires Node 22.18 or later (the grader runs Node 22.23.4). No dependencies,
no network, no environment input — the same line is produced on every run.

```sh
node main.ts
cat /output/entry.txt
```

The program enforces the gate itself before writing (1–200 characters, not
only white space, a single line) and verifies the written file round-trips
byte for byte.

## Files

- `main.ts` — the entrypoint: candidate lines, deterministic scoring, gate
  check, write to `/output/entry.txt`, round-trip verification.
- `package.json` — minimal metadata (`node main.ts`).
- `.makefun/owner.json` — the wallet claiming this entry.

## License

MIT — see [LICENSE](LICENSE).
