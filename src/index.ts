/**
 * Hierarchical Structure Builder for Sanity Studio
 * 
 * This module provides a flexible system for creating hierarchical document lists
 * with real-time updates using observables. Supports both forward and reverse references.
 * 
 * @example Forward Hierarchy (Parent has references to children)
 * ```ts
 * const config: HierarchicalStructureConfig = {
 *   id: 'project-hierarchy',
 *   title: 'Project Hierarchy',
 *   direction: 'forward',
 *   levels: [
 *     { type: 'category', referenceField: 'projects' },
 *     { type: 'project', referenceField: 'tasks' },
 *     { type: 'task', referenceField: 'subtasks' }
 *   ]
 * }
 * ```
 * 
 * @example Reverse Hierarchy (Children reference parent)
 * ```ts
 * const config: HierarchicalStructureConfig = {
 *   id: 'project-reverse',
 *   title: 'Projects by Category',
 *   direction: 'reverse',
 *   levels: [
 *     { type: 'category', referenceField: 'category' },
 *     { type: 'project', referenceField: 'parentProject' }
 *   ]
 * }
 * ```
 */

import {type StructureBuilder, type StructureResolverContext} from 'sanity/structure'
import {HierarchicalListView} from './HierarchicalListView'
import type {HierarchicalStructureConfig} from './types'

// Re-export types for convenience
export type {
  HierarchicalStructureConfig,
  HierarchyLevelConfig,
  HierarchyDirection,
} from './types'

/**
 * Creates a hierarchical list item for the structure tool
 * @public
 */
export function createHierarchicalListItem(
  S: StructureBuilder,
  context: StructureResolverContext,
  config: HierarchicalStructureConfig,
) {
  return S.listItem()
    .title(config.title)
    .icon(config.icon)
    .child(() =>
      Object.assign(
        S.documentList()
          .title(config.title)
          .filter(`_type == "${config.levels[0].type}"`)
          .serialize(),
        {
          __preserveInstance: true,
          type: 'component',
          component: HierarchicalListView,
          options: {config, context},
        },
      ),
    )
}

/**
 * Helper function to integrate hierarchical structures into your structure resolver
 * 
 * @example
 * ```ts
 * import {createHierarchicalStructure} from './sanity/plugins/hierarchical-structure'
 * 
 * export const pageStructure: StructureResolver = (S, context) => {
 *   const hierarchies = [
 *     {
 *       id: 'my-hierarchy',
 *       title: 'My Hierarchy',
 *       direction: 'forward',
 *       levels: [...]
 *     }
 *   ]
 * 
 *   return S.list()
 *     .title('Content')
 *     .items([
 *       ...createHierarchicalStructure(S, context, hierarchies),
 *       S.divider(),
 *       ...S.documentTypeListItems()
 *     ])
 * }
 * ```
 * @public
 */
export function createHierarchicalStructure(
  S: StructureBuilder,
  context: StructureResolverContext,
  configs: HierarchicalStructureConfig[],
) {
  return configs.map((config) => createHierarchicalListItem(S, context, config))
}
