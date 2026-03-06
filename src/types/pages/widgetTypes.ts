// MUI Imports
import type { ChipProps } from '@mui/material/Chip'

// Type Imports
import type { ThemeColor } from '@core/types'
import type { CustomAvatarProps } from '@core/components/mui/Avatar'

export type CardStatsVerticalProps = {
  title: string
  stats: string
  avatarIcon: string
  chipText: string
  chipColor?: ChipProps['color']
  trendNumber: string
  trend?: 'positive' | 'negative'
  avatarColor?: ThemeColor
  avatarSize?: number
  avatarSkin?: CustomAvatarProps['skin']
}

