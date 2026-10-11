import Card from '@/components/common/Card'
import IconTile from '@/components/common/IconTile'
import { ArrowRightIcon } from '@/components/common/icons'
import { articleDetailPath } from '@/routes/paths'
import type { Article } from '@/types/article'
import ArticleMeta from './ArticleMeta'

/** One article in the Knowledge Centre list; the whole row links to the article. */
export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Card to={articleDetailPath(article.slug)} className="flex items-start gap-4 p-5">
      <IconTile className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <ArticleMeta article={article} />
        <h2 className="mt-1 font-display text-lg font-semibold tracking-wide text-white transition-colors group-hover:text-cyber-teal">
          {article.title}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-white text-justify">{article.excerpt}</p>
      </div>
      <ArrowRightIcon className="mt-1 size-4 shrink-0 text-cyber-muted transition-colors group-hover:text-cyber-teal" />
    </Card>
  )
}
