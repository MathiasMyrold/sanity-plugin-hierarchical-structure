# Publishing the Package

## Steps to Publish

### 1. Update Package Metadata

Edit [package.json](./package.json) and update:
- `name`: Change to your desired package name (must be unique on npm)
- `version`: Start with `1.0.0` or your version
- `author`: Your name and email
- `homepage`: Your GitHub repo URL
- `repository.url`: Your GitHub repo URL
- `bugs.url`: Your GitHub issues URL

### 2. Build the Package

```bash
cd sanity/plugins/hierarchical-structure
npm install
npm run build
```

This will:
- Install dependencies
- Compile TypeScript
- Generate type definitions
- Create distributable files in `dist/`

### 3. Test Locally

Before publishing, test the package locally:

```bash
# In the plugin directory
npm pack

# This creates a .tgz file you can install in another project
npm install /path/to/sanity-plugin-hierarchical-structure-1.0.0.tgz
```

### 4. Publish to npm

```bash
# Login to npm (first time only)
npm login

# Publish the package
npm publish
```

For scoped packages (recommended):
```bash
npm publish --access public
```

## Using the Published Package

Once published, users can install it:

```bash
npm install sanity-plugin-hierarchical-structure
```

And use it in their Sanity config:

```typescript
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {createHierarchicalStructure} from 'sanity-plugin-hierarchical-structure'

export default defineConfig({
  // ... other config
  plugins: [
    structureTool({
      structure: (S, context) => {
        const pagesByProject = createHierarchicalStructure(S, context, {
          id: 'pages-by-project',
          title: 'Pages by Project',
          direction: 'reverse',
          levels: [
            {
              type: 'project',
              title: 'Projects',
            },
            {
              type: 'page',
              referenceField: 'project',
              title: 'Related Pages',
            },
          ],
          orderBy: 'title asc',
        })

        return S.list()
          .title('Content')
          .items([
            pagesByProject,
            // ... other items
          ])
      },
    }),
  ],
})
```

## Version Updates

When making changes:

1. Update the version in `package.json` following [semver](https://semver.org/):
   - Patch: `1.0.1` - Bug fixes
   - Minor: `1.1.0` - New features (backwards compatible)
   - Major: `2.0.0` - Breaking changes

2. Build and publish:
   ```bash
   npm run build
   npm publish
   ```

## Files Included in Package

The following files will be published (see `files` in package.json):
- `dist/` - Compiled JavaScript and TypeScript definitions
- `README.md` - Package documentation

Excluded files (see `.npmignore`):
- Source TypeScript files
- `node_modules`
- Test files
- Examples directory
