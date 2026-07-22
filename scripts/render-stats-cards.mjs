// Renders the GitHub stats and top-languages cards as static SVGs using the
// github-readme-stats codebase, so the README no longer depends on the shared
// (whitelisted, rate-limited) github-readme-stats.vercel.app instance.
//
// Env:
//   GRS_DIR  - path to a checkout of anuraghazra/github-readme-stats
//   OUT_DIR  - directory to write the SVGs into (default: dist)
//   PAT_1    - GitHub token used by github-readme-stats for API calls

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

const grsDir = resolve(process.env.GRS_DIR || "grs");
const outDir = resolve(process.env.OUT_DIR || "dist");
const username = "gvogas";

const statsHandler = (await import(pathToFileURL(join(grsDir, "api/index.js"))))
  .default;
const topLangsHandler = (
  await import(pathToFileURL(join(grsDir, "api/top-langs.js")))
).default;

// Minimal stand-in for the Vercel/Express req+res the handlers expect.
const render = async (handler, query) => {
  let body;
  const req = { query };
  const res = {
    setHeader: () => {},
    send: (svg) => {
      body = svg;
    },
  };
  await handler(req, res);
  if (typeof body !== "string" || !body.includes("<svg")) {
    throw new Error(`No SVG returned: ${String(body).slice(0, 300)}`);
  }
  if (body.includes("Something went wrong")) {
    throw new Error(`Card rendered an error: ${body.slice(0, 500)}`);
  }
  return body;
};

const statsCommon = { username, show_icons: "true", rank_icon: "github" };
const langsCommon = { username, layout: "compact", langs_count: "8" };

const cards = {
  "github-stats-dark.svg": [
    statsHandler,
    {
      ...statsCommon,
      hide_border: "true",
      bg_color: "1a0535",
      title_color: "54D5FF",
      text_color: "cdd8f7",
      icon_color: "7164F5",
      ring_color: "0F19FC",
    },
  ],
  "github-stats-light.svg": [
    statsHandler,
    {
      ...statsCommon,
      bg_color: "ffffff",
      title_color: "3A06BA",
      text_color: "353963",
      icon_color: "7164F5",
      ring_color: "0F19FC",
      border_color: "e2e5f6",
    },
  ],
  "top-langs-dark.svg": [
    topLangsHandler,
    {
      ...langsCommon,
      hide_border: "true",
      bg_color: "1a0535",
      title_color: "54D5FF",
      text_color: "cdd8f7",
      icon_color: "7164F5",
    },
  ],
  "top-langs-light.svg": [
    topLangsHandler,
    {
      ...langsCommon,
      bg_color: "ffffff",
      title_color: "3A06BA",
      text_color: "353963",
      icon_color: "7164F5",
      border_color: "e2e5f6",
    },
  ],
};

mkdirSync(outDir, { recursive: true });
for (const [file, [handler, query]] of Object.entries(cards)) {
  const svg = await render(handler, query);
  writeFileSync(join(outDir, file), svg);
  console.log(`wrote ${file} (${svg.length} bytes)`);
}
