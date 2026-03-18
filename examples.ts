/**
 * Example configurations for hierarchical document structures
 * 
 * Copy and modify these examples to create your own hierarchies
 */

import {DocumentIcon, ProjectsIcon} from '@sanity/icons'
import type {HierarchicalStructureConfig} from './types'

/**
 * Example 1: Forward Hierarchy
 * Shows projects that have references to pages, and pages that have references to other pages
 * 
 * Use case: Parent documents directly reference their children
 */
export const forwardHierarchyExample: HierarchicalStructureConfig = {
  id: 'project-pages-hierarchy',
  title: 'Projects & Pages',
  icon: ProjectsIcon,
  direction: 'forward',
  levels: [
    {
      type: 'project',
      referenceField: 'relatedPages', // Field in project that references pages
      title: 'Projects',
    },
    {
      type: 'page',
      referenceField: 'subPages', // Field in page that references other pages  
      title: 'Pages',
    },
  ],
  orderBy: 'title asc',
}

/**
 * Example 2: Reverse Hierarchy
 * Groups documents by what they reference
 * 
 * Use case: Shows all pages grouped under the project they reference
 */
export const reverseHierarchyExample: HierarchicalStructureConfig = {
  id: 'pages-by-project',
  title: 'Pages by Project',
  icon: DocumentIcon,
  direction: 'reverse',
  levels: [
    {
      type: 'project',
      referenceField: 'project', // Not used in root level for reverse
      title: 'Project',
    },
    {
      type: 'page',
      referenceField: 'project', // Field in page that references a project
      title: 'Pages',
    },
  ],
  orderBy: 'title asc',
}

/**
 * Example 3: Deep Forward Hierarchy (3+ levels)
 * 
 * Use case: Multi-level nested structure like Category -> Project -> Task -> Subtask
 */
export const deepForwardHierarchy: HierarchicalStructureConfig = {
  id: 'category-project-task',
  title: 'Categories & Projects',
  icon: ProjectsIcon,
  direction: 'forward',
  levels: [
    {
      type: 'category',
      referenceField: 'projects',
      title: 'Categories',
    },
    {
      type: 'project',
      referenceField: 'tasks',
      title: 'Projects',
    },
    {
      type: 'task',
      referenceField: 'subtasks',
      title: 'Tasks',
    },
  ],
  filter: 'published == true', // Optional: filter root level
  orderBy: 'order asc',
}

/**
 * Example 4: Reverse with Filter
 * 
 * Use case: Show only published pages grouped by projects
 */
export const reverseWithFilter: HierarchicalStructureConfig = {
  id: 'published-pages-by-project',
  title: 'Published Pages (Grouped)',
  icon: DocumentIcon,
  direction: 'reverse',
  levels: [
    {
      type: 'project',
      referenceField: 'project',
    },
    {
      type: 'page',
      referenceField: 'project',
    },
  ],
  filter: 'published == true', // Only show published projects
  orderBy: '_createdAt desc',
}
