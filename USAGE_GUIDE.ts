/**
 * HIERARCHICAL DOCUMENT STRUCTURE - QUICK START GUIDE
 * 
 * This file shows you how to set up hierarchical document lists in your Sanity Studio.
 * Follow the steps below based on your use case.
 */

/**
 * STEP 1: Define your document schema with references
 * ====================================================
 */

// Example Schema A: Forward References (Parent references children)
// File: sanity/schemas/documents/category.ts
/*
defineType({
  name: 'category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string'
    }),
    defineField({
      name: 'projects',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}]
    })
  ]
})
*/

// Example Schema B: Reverse References (Child references parent)
// File: sanity/schemas/documents/page.ts
/*
defineType({
  name: 'page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string'
    }),
    defineField({
      name: 'project',
      type: 'reference',
      to: [{type: 'project'}]
    })
  ]
})
*/

/**
 * STEP 2: Create hierarchy configuration
 * =======================================
 */

// For FORWARD hierarchy (parent has references to children)
/*
import type {HierarchicalStructureConfig} from '@/sanity/plugins/hierarchical-structure/types'
import {ProjectsIcon} from '@sanity/icons'

const projectHierarchy: HierarchicalStructureConfig = {
  id: 'project-hierarchy',
  title: 'Project Hierarchy',
  icon: ProjectsIcon,
  direction: 'forward',
  levels: [
    {
      type: 'category',           // Parent document type
      referenceField: 'projects', // Field that contains references to children
      title: 'Categories'
    },
    {
      type: 'project',            // Child document type
      referenceField: 'tasks',    // Field that contains references to next level
      title: 'Projects'
    }
  ],
  orderBy: 'title asc'
}
*/

// For REVERSE hierarchy (group children by what they reference)
/*
const pagesByProject: HierarchicalStructureConfig = {
  id: 'pages-by-project',
  title: 'Pages by Project',
  icon: DocumentIcon,
  direction: 'reverse',
  levels: [
    {
      type: 'project',         // Parent type to group by
      referenceField: 'dummy', // Not used for root level in reverse mode
    },
    {
      type: 'page',            // Child type
      referenceField: 'project', // Field in page that references project
    }
  ],
  orderBy: '_createdAt desc'
}
*/

/**
 * STEP 3: Add to sanity.config.ts
 * ================================
 */

/*
// In sanity.config.ts
import {pageStructure} from '@/sanity/plugins/settings'
import type {HierarchicalStructureConfig} from '@/sanity/plugins/hierarchical-structure/types'

// Define your hierarchies
const myHierarchy: HierarchicalStructureConfig = {
  // ... config from step 2
}

export default defineConfig({
  // ... other config
  plugins: [
    structureTool({
      structure: pageStructure({
        singletons: [home, settings],
        hierarchies: [myHierarchy]
      }),
    }),
    // ... other plugins
  ],
})
*/

/**
 * COMMON USE CASES
 * ================
 */

// Use Case 1: Multi-level nested content
// Example: Category > Project > Task > Subtask
/*
{
  direction: 'forward',
  levels: [
    { type: 'category', referenceField: 'projects' },
    { type: 'project', referenceField: 'tasks' },
    { type: 'task', referenceField: 'subtasks' }
  ]
}
*/

// Use Case 2: Group pages by project
// Shows all pages organized under their parent project
/*
{
  direction: 'reverse',
  levels: [
    { type: 'project', referenceField: 'project' },
    { type: 'page', referenceField: 'project' }
  ]
}
*/

// Use Case 3: With filters and ordering
// Only show published content, sorted by date
/*
{
  direction: 'reverse',
  levels: [
    { type: 'project', referenceField: 'project' },
    { type: 'article', referenceField: 'project' }
  ],
  filter: 'published == true',
  orderBy: 'publishedAt desc'
}
*/

/**
 * REAL-WORLD EXAMPLE FOR THIS PROJECT
 * ====================================
 */

// If you want to group pages under projects (assuming you add a project reference to page):

// 1. Update page.ts schema:
/*
defineField({
  name: 'project',
  title: 'Related Project',
  type: 'reference',
  to: [{type: 'project'}],
  description: 'The project this page belongs to (optional)'
})
*/

// 2. Add to sanity.config.ts:
/*
const pagesByProject: HierarchicalStructureConfig = {
  id: 'pages-by-project',
  title: 'Pages by Project',
  icon: DocumentIcon,
  direction: 'reverse',
  levels: [
    { type: 'project', referenceField: 'project' },
    { type: 'page', referenceField: 'project' }
  ],
  orderBy: 'title asc'
}

// In plugins array:
structureTool({
  structure: pageStructure({
    singletons: [home, settings],
    hierarchies: [pagesByProject]
  }),
}),
*/

/**
 * FEATURES
 * ========
 * 
 * ✅ Real-time updates using Sanity observables
 * ✅ Unlimited nesting depth
 * ✅ Click to open document in editor
 * ✅ Accordion UI for easy navigation
 * ✅ Auto-hides document types used in hierarchies from default list
 * ✅ Flexible filtering and ordering
 * ✅ Works with any document types
 */

/**
 * TROUBLESHOOTING
 * ===============
 * 
 * Problem: Documents don't show up
 * Solution: Check that referenceField names match your schema exactly
 * 
 * Problem: Real-time updates not working
 * Solution: Make sure documents are published, not just drafts
 * 
 * Problem: Nested levels not appearing
 * Solution: Verify that reference fields contain actual references to existing documents
 * 
 * For more details, see: sanity/plugins/hierarchical-structure/README.md
 */

export {} // Make this a module
