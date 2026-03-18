import {ChevronDownIcon, ChevronRightIcon} from '@sanity/icons'
import {Box, Card, Flex, Text, TooltipDelayGroupProvider} from '@sanity/ui'
import {forwardRef, ReactNode, useMemo} from 'react'
import {useObservable} from 'react-rx'
import {
  DocumentPreviewPresence,
  DocumentStatusIndicator,
  getPreviewStateObservable,
  getPreviewValueWithFallback,
  type PreviewLayoutKey,
  PreviewCard,
  SanityDefaultPreview,
  type SchemaType,
  useDocumentPresence,
  useDocumentPreviewStore,
  useDocumentVersionInfo,
  useSchema,
} from 'sanity'
import {usePaneRouter} from 'sanity/structure'

export interface DocumentPreviewProps {
  doc: any
  isExpanded: boolean
  hasChildren: boolean
  level: number
  selectedLayout?: PreviewLayoutKey
  onToggle?: () => void
}

/**
 * Document preview component for hierarchical document lists
 * Shows document preview with status indicators, presence, and expand/collapse chevrons
 */
export const HierarchicalDocumentPreview = forwardRef<HTMLDivElement, DocumentPreviewProps>(
  ({selectedLayout = 'default', doc, isExpanded, hasChildren, level, onToggle}, ref) => {
    const router = usePaneRouter()
    const schema = useSchema()

    const {ChildLink, groupIndex, routerPanesState} = router

    const currentDoc = routerPanesState[groupIndex + 1]?.[0]?.id || false
    const pressed = currentDoc === doc._id || currentDoc === doc._id.replace(`drafts.`, ``)
    const selected = pressed && routerPanesState.length === groupIndex + 2

    const Link = useMemo(
      () => (linkProps: {children: ReactNode}) => <ChildLink {...linkProps} childId={doc._id} />,
      [ChildLink, doc._id],
    )

    const versionsInfo = useDocumentVersionInfo(doc._id)
    const documentPreviewStore = useDocumentPreviewStore()
    const schemaType = schema.get(doc._type) as SchemaType
    const documentPresence = useDocumentPresence(doc._id)

    const previewStateObservable = useMemo(() => {
      return getPreviewStateObservable(documentPreviewStore, schemaType, doc._id)
    }, [documentPreviewStore, schemaType, doc._id])

    const {
      snapshot,
      original,
      isLoading: previewIsLoading,
    } = useObservable(previewStateObservable, {
      snapshot: null,
      isLoading: true,
      original: null,
    })

    const status = (
      <TooltipDelayGroupProvider delay={4000}>
        <Flex align="center" gap={3}>
          {documentPresence && documentPresence.length > 0 && (
            <DocumentPreviewPresence presence={documentPresence} />
          )}
          <DocumentStatusIndicator
            draft={versionsInfo.draft}
            published={versionsInfo.published}
            versions={versionsInfo.versions}
          />
        </Flex>
      </TooltipDelayGroupProvider>
    )

    return (
      <Card radius={2} ref={ref}>
        <PreviewCard
          __unstable_focusRing
          // @ts-expect-error - ChildLink component is valid here
          as={Link}
          data-as="a"
          data-ui="PaneItem"
          radius={2}
          sizing="border"
          pressed={pressed}
          selected={selected}
          tabIndex={-1}
          paddingLeft={level * 2 + 2}
          onClick={(e) => {
            // If has children, also toggle accordion when clicking preview
            if (hasChildren && onToggle) {
              // Don't prevent default - let the link navigate
              // But also toggle the accordion
              onToggle()
            }
          }}
        >
          <Flex align="center" gap={2}>
            {hasChildren && (
              <Box
                as="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // Chevron click only toggles, doesn't navigate
                  onToggle?.()
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '20px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: '4px',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </Box>
            )}
            <Box flex={1} style={{minWidth: 0}}>
              <SanityDefaultPreview
                {...getPreviewValueWithFallback({
                  snapshot,
                  original,
                  fallback: doc,
                })}
                isPlaceholder={previewIsLoading}
                status={status}
                layout={selectedLayout}
              />
            </Box>
          </Flex>
        </PreviewCard>
      </Card>
    )
  },
)

HierarchicalDocumentPreview.displayName = 'HierarchicalDocumentPreview'
