import { LatestInfo } from './latest'
import { MetaInfo } from './meta'

export interface Info {
  ticker?: string
  meta?: MetaInfo
  latest?: LatestInfo
  isOpen?: boolean
}
