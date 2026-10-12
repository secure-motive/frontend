/** Tabs of the Knowledge Centre, in the order the design shows them. */
export const KNOWLEDGE_TABS = [
  { id: 'articles', label: 'Articles' },
  { id: 'videos', label: 'Videos' },
  // { id: 'reports', label: 'Reports' },
] as const

export type KnowledgeTabId = (typeof KNOWLEDGE_TABS)[number]['id']

export const DEFAULT_KNOWLEDGE_TAB: KnowledgeTabId = 'articles'

/** Element ids that tie each tab button to its panel. */
export const tabButtonId = (id: KnowledgeTabId) => `knowledge-tab-${id}`
export const tabPanelId = (id: KnowledgeTabId) => `knowledge-panel-${id}`
