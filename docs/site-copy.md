# perz.dev — Site copy (for refinement)

Every user-facing string on the site, grouped by page. **Edit the values in place and hand this back** — each block notes the source file, so I can wire your changes straight in. Structure/layout stays as-is; this is words only.

**Legend**
- `[verbatim]` — carried word-for-word from your v2 comps / handoff. Confirm or change.
- `[seeded]` — drafted inside your design comp (may be AI-drafted there). **Most worth a pass.**
- `[placeholder]` — you supply; currently a blank/skeleton on the page.
- `[label]` — functional UI microcopy; change only if you care to.

---

## 1. Global — SEO & chrome

**Browser tab / SEO title** `[label]` — `→ src/app/layout.tsx` (built from name + role)
> Perz · Building Fun Experiences

**Meta description (search + social cards)** `[verbatim]` — `→ src/lib/config.ts: positioning`
> I'm a Game Designer specialized in user experience, with professional experience building PC and VR games. I love designing intuitive mechanics and engaging systems that create fun and memorable experiences.

**Nav** `→ src/components/site/site-nav.tsx` + `src/lib/config.ts`
- Wordmark: `perz`
- Role tag beside it: `Creative Designer`
- Links: `Work` · `Résumé` · `Contact`

**Footer** `→ src/components/site/site-footer.tsx`
- `Open to work.`
- Email shown: `hello@perz.dev`
- Social link labels: `GitHub` · `Discord` · `LinkedIn` · `itch.io` · `CurseForge`
- Copyright: `© Kerberus 2026. `
- Credit: `All rights reserved ✦ made with ❤️`

**Floating button labels** `[label]` `→ src/components/site/site-fab.tsx`
- `Unmute` / `Mute` · `Light theme` / `Dark theme`

---

## 2. Home page (`/`)

### Hero `→ src/components/home/hero.tsx` (+ config `positioning`)
**Bio line** `[verbatim]` — same as the meta description above:
> I'm a Game Designer specialized in user experience, with professional experience building PC and VR games. I love designing intuitive mechanics and engaging systems that create fun and memorable experiences.

**Buttons:** `Selected work ↓` · `Résumé`

### Selected work `→ src/components/home/selected-work.tsx`
- Heading: `Selected work`
- Link: `All work →`
- (The six cards themselves are in §4.)

### About me `→ src/components/home/about.tsx` (+ config `about`)
**Heading:** `About me`
**Paragraph** `[verbatim]`:
> Hi, I'm Percy, a game designer and developer based out of Calgary. I have been making games and gaming content since I was 15, I started out creating custom assets and mods for roblox, unturned and minecraft. I started out in computer science and got a bachelors in Media, Graphics and Animation where I created my first game as well as got my formal product designer training. I founded Draconia and Kerberus which are gaming networks which have serviced to over 400 thousand players over the past 5 years. I am the creator of Mythcraft (Play as Demigods), Dragoncraft (Play as Dragons) and Kerberus Network. 

**Heading:** `My Design Philosophy`
**Paragraph** `[verbatim]`:
> My design philosphy is shaped due to my background and process. My user experience and product design training helps me design with the end users experience in mind while my technical proficiency helps me improve cooperation between technical and design teams. I believe in leading the vision through design, improving communication and finding fun through simplicity. I focus on creating clear, straightforward designs that keep players engaged through strong core systems and well-structured data. I enjoy breaking down complex ideas into clean, functional experiences, always aiming for clarity in both the gameplay and the creative process.

**Photo:** `[placeholder]` — percy.jpg in D:\Git\perz.dev\public

### Experience `→ src/components/home/experience.tsx` (data: content/work/*.json)
**Heading:** `Experience` — rows are pulled from your work history (role · company · dates), newest first. Edit those in §7 if the wording's off. Tags shown: `Current`, `Contract`. <- remove contract.

