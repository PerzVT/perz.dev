# perz.dev — writing voice

The standard every copy block on the site is checked against before it ships. One page. Operational, not an essay.

Two tools back this up: the global Orwell rules in `~/.claude/CLAUDE.md`, and the `humanizer` skill (Wikipedia's "Signs of AI writing"). This doc is the portfolio-specific layer on top.

## Who's talking

First person, as Percy. A game designer who thinks in systems and player experience, technical enough to sit between design and engineering, and who ships. The real LinkedIn recommendations say the same thing in other words: creative plus technical, systems thinking, makes games feel good to play, brings structure to a team.

- Confident, not boastful. State what you did and what happened. Let the fact carry the weight.
- Game-literate, never gamer-swag. No "epic", "insane", "hype", "swag", meme voice.
- Show, don't tell. Replace an adjective with a decision, an artifact, and an outcome. "Tuned combat to stay readable at full speed" beats "amazing combat".
- Product-design background is the foundation under the game work, not the headline.

## Hard rules

- No em dashes in site copy. Use a comma, a period, or "and". (Chat and docs can use them; the site can't.)
- Never invent a fact, number, date, or anything about a real person. Owner gives facts, I word them. If I don't have the fact, the slot stays a marked placeholder.
- Real quotes (recommendations) are trimmed faithfully only. No rewriting someone's words.
- One concrete claim per line.
- Swap test: if a competitor could paste the line onto their own page unchanged, it's too generic. Rewrite or cut.

## The AI-tell blocklist

Kill these on sight. They are the words that make copy read as machine-written.

Significance inflation: testament, showcase, underscore, highlight (verb), pivotal, vital, crucial, stands as, serves as, a rich history, evolving landscape, at its core.

Promo filler: seamless, vibrant, robust, elevate, empower, unlock, cutting-edge, best-in-class, passionate about, proven track record, bring to life, wide range of, deep dive, boasts.

Structure tells: "not just X, but Y" (negative parallelism), forced groups of three, "-ing" tails that fake depth ("...ensuring a smooth experience"), copula avoidance (write "is/are/has", not "serves as/features/offers").

Punctuation tells: em-dash overuse, mechanical boldface, title-case headings, emoji in headings or bullets, curly quotes.

## The pass I run on every block

1. Draft from the owner's facts. Nothing invented.
2. Cut with Orwell: short word over long, cut any word that can go, active over passive.
3. Scan the blocklist, remove every hit.
4. Swap test each line.
5. Read it aloud. If it doesn't sound like a person, redo it.

For anything longer than a few lines (About, case-study prose, résumé summary), run the `humanizer` skill's final audit: "what still reads as AI here?", answer honestly, revise.
