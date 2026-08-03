# AGENTS.md — `app/`

Baseline context for **any** AI coding agent working in this folder
(Copilot, Junie / JetBrains AI, Claude Code, Cursor, Codex CLI, Aider — the
file is tool-agnostic on purpose). Repo-level context lives in
[`../AGENTS.md`](../AGENTS.md); this file covers the `app/` sample only.

## Стек

- TypeScript 5.6, `strict: true` + `noUncheckedIndexedAccess: true`
- ESM (`"type": "module"`, `module: ESNext`, `moduleResolution: Bundler`,
  target ES2022)
- Vitest 2.1 (`types: ["vitest/globals"]`)
- **Рантайм-залежностей немає** — тільки `typescript` і `vitest` у
  `devDependencies`. Не додавай нових пакетів без явного запиту.

## Команди

Усі команди виконуються з теки `app/`:

| Дія | Команда |
|---|---|
| Встановити залежності | `npm install` |
| Тести (одноразово) | `npm test` — `vitest run` |
| Тести (watch) | `npm run test:watch` |
| Типи | `npm run typecheck` — `tsc --noEmit` |
| Build | **не налаштовано** — білд-кроку в проєкті немає |
| Lint | **не налаштовано** — ESLint/Prettier відсутні; стиль тримається за зразком наявного коду |

Не вигадуй `npm run lint` / `npm run build` — таких скриптів у
`package.json` немає.

## Конвенції коду

1. **Іменовані експорти, без `default`** — `export function slugify(...)`.
   Кожна функція чиста: без I/O, без глобального стану, без сайд-ефектів.
2. **Явні типи на публічних сигнатурах** — параметри й повернене значення
   типізуються завжди (`(input: string, maxLength: number): string`).
3. **Імпорти всередині `src/` — з розширенням `.js`**, навіть для `.ts`-файлів
   (ESM): `import { truncate } from "./text-utils.js";`.
4. **Тести поруч із кодом**: `src/<module>.test.ts`, структура
   `describe("<функція>") → it("<поведінка>")`, імпорт
   `{ describe, expect, it } from "vitest"`. Опис тесту описує поведінку
   («returns the input unchanged when …»), а не назву методу.
5. **Коментарі — лише для неочевидного** (чому, а не що). Приклад доречного:
   посилання на баг-тікет над регресійним тестом.
6. Форматування за зразком файлу: 2 пробіли, подвійні лапки, крапка з комою.

## Guardrails

- **Не змінюй публічні сигнатури** `slugify`, `truncate`, `parseTags` —
  тільки реалізацію та тести.
- **Не видаляй і не послаблюй наявні тести**, щоб «зробити зелено». Якщо тест
  падає — правиться код, а не очікування тесту.
- Баг-фікс починається з **падаючого тесту**: спершу відтвори проблему тестом,
  переконайся, що він червоний, і лише потім став фікс.
- Не додавай рантайм-залежностей і не вводь build-крок.
- Ніяких секретів, API-ключів, `.env`, реальних клієнтських даних — у
  проєкті лише синтетичні приклади.
- **Windows + Git Bash:** використовуй `2>/dev/null`, а не `2>nul`
  (останнє створює файл-сміття `nul`).

## Definition of Done

Перед тим як повідомити про завершення задачі:

1. `npm test` — зелений (усі наявні тести + нові).
2. `npm run typecheck` — без помилок.
3. Нова/змінена поведінка покрита тестом, і цей тест падав до фікса.
4. У відповіді коротко: що змінено і чому.