### Recommendations `[placeholder]` `→ src/components/home/recommendations.tsx`
**Heading:** `Recommendations` · subtitle currently `quotes land here — owner supplies` pull from here? https://www.linkedin.com/in/perz/details/recommendations/?detailScreenTabIndex=0 
Three empty cards. **Supply up to 3**, each:
1. Quote: `…` — Name: `…` — Role/company: `…`
2. Quote: `…` — Name: `…` — Role/company: `…`
3. Quote: `…` — Name: `…` — Role/company: `…`
Arron Ferguson 

· 1st

Lead Writer & Narrative Designer at PhilosopherKing

October 6, 2025, Arron worked with Percy on the same team

All LinkedIn members

On

Percy is a fantastic Game Designer, as well as a true savant of UI/UX design. Deeply passionate, knowledgeable, hardworking, and collaborative, it was a joy to work with him and build games and content together. Incredibly proactive, he would often jump into my DMs with solutions to problems I didn't even know existed yet. As a Writer and Narrative Designer, that's the dream Game Designer to have in your corner! Always fighting to not just surpass expectations, but to aid you in doing the same, I highly recommend Percy for any Game Design role.


Guilherme Martins 

· 1st

Technical Level Designer | Hotspot Designer I Level and World Scripting I Environmental Storytelling

September 25, 2025, Guilherme worked with Percy on the same team

All LinkedIn members

On

I had the pleasure of working with Shadab "Percy" Ali on multiple projects, and I can confidently say he is one of the most talented young professionals I’ve had the privilege to collaborate with.
Beyond his skillset, what makes Percy truly exceptional is his positive attitude and the energy he brings to the team. He encourages collaboration, lifts others up, and takes initiative even when faced with ambiguity. Despite being early in his career, he has already shown great potential and a professional maturity well beyond his years.
I believe Percy has a bright future ahead. He is someone who will continue to grow, impact teams positively, and achieve great things. Any team would be lucky to have him, and I look forward to seeing where his career takes him.


Emma Gallaher

· 1st

Game Designer

September 11, 2025, Emma was senior to Percy but didn’t manage Percy directly

All LinkedIn members

On

Working with Percy as a fellow designer was an absolute highlight! He’s a creative powerhouse with an incredible work ethic. His passion for projects is contagious, and it constantly pushed me to raise my own game. Percy has the awesome ability to balance creative vision with systems thinking, which makes him an outstanding general designer. His engine experience was invaluable for bringing our ideas to life in-game, and he was always eager to take on more challenges. It was always a joy to get to work with Percy!


David Slauenwhite

· 1st

Indie GameDev, Producer, Designer, Variety Streamer, Writer, Content Creator, Voice Actor and Marketing Goblin.

September 9, 2025, David was senior to Percy but didn’t manage Percy directly

All LinkedIn members

On

There is a lot of things I could say about Shadab, all of them good! He's been a pleasure to work with, bringing both solid insights into game design, UI/UX development, and more. While he's really still in the early stages of his career in game design and development he shows a great deal of promise and I look forward to seeing what he achieves. He 's hard-working, consistent, and completes tasks in a timely manner, and as the producer tracking the projects he was involved in, he delivered at or above expectations every time. 

He was a great team player who supported his co-workers through discussion and consideration for their view points, and I highly recommend him for your projects needs as he would be a valuable asset with a lot more room to grow and achieve great things!


Matt Fleming

· 1st

Lead Game Designer, Writer, Helpful Guy

September 4, 2025, Matt managed Percy directly

All LinkedIn members

On

Percy was there when I started, as a game designer who was going to school and had some experience tangential to the games industry, as well as worked on some personal stuff.

By the time he was no longer under my wing, he had developed into an amazing multifunctional designer who could do just about anything I threw at him. Anything systems, he could take a serious whack at and it'd come back not only done and polished, but with a list of potential hurdles and how he thought they'd be best tackled. He has that amazing mixture of creative and technical, which means he is going to go very, very far as a designer.

If you need someone who can get full boots-on-the-ground and get features done for a game, I can't recommend him enough, and I'd love to have him on a team with me again.


