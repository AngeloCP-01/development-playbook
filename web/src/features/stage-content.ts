import type { ComponentType } from 'react'
import { ProductDiscovery } from './discovery/ProductDiscovery'

/**
 * Stage slug → interactive page body. A stage missing from this map renders the
 * "not written yet" placeholder, so adding a stage is a one-line change here.
 */
export const STAGE_CONTENT: Record<string, ComponentType> = {
  '01-product-discovery': ProductDiscovery,
}
