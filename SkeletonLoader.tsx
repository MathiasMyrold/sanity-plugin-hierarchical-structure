import {Box, Card, Flex, Stack} from '@sanity/ui'

interface SkeletonLoaderProps {
  count?: number
  level?: number
}

const SkeletonBox = ({width, height}: {width: string | number; height: number}) => (
  <Box
    style={{
      width,
      height,
      backgroundColor: 'var(--card-skeleton-color-from, rgba(0, 0, 0, 0.05))',
      borderRadius: '3px',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    }}
  />
)

export function SkeletonLoader({count = 3, level = 0}: SkeletonLoaderProps) {
  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>
      <Stack space={1}>
        {Array.from({length: count}).map((_, index) => (
          <Card
            key={index}
            padding={3}
            paddingLeft={level * 2 + 3}
            radius={2}
            shadow={1}
            tone="transparent"
          >
            <Flex align="center" gap={3}>
              {/* Icon skeleton */}
              <Box>
                <SkeletonBox width={25} height={25} />
              </Box>

              {/* Content skeleton */}
              <Box flex={1}>
                <Stack space={2}>
                  {/* Title skeleton */}
                  <SkeletonBox width={`${60 + (index * 10) % 30}%`} height={16} />
                  {/* Subtitle skeleton */}
                  <SkeletonBox width={`${40 + (index * 7) % 20}%`} height={12} />
                </Stack>
              </Box>

              {/* Chevron skeleton */}
              <Box>
                <SkeletonBox width={20} height={20} />
              </Box>
            </Flex>
          </Card>
        ))}
      </Stack>
    </>
  )
}