Joaquin Soriano 

· 1st

Engineer @ Wand | Reverse Engineering

June 10, 2025, Joaquin worked with Percy on the same team

All LinkedIn members

On

I had the chance to work closely with Shadab on multiple game projects, and he was easily one of the most versatile and dependable people I’ve worked with. He handled everything from game design and UX/UI to project coordination and even some programming support.

Shadab naturally stepped into a leadership role and often went above and beyond to keep things running smoothly. He filled in the gaps wherever needed and consistently brought structure, creative direction, and momentum to the team. His attention to user experience and design was especially impressive. He has a great sense of what makes a game feel good to play.

Above all, he’s someone who genuinely cares about the quality of the work and always shows up with a positive attitude. Working with him was always a smooth and enjoyable experience.

I’d happily work with Shadab again and highly recommend him to any team looking for a talented and reliable game designer or UX/UI designer.


Renèe Camillo Pollet 

· 1st

Game Designer and Developer

March 19, 2024, Renèe worked with Percy on the same team

All LinkedIn members

On

I have had the pleasure of working alongside Shadab and I can confidently say that he is one of the most talented UI designers and game developers I've encountered. His passion for his work is evident in every project he tackles, showing a proactiveness that is rarely seen. 

Shadab is not just proficient in UI design; he is constantly seeking out new challenges and opportunities to expand his skill set and has great ability in all facets of game development. His eagerness to learn and willingness to try new things set him apart in the field.

What truly impresses me about Shadab is his ambition. He is not content with simply meeting expectations; he strives to exceed them. His dedication to his work and drive to succeed are truly inspiring.

I do not doubt that Shadab has a bright future ahead of him in the world of Game Development and UI Design. His talent, coupled with his ambition and willingness to learn, make him a valuable asset to our team. I highly recommend Shadab and am confident that he will continue to achieve great things in his career.


Daril Camilo 

· 1st

Specialist in Sales, Customer Success and Leadership / Polymath / Investment Funds In Canada / Game Developer

March 19, 2024, Daril worked with Percy on the same team

All LinkedIn members

On

It is very good to come here to give a recommendation about my friend Shadab. He helped me a lot on the begin of our program and since that time he kept improving his skills and understand about game development.

Shadab is one of this guys that discover too early his own talents, this gave him time and direction to run to the correct way and become an amazing talent so young.

He has incredible skills in many game development specialties like programming, UI, 3D modelling and game design.

I can say that he was and keep being the best reference our class have of a multi specialized game development professional.

It is important to say he is an amazing person and have amazing soft skills, being capable to do great in a team work or lead teams.

### Contact `→ src/components/home/contact.tsx`
- Heading: `Let's talk.`
- Intro `[verbatim]`: `Looking for help with your next project?`
- Email: `hello@perz.dev`
- Note: `Direct email works too, no form required.`

**Contact form** `[label]` `→ src/components/home/contact-form.tsx`
- Field labels: `Name` · `Email` · `Message`
- Placeholders: `Your name` · `you@studio.com` · `The team, the problem, the timeline…`
- Errors: `Add your name.` · `That email doesn't look right.` · `A sentence or two helps me reply well.` · `Fix the fields above.`
- Button: `Send message` (→ `Sending…`)
- Success: `Message sent.` / `Thanks, expect a reply soon.` / `Send another`

---

## 3. My work page (`/projects`) `→ src/app/projects/page.tsx`
- Heading: `My work`
- Intro `[verbatim]`: `My latest adventure has been working with the talented team at Highstreet. I still make modded content on the side and enter game-jams to keep things exciting!`
- (Cards = §4, all 8.)

---

## 4. Project cards + quick-view `[seeded]` `→ content/work-cards.json`

Each card shows: **title · tagline · first 2 contributions · "Read more →"**. The quick-view sheet adds: **meta label · blurb · all contributions · (case-study link)**. All of the below was drafted in your comp — **this is the section most worth your voice.**

