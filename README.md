# 🇳🇵 Flag Construction Visualizer

A **data-driven, step-by-step animated visualization system** for constructing national flags using their **official geometric instructions**.

This project begins with the **National Flag of Nepal** — widely regarded as the most mathematically defined flag in the world — and is designed so that *new flags can be added purely via data and geometry definitions*, without touching rendering logic.

---

## ✨ What This Project Does

- Visually animates **geometric construction steps** (lines, arcs, circles, points)
- Starts from **pure construction lines**, not a filled shape
- Progressively builds the flag **exactly as described in official documents**
- Fades construction lines and **reveals the final colored flag**
- Allows **interactive control** over steps and animation flow

---

## 🧠 Core Idea

> **Geometry is data. Rendering is generic.**

Each flag defines:
- Its construction steps (text + timing)
- A geometry builder that outputs points, lines, arcs
- Colors and metadata

The renderer:
- Knows nothing about flags
- Only draws what the geometry builder returns
- Animates based on step index

---

## 🛠 Tech Stack

- **SvelteKit (Svelte 5)**
- **Threlte** (Three.js renderer for Svelte)
- **Three.js**
- **TypeScript**
- **pnpm**

---

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── canvas/
│   │   │   └── Scene.svelte        # Threlte renderer & animation logic
│   │   └── ui/
│   │       └── FlagInfo.svelte     # Flag information panel
│   ├── data/
│   │   ├── flags/
│   │   │   ├── nepal.ts            # Nepal flag definition
│   │   │   └── index.ts            # Flag registry
│   │   └── types.ts                # Shared geometry & flag types
│   ├── geometry/
│   │   └── NepalFlagBuilder.ts     # Mathematical construction logic
│   └── index.ts
└── routes/
    └── +page.svelte                # UI + controls
```

---

## 📐 Flag Definition (Data Layer)

Each flag is defined declaratively.

Example (simplified):

```ts
export const nepalFlag: FlagDefinition = {
  id: 'nepal',
  name: 'National Flag of Nepal',
  country: 'Nepal 🇳🇵',
  colors: {
    primary: '#DC143C',
    secondary: '#FFFFFF',
    border: '#003893'
  },
  constructionSteps,
  buildGeometry: (scale) => builder.build(),
  buildUpToStep: (scale, step) => builder.buildUpToStep(step)
};
```

No rendering code lives here.

---

## 📐 Geometry Builders (Math Layer)

Builders:
- Compute points, intersections, arcs, circles
- Convert curves into renderable points
- Respect the current construction step

They return:

```ts
interface GeometryResult {
  shape: Point2D[];
  constructionLines?: ConstructionStepData[];
  decorations: FlagDecoration[];
  dimensions: {
    width: number;
    height: number;
  };
}
```

---

## 🎬 Animation Flow

1. Start with **only construction lines**
2. Animate each step sequentially
3. Allow manual stepping forward/backward
4. On final step:
   - Fade construction lines
   - Reveal filled shape + border
   - Show decorations (sun, moon, etc.)

---

## ➕ Adding a New Flag

To add a new flag:

1. Create a new file:
   ```
   src/lib/data/flags/us.ts
   ```

2. Define:
   - `constructionSteps`
   - Geometry builder
   - Metadata

3. Register it in:
   ```ts
   src/lib/data/flags/index.ts
   ```

No renderer changes required.

---

## 🎮 Planned Controls

- ▶ Play / ⏸ Pause animation
- ⏭ Step forward / backward
- 🎚 Speed control
- 👁 Toggle construction visibility
- 📍 Jump to any step

---

## 🚀 Running Locally

```bash
pnpm install
pnpm dev
```

Open:
```
http://localhost:5173
```

---

## 📜 Sources

- **Constitution of Nepal**, Schedule-1 (Article 8)
- Official geometric construction descriptions

---

## 🧑‍💻 Author

**Saurab Poudel**

Learning graphics, geometry, and system-level thinking through visual projects.

---
## 📄 License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.

You are free to:
- Use, study, and modify the source code
- Redistribute the software and your modifications

Under the following conditions:
- Any derivative work **must also be licensed under GPL-3.0**
- Source code must be made available when distributing binaries
- License and copyright notices must be preserved

See the `LICENSE` file for full terms.
