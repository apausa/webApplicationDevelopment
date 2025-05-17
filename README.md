# Particle Physics Simulation Dashboard

## Note

- To do: mock running processes and succesfull runs so that their visualization graph can be accessed. 

## Getting Started

First, install dependencies

```bash
npm install
```

Then, generate build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Then, run alienv:

```bash
/cvmfs/alice.cern.ch/bin/alienv enter O2sim
```

Finally, run the production server:

```bash
npm run start
# or
yarn start
# or
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