### Add 1. Highstreet: Echoes of Solera
- Tagline: `Narrative Animation for Highstreet's IP.`
- Meta label: `Short form Animation Series`
- Blurb: `Fleshing out the narrative world behind the IP and distributing it via narrative and choose your own adventure experiences.`


### 2. Highstreet: Calamity VR
- Tagline: `Multiplayer roguelike VR for Meta Quest.`
- Meta label: `Multiplayer VR roguelike · Meta Quest`
- Blurb: `A VR Multiplayer Co-op Rogue-like game set inside an arena where players have to battle enemies on waves equipped with gesture based magic abilities.`

### 3. Kerberus: Pack Manager
- Tagline: ``
- Meta label: `
- Blurb: ``

### 2. Supercat
- Tagline: `Mecha-cat action platformer for PC.`
- Meta label: `Action platformer · PC`
- Blurb: `Mecha-cat action platformer. Combat and movement tuned to stay readable at full speed.`
- Contributions: `Combat & movement tuning` · `Level design` · `Game-feel pass`

### 3. Bubble Buddy
- Tagline: `"You are the weapon" — one loop for ammo, health and movement.`
- Meta label: `GGJ 2025 · jam build`
- Blurb: `"You are the weapon" — the bubble you ride is also your ammo, health and movement. One resource, one loop, one weekend.`
- Contributions: `Core resource loop` · `Rapid prototyping`

### 4. Lurk
- Tagline: `First-person horror — dread you hear before you see.`
- Meta label: `First-person horror · PC`
- Blurb: `First-person horror built around dread you can hear before you see it.`
- Contributions: `Tension pacing` · `Sound-driven threat design`

### 5. Poly Punch VR
- Tagline: `Rhythm combat for hand-tracking — no controllers.`
- Meta label: `VR rhythm combat · hand-tracking`
- Blurb: `Rhythm and gesture combat built around hand-tracking limits — every move readable from wrist position alone.`
- Contributions: `Gesture vocabulary design` · `Combat readability without controllers`

### 6. Stick It
- Tagline: `2D stealth-action, shipped from one seat.`
- Meta label: `2D stealth-action`
- Blurb: `2D stealth-action shipped from one seat — project management, game design and UI.`
- Contributions: `Project management` · `Game design + UI`

### 7. BisectHosting
- Tagline: `Product and brand design for a game-server host.`
- Meta label: `Product & brand design`
- Blurb: `Product and brand design for a game-server host — the product-design foundation under the game work.`
- Contributions: `Product design` · `Brand system` · `Marketing design`

### 8. Bero Character Design
- Tagline: `Character illustration and design exploration.`
- Meta label: `Character design · media`
- Blurb: `Character illustration and design exploration.`
- Contributions: `Character design` · `Illustration`

**Card micro-labels** `[label]`: `Read more →` · `Contributions` · `Full case study →` (Highstreet + the rest now all link).

---

## 5. Résumé (`/resume`) `→ src/app/resume/page.tsx`

- Heading: `Résumé`
- Name: `Perz` + `[placeholder]` `full name — owner supplies` (I kept your legal/full name blank — fill it or say "use Percy A")
- Role line `[verbatim]`: `Game designer — UX & player-focused systems`
- `Download PDF` button + `[placeholder]` `PDF — owner supplies` (drop a PDF in and I'll link it)
- Summary `[verbatim]`: same as the About paragraph (§2). Say if you want a different one here.
- Credibility line `[verbatim]`: `Six shipped titles across PC and VR · Founded Draconia — a 400,000+ player gaming service · Kerberus, independent studio`
- Section headings: `Experience` · `Education` · `Skills`

**Experience blurbs** `[placeholder]` — one line under each role (currently blank bars). Starting points from your work history (§7) — refine or replace:
- Highstreet: `…`
- Smooth Brain Games: `…`
- Knite Studios: `…`
- BisectHosting: `…`
- Sennovate: `…`
- Whiteboard Studios: `…`

**Education** `[placeholder]` — 2 blank rows. Supply: `date — degree · school` (×2, or however many).

**Skills bars** `[seeded]` — levels are illustrative; **tune the numbers (0–100)**:
- Game design `92`
- Product design & UX `86`
- Unity + C# `80`
- Unreal Engine `62`
- Prototyping & playtesting `88`

**Secondary tools line** `→ content/skills.json`: `Photoshop · Illustrator · Blender · Godot · Notion · Miro · Jira · Python · TypeScript`
Note shown: `Bar levels illustrative — owner tunes`

**Footer links:** `perz.dev` · `hello@perz.dev` · `GitHub` · `LinkedIn`

---

## 6. Case studies (`/projects/[slug]`)

Each case study's **title + one-line description + meta line** (below) are refinable here. The **full write-up** (Context / Problem / Approach / Solution / Impact prose, plus the images) lives in `content/projects/<slug>.mdx` — those are your original words. A flat copy here would strip the media and section structure, so they're best edited in the `.mdx` directly, or **tell me the changes and I'll make them**. Say the word if you'd rather I dump the full prose into this doc anyway.

**One-line descriptions** (shown under the case-study title):
- **Highstreet: Calamity VR** — `A multiplayer roguelike VR game. Fight through waves of enemies toward boss encounters, earn rewards, and progress alongside friends.`
- **Supercat** — `A fast-paced action platformer where you play as a mecha cat. Wall-run, pounce, and chain combat with parkour in a kit built to reward mastery.`
- **Bubble Buddy** — `A 2D action game made in 32 hours for Global Game Jam 2025. You are the weapon, shooting parts of yourself to survive while juggling a size/speed/health trade-off.`
- **Lurk** — `A single-player first-person horror game set in an inherited 1800s house. Explore, solve puzzles, and uncover the house's dark history.`
- **Poly Punch VR** — `A VR rhythm game built on an experimental Meta hand-tracking kit, extending a Beat-Saber-like prototype into a full combat-gesture design space.`
- **Stick It** — `A 2D stealth-action game made in seven days with a four-person team at Knite Studios. Play as Pedro, a farmer fighting back against a corrupt agri-corp.`
- **BisectHosting** — `Designer at BisectHosting.` ← thin; probably worth expanding.

