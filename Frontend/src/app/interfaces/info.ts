import { LatestInfo } from './latest'
import { MetaInfo } from './meta'
import { News } from './news'
import { Price } from './price'

export interface Info {
  ticker?: string
  meta?: MetaInfo
  latest?: LatestInfo
  isOpen?: boolean
  latestPrices?: Price[]
  twoYearPrices?: Price[]
  news?: News[]
}
