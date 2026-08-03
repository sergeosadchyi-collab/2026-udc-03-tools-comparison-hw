# Матриця можливостей AI-інструментів (Task A)

Інструменти, що порівнюються: **GitHub Copilot (плагін для JetBrains IDEA)**,
**JetBrains AI Assistant + Junie**, **Claude Code (CLI)**.

Дані станом на серпень 2026; перевірені на цьому репо
(`2026-udc-03-tools-comparison-hw`, sample-проєкт `app/`). Ціни та ліміти
вендори змінюють часто — перед використанням варто звірити з офіційними
сторінками тарифів.

| Критерій | GitHub Copilot (JetBrains plugin) | JetBrains AI Assistant + Junie | Claude Code (CLI) |
|---|---|---|---|
| Вибір/якість моделі | Перемикач моделей у чаті: GPT-5 / GPT-5 mini, Claude Sonnet 4.5, Gemini 2.5 Pro. Inline-completion — окрема швидка модель, без вибору | Мультимодельний бекенд (Anthropic Claude, OpenAI, Google) + локальні моделі через Ollama/LM Studio для completion; вибір моделі в налаштуваннях AI Assistant | Тільки Anthropic: Claude Opus / Sonnet / Haiku; перемикання `/model`, авто-фолбек на Sonnet при вичерпанні ліміту Opus |
| Агентна автономність та multi-step execution | Agent mode: багатокрокове редагування файлів + запуск термінальних команд з підтвердженням; Ask mode — read-only. Ліміт кроків на ітерацію, вимагає «Continue» | Junie — автономний агент (планує → редагує → запускає тести → показує diff), є Brave mode (без підтвердження команд). AI Assistant chat — переважно однокроковий | Найвища автономність: цикл read→edit→bash→test без нагляду, субагенти (`Task`), hooks, headless-режим `claude -p` для CI |
| Індексація кодової бази | Хмарний семантичний індекс репозиторію + локальний контекст відкритих файлів; звернення через `#codebase` / `@workspace` | Локальний індекс на базі PSI/індексів IDE — розуміє символи, usages, рефакторинги без завантаження коду в хмару | Без persistent-індексу: агент шукає grep/glob/read «на льоту»; сильно залежить від якості `CLAUDE.md` / `AGENTS.md` як карти проєкту |
| Підтримка rules / commands / skills / MCP | `.github/copilot-instructions.md`, `AGENTS.md`, `*.instructions.md`, prompt-файли, custom chat modes; MCP-сервери підтримуються | `.junie/guidelines.md`, підхоплює `AGENTS.md`; MCP підтримується в AI Assistant; кастомні команди обмежені | `CLAUDE.md` + `AGENTS.md`, slash-команди в `.claude/commands/`, Skills (`SKILL.md`), subagents, hooks, MCP (stdio/SSE/HTTP) — найширший набір |
| Ціна та ліміти | Free: ~2 000 completions + 50 chat-запитів/міс. Pro $10/міс, Pro+ $39/міс; premium-запити тарифікуються множниками моделі (Sonnet 4.5 ≈ 1x, топові моделі дорожче) | AI Free (обмежені кредити) / AI Pro ~$10/міс / AI Ultimate ~$30/міс; Junie витрачає ті самі кредити, ліміт скидається щомісяця | Pro $20/міс (переважно Sonnet), Max $100/$200 — 5-годинні rolling-вікна + тижневий ліміт; або pay-as-you-go API (Sonnet ~$3/$15 за 1M in/out токенів) |
| Enterprise-функції (SSO/SOC2/data residency) | Business $19/user, Enterprise $39/user: SAML SSO, org-політики, audit log, content exclusion, SOC 2 Type II; data residency через GitHub Enterprise Cloud (EU/AU) | JetBrains AI Enterprise: SSO, on-prem/VPC-деплой AI-сервісу, SOC 2 Type II; резиденція даних залежить від обраного провайдера моделі | Claude for Work / Enterprise: SSO + SCIM, audit-логи, SOC 2 Type II, ISO 27001; через Amazon Bedrock / Google Vertex дані лишаються у вашому cloud-регіоні |
| Приватність / політика навчання на даних | Business/Enterprise: код не використовується для навчання за замовчуванням; для Individual — opt-out у налаштуваннях. Є фільтр збігів з публічним кодом | JetBrains заявляє відсутність навчання на коді користувача; за детачем — політика провайдера моделі. Локальні моделі = код не покидає машину | Commercial API / Claude Code не використовуються для навчання за замовчуванням; consumer-плани — opt-out; Bedrock/Vertex взагалі не проходять через інфраструктуру Anthropic |

## Висновок

Найбільша відмінність для нашого кейсу — **автономність vs контроль**: Claude Code
проходить цикл «прочитав → змінив → запустив `npm test`» без нагляду й тому найшвидше
закриває такий тікет, як баг у `truncate()` (`materials/task-bug-fix.md`), тоді як
Copilot в Agent mode вимагає підтверджень майже на кожному кроці, а Junie — щось
посередині (diff-review перед застосуванням).

Друга суттєва відмінність — **індексація**: JetBrains виграє на задачах «де це
використовується / перейменуй символ» завдяки локальному PSI-індексу, Copilot — на
пошуку по великому репо через хмарний семантичний індекс, а Claude Code компенсує
відсутність індексу якісним `AGENTS.md` (що робить Task C особливо цінним саме для нього).

За передбачуваністю вартості Copilot Pro ($10) — найдешевший вхід, Claude Max —
найдорожчий, але єдиний, хто дає повноцінний headless-режим для CI. Для команди з
NDA-обмеженнями вирішальним стає рядок privacy: JetBrains з локальними моделями та
Claude через Bedrock/Vertex — єдині варіанти, де код гарантовано не залишає периметр.

