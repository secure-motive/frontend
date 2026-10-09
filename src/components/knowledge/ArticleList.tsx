import { useSearchParams } from 'react-router'
import { articles } from '@/data/articles'
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/common/icons'
import ArticleCard from './ArticleCard'

const ARTICLES_PER_PAGE = 6

/** The Articles tab: paginated 6 articles per page with Next/Previous controls. */
export default function ArticleList() {
  const [searchParams, setSearchParams] = useSearchParams()

  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE)
  const pageParam = parseInt(searchParams.get('page') || '1', 10)
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : Math.min(pageParam, totalPages)

  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE
  const currentArticles = articles.slice(startIndex, startIndex + ARTICLES_PER_PAGE)
  const endCount = Math.min(startIndex + ARTICLES_PER_PAGE, articles.length)

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return

    const nextParams = new URLSearchParams(searchParams)
    if (newPage === 1) {
      nextParams.delete('page')
    } else {
      nextParams.set('page', newPage.toString())
    }
    setSearchParams(nextParams, { preventScrollReset: true })

    // Smoothly scroll to the top of the list area
    window.scrollTo({ top: 380, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top summary header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="font-code text-2xs uppercase tracking-widest text-cyber-teal font-semibold">
          Showing {startIndex + 1}–{endCount} of {articles.length} Articles
        </span>
        <span className="font-code text-2xs uppercase tracking-wider text-cyber-muted">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Paginated list of 6 articles */}
      <ul className="flex flex-col gap-3">
        {currentArticles.map((article) => (
          <li key={article.slug}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav
          aria-label="Articles pagination"
          className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-cyber-surface/30 p-3 sm:p-4"
        >
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-cyber-field px-4 py-2.5 font-code text-xs uppercase tracking-wider text-white transition-colors hover:border-cyber-teal/50 hover:bg-cyber-teal/10 disabled:cursor-not-allowed disabled:border-white/5 disabled:opacity-40 disabled:hover:bg-cyber-field"
            aria-label="Go to previous page"
          >
            <ArrowLeftIcon className="size-3.5 text-cyber-teal" />
            <span>Previous</span>
          </button>

          {/* Page Number Pills */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1
              const isActive = pageNumber === currentPage

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => handlePageChange(pageNumber)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`size-9 rounded-lg font-code text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'border border-cyber-teal bg-cyber-teal font-bold text-cyber-bg shadow-glow'
                      : 'border border-white/10 bg-cyber-field text-cyber-muted hover:border-cyber-teal/40 hover:text-white'
                  }`}
                  aria-label={`Page ${pageNumber}`}
                >
                  {pageNumber}
                </button>
              )
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-cyber-field px-4 py-2.5 font-code text-xs uppercase tracking-wider text-white transition-colors hover:border-cyber-teal/50 hover:bg-cyber-teal/10 disabled:cursor-not-allowed disabled:border-white/5 disabled:opacity-40 disabled:hover:bg-cyber-field"
            aria-label="Go to next page"
          >
            <span>Next</span>
            <ArrowRightIcon className="size-3.5 text-cyber-teal" />
          </button>
        </nav>
      )}
    </div>
  )
}

