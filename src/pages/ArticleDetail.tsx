import { useParams } from 'react-router'
import Container from '@/components/common/Container'
import Divider from '@/components/common/Divider'
import HeroBand from '@/components/common/HeroBand'
import TextLink from '@/components/common/TextLink'
import ArticleContent from '@/components/knowledge/ArticleContent'
import ArticleMeta from '@/components/knowledge/ArticleMeta'
import ArticleNavigation from '@/components/knowledge/ArticleNavigation'
import PageContainer from '@/components/layout/PageContainer'
import { getArticleContent } from '@/data/articleContent'
import { getArticleBySlug } from '@/data/articles'
import { ROUTES } from '@/routes/paths'
import NotFound from './NotFound'

/**
 * One template for every article. The design has no article page, so this
 * follows the Service Detail layout: hero band, body on the left, navigation
 * cards on the right.
 */
export default function ArticleDetail() {
  const { slug = '' } = useParams()
  const article = getArticleBySlug(slug)

  if (!article) return <NotFound />

  return (
    <PageContainer title={article.title} description={article.excerpt}>
      <article>
        <HeroBand>
          <TextLink to={ROUTES.knowledgeCentre} arrow="left" tone="muted">
            Knowledge Centre
          </TextLink>
          <div className="mt-3.75">
            <ArticleMeta article={article} />
          </div>
          <h1 className="max-w-4xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          <Divider width="md" />
        </HeroBand>

        {/* The top padding includes the empty 37px band the design leaves under every hero. */}
        <Container className="grid items-start gap-12 pt-14 pb-14 md:pt-25 md:pb-16 lg:grid-cols-3">
          <div className="lg:col-span-2 text-justify">
            <ArticleContent blocks={getArticleContent(article.slug)} />
          </div>
          <ArticleNavigation slug={article.slug} />
        </Container>
      </article>
    </PageContainer>
  )
}
