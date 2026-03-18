import {Card, Container, Stack, Text} from '@sanity/ui'
import {useEffect, useState} from 'react'
import {type SanityDocument, useClient} from 'sanity'
import {usePaneRouter} from 'sanity/structure'
import {HierarchicalAccordionItem} from './HierarchicalAccordionItem'
import {SkeletonLoader} from './SkeletonLoader'
import type {HierarchicalStructureConfig} from './types'

interface HierarchicalListViewProps {
  options?: {
    config: HierarchicalStructureConfig
    context?: any
  }
}

export function HierarchicalListView({options}: HierarchicalListViewProps) {
  if (!options?.config) {
    return (
      <Container width={2} padding={4}>
        <Card padding={4} radius={2} shadow={1}>
          <Text>No configuration provided</Text>
        </Card>
      </Container>
    )
  }

  const config = options.config
  const [rootDocuments, setRootDocuments] = useState<SanityDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [ancestorIds, setAncestorIds] = useState<Set<string>>(new Set())
  const client = useClient({apiVersion: '2024-01-01'})
  const router = usePaneRouter()

  // Get the selected document ID from router
  const selectedDocId = router.routerPanesState[router.groupIndex + 1]?.[0]?.id?.replace('drafts.', '')

  useEffect(() => {
    // Delay showing skeleton by 500ms to avoid flash for fast loads
    const skeletonTimer = setTimeout(() => {
      setShowSkeleton(true)
    }, 500)

    return () => clearTimeout(skeletonTimer)
  }, [])

  useEffect(() => {
    const rootConfig = config.levels[0]
    let query = `*[_type == $type`

    if (config.filter) {
      query += ` && ${config.filter}`
    }

    query += `]`

    if (config.orderBy) {
      query += ` | order(${config.orderBy})`
    }

    const params = {type: rootConfig.type}

    // Subscribe to real-time updates for root documents
    const subscription = client.observable
      .fetch(query, params)
      .subscribe({
        next: (docs: SanityDocument[]) => {
          setRootDocuments(docs || [])
          setLoading(false)
        },
        error: (error: Error) => {
          console.error('Error fetching root documents:', error)
          setLoading(false)
        },
      })

    return () => subscription.unsubscribe()
  }, [config, client])

  // Calculate ancestor path once when selected document changes
  useEffect(() => {
    if (!selectedDocId || rootDocuments.length === 0) {
      setAncestorIds(new Set())
      return
    }

    const findAncestors = async (docId: string): Promise<string[]> => {
      const ancestors: string[] = []
      let currentId = docId

      // First, identify which level the selected document is at
      const selectedDoc = await client.fetch(
        `*[_id == $currentId || _id == "drafts." + $currentId][0]{_id, _type}`,
        {currentId}
      )

      if (!selectedDoc) return ancestors

      // Find the level of the selected document
      let currentLevel = config.levels.findIndex(l => l.type === selectedDoc._type)
      if (currentLevel <= 0) return ancestors // Already at root or not found

      // Traverse up through parent references
      currentId = selectedDoc._id.replace('drafts.', '')

      while (currentLevel > 0) {
        const levelConfig = config.levels[currentLevel]
        const refField = levelConfig.referenceField

        if (!refField) break

        const doc = await client.fetch(
          `*[_id == $currentId || _id == "drafts." + $currentId][0]{${refField}}`,
          {currentId}
        )

        if (!doc?.[refField]?._ref) break

        const parentId = doc[refField]._ref.replace('drafts.', '')
        ancestors.push(parentId)
        currentId = parentId
        currentLevel--
      }

      return ancestors
    }

    findAncestors(selectedDocId).then((ancestors) => {
      setAncestorIds(new Set(ancestors))
    })
  }, [selectedDocId, rootDocuments, config, client])

  if (loading && showSkeleton) {
    return (
      <Container width={1} padding={3}>
        <SkeletonLoader count={5} level={0} />
      </Container>
    )
  }

  if (loading) {
    // Still loading but skeleton not shown yet
    return null
  }

  if (rootDocuments.length === 0) {
    return (
      <Container width={2} padding={4}>
        <Card padding={4} radius={2} shadow={1}>
          <Text muted>No documents found</Text>
        </Card>
      </Container>
    )
  }

  return (
    <Container width={1} padding={3}>
      <Stack space={1}>
        {rootDocuments.map((doc) => (
          <HierarchicalAccordionItem
            key={doc._id}
            document={doc}
            level={0}
            levelConfigs={config.levels}
            direction={config.direction}
            selectedDocId={selectedDocId}
            ancestorIds={ancestorIds}
          />
        ))}
      </Stack>
    </Container>
  )
}