**NDA note** (Highstreet only, `[verbatim]`): `Some numbers redacted under NDA — walked through live in interviews.`
**Bottom links** `[label]`: `← All work` · `Want the full walkthrough? Get in touch →`

---

## 7. Work history (feeds Experience + Résumé) `→ content/work/*.json`

Role · Company · Dates — and the description that can seed the résumé blurbs:
- **Game Designer · Highstreet** · Dec 2023 — Present — `Part of the core design team on Calamity VR — a multiplayer rogue-like arena battler.`
- **Game Designer · Smooth Brain Games** · Oct 2023 — Apr 2025 — `Continued design work after Knite Studios renamed to Smooth Brain Games — indie titles and jam entries.`
- **Game Designer · Knite Studios** · Sep 2022 — Sep 2023 — `Design on early studio titles before the rename to Smooth Brain Games.`
- **Graphic Designer · BisectHosting** · Apr 2022 — Dec 2023 — `Made media content for CurseForge projects, company branding, and social media programs. Collaborated on projects ultimately used on Twitch, GamersOutreach, Project Hope, and Tiltify.`
- **Graphic Designer · Sennovate** · Jan 2022 — Mar 2022 — `Campaign and product design for a B2B security platform.`
- **Senior Graphic Designer · White-board Studios** · Jan 2020 — Jan 2021 — `Led branding and motion design campaigns for mid-market and enterprise clients — mostly colleges, universities, and companies.`

*(Note: "White-board Studios" is spelled with a hyphen in the data — fix here if that's wrong.)*

---

### When you're done
Hand this back with your edits (or just the sections you changed) and I'll wire every value into the right file and push to staging. Anything you leave as `[placeholder]`, I'll leave as a skeleton until you fill it.
