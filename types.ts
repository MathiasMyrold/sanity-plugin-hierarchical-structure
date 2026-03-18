/**
 * Configuration types for hierarchical document structure
 */

export type HierarchyDirection = 'forward' | 'reverse'

/**
 * Forward hierarchy: Document type A has references to B, B has references to C
 * Reverse hierarchy: Find all documents of type B that reference document A
 */
export interface HierarchyLevelConfig {
  /** The document type at this level */
  type: string
  /** The field name that contains references to the next level (forward) or parent level (reverse). Not needed for the last level. */
  referenceField?: string
  /** Custom title for this level (optional, defaults to schema title) */
  title?: string
}

export interface HierarchicalStructureConfig {
  /** Unique ID for this hierarchy */
  id: string
  /** Display title for the root list */
  title: string
  /** Icon for the root list item */
  icon?: React.ComponentType
  /** Direction of the hierarchy */
  direction: HierarchyDirection
  /** 
   * Hierarchy levels configuration
   * For forward: levels define the chain of references (parent -> child -> grandchild)
   * For reverse: levels[0] is the parent, levels[1...n] are children that reference up
   */
  levels: HierarchyLevelConfig[]
  /** Filter query for the root level documents (optional) */
  filter?: string
  /** Custom ordering for root level (optional) */
  orderBy?: string
}
