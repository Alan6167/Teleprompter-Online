import { ArrowLeft, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { CTA } from '@/components/marketing/CTA';
import { FAQAccordion } from '@/components/marketing/FAQAccordion';
import { blogPostJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/jsonld';
import { BLOG_POSTS, getPost } from '@/lib/blog';
import { DEFAULT_LOCALE, localePath } from '@/lib/site';

export function BlogPostPage({ slug }: { slug: string }) {
  const post = getPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);
  const published = new Date(post.publishedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-background">
      <JsonLd
        data={[
          blogPostJsonLd(post),
          breadcrumbJsonLd(DEFAULT_LOCALE, [
            { name: 'Guides', path: 'blog' },
            { name: post.title, path: `blog/${post.slug}` },
          ]),
          ...(post.faq ? [faqJsonLd(post.faq)] : []),
        ]}
      />

      <article>
        <header className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-3 sm:px-6">
            <a
              href={localePath(DEFAULT_LOCALE, 'blog')}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              All guides
            </a>
            <h1 className="mt-6 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {post.tag}
              </span>
              <time dateTime={post.publishedAt}>{published}</time>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readingMinutes} min read
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-3 py-12 sm:px-6 sm:py-16">
          <div className="space-y-5 text-lg leading-8">
            {post.intro.map((paragraph, i) => (
              <p key={i} className={i === 0 ? undefined : 'text-muted-foreground'}>
                {paragraph}
              </p>
            ))}
          </div>

          {post.sections.map((section, i) => (
            <section key={i} className="mt-12">
              <h2 className="text-2xl font-bold tracking-tight">{section.heading}</h2>
              {section.paragraphs?.map((paragraph, j) => (
                <p key={j} className="mt-4 leading-8 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="mt-5 space-y-3">
                  {section.list.map((item, j) => (
                    <li key={j} className="flex gap-3 leading-7 text-muted-foreground">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {post.faq && (
            <section className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight">Common questions</h2>
              <FAQAccordion items={post.faq} />
            </section>
          )}

          <section className="mt-14 border-t border-border pt-10">
            <h2 className="text-lg font-semibold">Keep reading</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <a
                    href={localePath(DEFAULT_LOCALE, `blog/${p.slug}`)}
                    className="block rounded-xl border border-border bg-card p-4 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                  >
                    {p.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>

      <CTA locale={DEFAULT_LOCALE} />
    </div>
  );
}
