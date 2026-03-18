# sanity-plugin-hierarchical-structure

[![npm version](https://img.shields.io/npm/v/sanity-plugin-hierarchical-structure.svg)](https://www.npmjs.com/package/sanity-plugin-hierarchical-structure)
[![license](https://img.shields.io/npm/l/sanity-plugin-hierarchical-structure.svg)](LICENSE)

A [Sanity Studio](https://www.sanity.io) plugin that renders documents as nested, multi-level accordion lists in the structure tool. Supports both **forward** references (a parent document holds an array of references to its children) and **reverse** references (a child document holds a reference to its parent).

---

## Requirements

- Sanity Studio v3 or v5
- React 18 or 19

---

## Installation

```bash
npm install sanity-plugin-hierarchical-structure
```

---

## Concepts

| Direction | How it works |
|-----------|-------------|
| `forward` | Parent document has a reference field (array) pointing to children |
| `reverse` | Child document has a reference field pointing to its parent |

---

## Usage

### 1. Add to your structure resolver

```ts
// sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {createHierarchicalStructure} from 'sanity-plugin-hierarchical-structure'
import type {HierarchicalStructureConfig} from 'sanity-plugin-hierarchical-structure'

const hierarchies: HierarchicalStructureConfig[] = [
  {
    id: 'projects-by-category',
    title: 'Projects by Category',
    direction: 'reverse',
    levels: [
      {type: 'category', title: 'Categories'},
      {type: 'project', referenceField: 'category', title: 'Projects'},
    ],
  },
]

export default defineConfig({
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            ...createHierarchicalStructure(S, context, hierarchies),
            S.divider(),
            ...S.documentTypeListItems(),
          ]),
    }),
  ],
})
```

---

### Forward hierarchy

Use this when the **parent** document has an array field referencing its children.

**Schema example**

```ts
{
  name: 'category',
  type: 'document',
  fields: [
    {name: 'title', type: 'string'},
    {
      name: 'projects',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
    },
  ],
}
```

**Config**

```ts
const hierarchy: HierarchicalStructureConfig = {
  id: 'category-projects',
  title: 'Category -> Projects',
  direction: 'forward',
  levels: [
    {type: 'category', referenceField: 'projects', title: 'Categories'},
    {type: 'project', title: 'Projects'},
  ],
}
```

---

### Reverse hierarchy

Use this when the **child** document has a reference field pointing up to its parent.

**Schema example**

```ts
{
  name: 'project',
  type: 'document',
  fields: [
    {name: 'title', type: 'string'},
    {name: 'category', type: 'reference', to: [{type: 'category'}]},
  ],
}
```

**Config**

```ts
const hierarchy: HierarchicalStructureConfig = {
  id: 'projects-by-category',
  title: 'Projects by Category',
  direction: 'reverse',
  levels: [
    {type: 'category', title: 'Categories'},
    {type: 'project', referenceField: 'category', title: 'Projects'},
  ],
}
```

---

### Multi-level hierarchy

Hierarchies can be nested as deep as needed.

```ts
const hierarchy: HierarchicalStructureConfig = {
  id: 'deep-hierarchy',
  title: 'Category -> Project -> Task',
  direction: 'forward',
  levels: [
    {type: 'category', referenceField: 'projects', title: 'Categories'},
    {type: 'project', referenceField: 'tasks', title: 'Projects'},
    {type: 'task', referenceField: 'subtasks', title: 'Tasks'},
    {type: 'subtask', title: 'Subtasks'},
  ],
}
```

---

## API Reference

### `createHierarchicalStructure(S, context, configs)`

Returns an array of structure list items ready to be spread into `S.list().items([...])`.

| Parameter | Type | Description |
|-----------|------|-------------|
| `S` | `StructureBuilder` | The Sanity structure builder |
| `context` | `StructureResolverContext` | The structure resolver context |
| `configs` | `HierarchicalStructureConfig[]` | Array of hierarchy configurations |

### `createHierarchicalListItem(S, context, config)`

Creates a single hierarchy list item.

---

### `HierarchicalStructureConfig`

```ts
interface HierarchicalStructureConfig {
  /** Unique ID for this hierarchy */
  id: string
  /** Display title shown in the structure sidebar */
  title: string
  /** Optional Sanity icon component */
  icon?: React.ComponentType
  /** Direction of reference traversal */
  direction: 'forward' | 'reverse'
  /** Ordered list of levels in the hierarchy */
  levels: HierarchyLevelConfig[]
  /** Optional GROQ filter applied to the root level */
  filter?: string
  /** Optional ordering for the root level, e.g. 'title asc' */
  orderBy?: string
}
```

### `HierarchyLevelConfig`

```ts
interface HierarchyLevelConfig {
  /** The document type at this level */
  type: string
  /**
   * The reference field used to find related documents.
   * - Forward: field on THIS level that holds refs to the next level
   * - Reverse: field on the NEXT level that holds a ref back to this level
   * Not required on the last level.
   */
  referenceField?: string
  /** Display label for this level (falls back to schema title) */
  title?: string
}
```

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch: `git checkout -b feat/my-feature`
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org)
4. Push the branch: `git push origin feat/my-feature`
5. Open a pull request

---

## License

[MIT](LICENSE)
