# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-18

### Added
- Initial release of `sanity-plugin-hierarchical-structure`
- `createHierarchicalStructure` helper to integrate hierarchies into your structure resolver
- `createHierarchicalListItem` for building individual hierarchy list items
- `HierarchicalListView` component for rendering multi-level document trees
- `HierarchicalAccordionItem` component for expandable document nodes
- `HierarchicalDocumentPreview` component with full Sanity document preview support (presence, status indicator, version info)
- `SkeletonLoader` component for loading states
- Support for **forward** hierarchies (parent document holds references to children)
- Support for **reverse** hierarchies (child document holds a reference to its parent)
- Configurable multi-level depth (unlimited nesting)
- Real-time updates via Sanity observables
- Auto-expand to currently selected document across all levels
- Optional `orderBy`, `filter`, and `icon` per hierarchy config
- Full TypeScript support with exported types
