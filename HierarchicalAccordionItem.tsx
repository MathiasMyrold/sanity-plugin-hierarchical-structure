import {Box, Card, Stack, Text} from '@sanity/ui'
import {useCallback, useEffect, useRef, useState} from 'react'
import {type SanityDocument, useClient} from 'sanity'
import {HierarchicalDocumentPreview} from './DocumentPreview'
import {SkeletonLoader} from './SkeletonLoader'
import type {HierarchyDirection, HierarchyLevelConfig} from './types'

interface HierarchicalAccordionItemProps {
  document: SanityDocument
  level: number
  levelConfigs: HierarchyLevelConfig[]
  direction: HierarchyDirection
  selectedDocId?: string
  ancestorIds?: Set<string>
}

export function HierarchicalAccordionItem({
  document,
  level,
  levelConfigs,
  direction,
  selectedDocId,
  ancestorIds,
}: HierarchicalAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [children, setChildren] = useState<SanityDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [manuallyToggled, setManuallyToggled] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const client = useClient({apiVersion: '2024-01-01'})

  const normalizedDocId = document._id.replace('drafts.', '')
  const isSelected = selectedDocId === normalizedDocId

  const currentLevelConfig = levelConfigs[level]
  const nextLevelConfig = levelConfigs[level + 1]
  const hasNextLevel = !!nextLevelConfig

  useEffect(() => {
    if (!isOpen || !hasNextLevel) return

    setLoading(true)
    setShowSkeleton(false)

    // Delay showing skeleton by 500ms to avoid flash for fast loads
    const skeletonTimer = setTimeout(() => {
      setShowSkeleton(true)
    }, 500)

    let query: string
    let params: Record<string, unknown>

    if (direction === 'forward') {
      // Forward: Get documents referenced by this document's referenceField
      if (!currentLevelConfig.referenceField) {
        setChildren([])
        setLoading(false)
        return
      }

      const references = document[currentLevelConfig.referenceField]
      if (!references || !Array.isArray(references) || references.length === 0) {
        setChildren([])
        setLoading(false)
        return
      }

      const refIds = references
        .map((ref: unknown) => {
          if (typeof ref === 'object' && ref !== null && '_ref' in ref) {
            return (ref as {_ref: string})._ref
          }
          return null
        })
        .filter(Boolean)

      if (refIds.length === 0) {
        setChildren([])
        setLoading(false)
        return
      }

      query = `*[_type == $type && _id in $ids]`
      params = {type: nextLevelConfig.type, ids: refIds}
    } else {
      // Reverse: Find all documents that reference this document
      query = `*[_type == $type && references($parentId)]`
      params = {type: nextLevelConfig.type, parentId: document._id}
    }

    // Subscribe to real-time updates
    const subscription = client.observable
      .fetch(query, params)
      .subscribe({
        next: (docs: SanityDocument[]) => {
          setChildren(docs || [])
          setLoading(false)
        },
        error: (error: Error) => {
          console.error('Error fetching children:', error)
          setLoading(false)
        },
      })

    return () => {
      clearTimeout(skeletonTimer)
      subscription.unsubscribe()
    }
  }, [isOpen, hasNextLevel, document, currentLevelConfig, nextLevelConfig, direction, client])

  // Auto-expand if this document is in the expanded path
  useEffect(() => {
    if (!selectedDocId || !hasNextLevel || manuallyToggled) return

    // Simply check if this document is in the ancestor chain
    if (ancestorIds?.has(normalizedDocId)) {
      setIsOpen(true)
    }
  }, [selectedDocId, hasNextLevel, normalizedDocId, ancestorIds, manuallyToggled])

  // Scroll selected item into view, centered
  useEffect(() => {
    if (isSelected && previewRef.current) {
      // Small delay to ensure rendering is complete
      setTimeout(() => {
        previewRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 100)
    }
  }, [isSelected])

  const handleToggle = useCallback(
    (e?: React.MouseEvent) => {
      if (hasNextLevel) {
        setIsOpen(!isOpen)
        setManuallyToggled(true)
      }
    },
    [hasNextLevel, isOpen],
  )

  return (
    <Stack space={1}>
      <Box ref={previewRef}>
        <HierarchicalDocumentPreview
          doc={document}
          isExpanded={isOpen}
          hasChildren={hasNextLevel}
          level={level}
          onToggle={handleToggle}
        />
      </Box>

      {isOpen && hasNextLevel && (
        <Box>
          {loading && showSkeleton ? (
            <SkeletonLoader count={2} level={level + 1} />
          ) : loading ? null : children.length > 0 ? (
            <Stack space={1}>
              {children.map((child) => (
                <HierarchicalAccordionItem
                  key={child._id}
                  document={child}
                  level={level + 1}
                  levelConfigs={levelConfigs}
                  direction={direction}
                  selectedDocId={selectedDocId}
                  ancestorIds={ancestorIds}
                />
              ))}
            </Stack>
          ) : (
            <Card padding={2} paddingLeft={(level + 1) * 2 + 2} radius={2} tone="transparent">
              <Text size={1} muted>
                No {nextLevelConfig.title || nextLevelConfig.type} found
              </Text>
            </Card>
          )}
        </Box>
      )}
    </Stack>
  )
}
