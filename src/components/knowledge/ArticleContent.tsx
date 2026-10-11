import type { ArticleBlock, ArticleText } from '@/types/article'
import { cn } from '@/utils/helpers'

/** A line of article text, keeping the bold and italic runs of the source document. */
function Text({ value }: { value: ArticleText }) {
  if (typeof value === 'string') return value

  return value.map((run, index) => {
    if (typeof run === 'string') return run
    const className = cn(run.bold && 'font-semibold text-white', run.italic && 'italic')
    return run.bold ? (
      <strong key={index} className={className}>
        {run.text}
      </strong>
    ) : (
      <em key={index} className={className}>
        {run.text}
      </em>
    )
  })
}

function Block({ block }: { block: ArticleBlock }) {
  if (block.type === 'heading') {
    return block.level === 2 ? (
      <h2 className="mt-8 -mb-1 font-display text-xl font-semibold tracking-wide text-cyber-teal first:mt-0">
        {block.text}
      </h2>
    ) : (
      <h3 className="mt-2 -mb-2 font-display text-lg font-semibold tracking-wide text-white first:mt-0">
        {block.text}
      </h3>
    )
  }

  if (block.type === 'paragraph') {
    return (
      <p className="text-justify">
        <Text value={block.text} />
      </p>
    )
  }

  // The marker and the text are separate flex items, so wrapped lines align with the text.
  const List = block.ordered ? 'ol' : 'ul'
  return (
    <List className="flex flex-col gap-2.5">
      {block.items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          {block.ordered ? (
            <span aria-hidden="true" className="w-5 shrink-0 font-code text-sm/6.5 text-cyber-teal">
              {index + 1}.
            </span>
          ) : (
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-cyber-orange" />
          )}
          <span className="text-justify">
            <Text value={item} />
          </span>
        </li>
      ))}
    </List>
  )
}

/**
 * The body of an article: headings, paragraphs and lists in the order of the
 * source document. The design has no article page, so the type follows the
 * Service Detail body: teal section headings, white sub-headings, muted text.
 */
export default function ArticleContent({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="flex flex-col gap-4 leading-relaxed text-white text-justify">
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  )
}
