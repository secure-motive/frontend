import { useSearchParams } from 'react-router'
import Container from '@/components/common/Container'
import PageHeading from '@/components/common/PageHeading'
import ArticleList from '@/components/knowledge/ArticleList'
import KnowledgeTabs from '@/components/knowledge/KnowledgeTabs'
import ReportList from '@/components/knowledge/ReportList'
import VideoList from '@/components/knowledge/VideoList'
import {
  DEFAULT_KNOWLEDGE_TAB,
  KNOWLEDGE_TABS,
  tabButtonId,
  tabPanelId,
  type KnowledgeTabId,
} from '@/components/knowledge/tabs'
import PageContainer from '@/components/layout/PageContainer'

export default function KnowledgeCentre() {
  // The open tab lives in the URL (?tab=videos) so it can be linked and survives a reload.
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('tab')
  const active = KNOWLEDGE_TABS.find((tab) => tab.id === requested)?.id ?? DEFAULT_KNOWLEDGE_TAB

  const selectTab = (id: KnowledgeTabId) =>
    setSearchParams(id === DEFAULT_KNOWLEDGE_TAB ? {} : { tab: id }, { preventScrollReset: true })

  return (
    <PageContainer title="Knowledge Centre">
      <PageHeading
        label="Intelligence hub"
        title="Knowledge"
        highlight="Centre"
        description="Research, analysis, and practical guidance from our automotive cybersecurity specialists — keeping you ahead of regulatory change and emerging threats."
      />
      {/* The design leaves an empty 37px band between the hero and the tab bar. */}
      <div aria-hidden="true" className="h-9.25" />
      {/* <KnowledgeTabs active={active} onChange={selectTab} /> */}

      <Container className="pt-16 pb-14.5">
        <div role="tabpanel" id={tabPanelId(active)} aria-labelledby={tabButtonId(active)}>
          {/* {active === 'articles' && <ArticleList />} */}
          {/* {active === 'videos' && <VideoList />} */}
          {/* {active === 'reports' && <ReportList />} */}
        </div>
      </Container>
    </PageContainer>
  )
}
