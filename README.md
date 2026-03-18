# sanity-plugin-hierarchical-structure

A Sanity Studio plugin for displaying documents in hierarchical accordion structures.

## Installation

```bash
npm install sanity-plugin-hierarchical-structure
```

## Usage

```typescript
import {createHierarchicalStructure} from 'sanity-plugin-hierarchical-structure'

const pagesByProject = createHierarchicalStructure(S, context, {
  id: 'pages-by-project',
  title: 'Pages by Project',
  direction: 'reverse',
  levels: [
    { type: 'project', title: 'Projects' },
    { type: 'page', referenceField: 'project', title: 'Pages' },
  ],
})
```

## License

MIT
