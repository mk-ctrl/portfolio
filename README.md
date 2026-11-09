# mirunkaushik.vercel.app

Portfolio of Mirun Kaushik, AI backend engineer.

Built with [Astro](https://astro.build), Tailwind CSS v4 and three.js. Static output, deployed on Vercel.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check + static build into dist/
```

## Where things live

- `src/data/content.ts`: every word on the site, including projects, experience, timeline and skills. Edit this to update content.
- `src/components/`: one component per home-page section, plus `Flow.astro` for the project flow diagrams.
- `src/pages/work/[slug].astro`: one case-study page per project.
- `src/scripts/inkgraph.ts`: the hero's WebGL ink graph. Ink nodes are rules, data and queues; red nodes are model calls.
- `src/scripts/site.ts`: smooth scroll, scroll reveals, clock, theme toggle, mobile menu.
