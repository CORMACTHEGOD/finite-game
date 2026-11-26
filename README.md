# FINITE — Alpha 0.8

A browser-first single-player economic and life simulation game with a permanently fixed worldwide money supply of **$1 billion in fictional currency**.

## Play

Open `index.html` in your browser, or play through [GitHub Pages](https://cormacthegod.github.io/finite-game/). If publishing is not enabled, open repository Settings → Pages → Deploy from a branch → main → / (root) → Save.

## Desktop and internet

- Windows-inspired colorful virtual desktop, taskbar, searchable Start menu, custom SVG icons, fullscreen, seven wallpapers, light/dark themes, four accent colors and two-window split mode (focus one window at a time).
- Redesigned onboarding, finance sidebar, browser shortcuts, maps, cards, forms and responsive layouts. Visual preferences persist with your save. The UI lives in `finite-ui.css` and `finite-ui.js`, with the existing simulation in `index.html`.
- File manager, Code Studio, and installable local Notes, Calculator and Portfolio apps.
- HTML/CSS/JavaScript local sandbox preview; publish HTML/CSS pages within your own game save. Scripts and input controls are excluded from published pages. The code editor supports a limited HTML element set.
- Fictional search, browser tabs/history, real-web search and links opening in the normal browser.
- Finite Market (12 virtual products), Mail (receipts and simulated replies), Bank, Estate, Studio, Social, Ads, Business, Jobs, Atlas and News.
- Player-created websites, messages and social posts are local, not public or multiplayer.

## Economy

- Wallet, savings, company cash, NPC households, government, business sector, reserves and foreign-currency backing accounts preserve exactly $1 billion total.
- Four fictional countries and 80 inspectable map locations; four purchasable properties.
- Developer contracts with real multi-file web projects, designer and entrepreneur contract challenges, daily advancement and income taxes.
- Fictional share purchases and sales, price history, net worth, and a leaderboard with ten simulated households.
- Loans and interest, repayment, bankruptcy, property insurance, four exchangeable currencies (fixed rates), and simulated expansion/recession with changing wages and retail prices.
- Player companies: capital, manufacturing, pricing, simulated customer demand, sales and advertising. NPC stock prices and economic cycles use simple simulation rules, not actual market data.
- Local save migration from earlier versions.

## Developer career (0.7)

- Four rotating offers per in-game day, drawn from six client projects: company website, budget dashboard, product catalog, retail repair, warehouse repair and booking repair.
- New website assignments start with one empty file; add, rename, delete or change languages through the tabbed editor. Existing repair projects retain 743–745 lines of source and three deliberate defects each.
- Developer workspace: detailed briefs, separate source files, line numbers, in-file search, autosaved drafts, previews, active projects and completed-project history.
- Acceptance checks verify HTML structure, CSS requirements, multiple JavaScript inputs/outputs in a dedicated Web Worker, and selected interactions in an isolated browser frame. Worker runs have a three-second timeout. These checks are not a complete design or code-quality review.
- Submissions can be incomplete. A deterministic simulated client reviewer weighs structural checks (35%), JavaScript function results (40%), and live interaction tests (25%). Fully passing work can earn full pay, useful incomplete work can earn reduced pay, and poor or unchanged work is rejected. Payments and taxes preserve the currency ledger.
- Source files: `developer-projects.js`, `finite-developer.js`, and `finite-developer.css`.
- Browser tests are local simulations; they are not a secure anti-cheat service, and external resources are restricted in the previews.

## Developer Studio and reviews (0.8)

- One empty file for new projects, up to 30 individually selectable file tabs, and 27 language modes. HTML/CSS/JavaScript run in browser previews and tests; other languages are editable but do not have compilers or interpreters in this release.
- Partial submissions produce a saved client report with score, pay, failed requirements, and reassignment status. Remaining contract budgets and exact source snapshots carry into inherited repair jobs. Unchanged work earns nothing.
- Eligible inherited jobs are claimable locally; other jobs or expired offers transfer the remaining budget to a simulated NPC. NPC completion is an economic simulation, not an AI-generated corrected code artifact.
- The reviewer is deterministic, not an external LLM. Multiplayer routing, external AI evaluation, and native execution of other languages require future infrastructure.
- Existing drafts migrate to language-aware files. The additional source file is `developer-review.js`.

## Limits

Single-player prototype, not a secure multiplayer ledger. No real money, real investments, cashouts, external site payments or public social posting. No multiplayer, public website hosting, company hiring, rental income, government gameplay or construction yet. Two-window mode focuses one window for editing at a time. Browser-specific features (including the live iframe and fullscreen UI) need a visual browser playtest.

## Source

Public repository with no license currently granted.
