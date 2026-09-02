import { ArrowRight, Clock } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { CTA } from '@/components/marketing/CTA';
import { blogIndexJsonLd } from '@/lib/jsonld';
import { BLOG_POSTS } from '@/lib/blog';
import { ALTERNATIVES } from '@/lib/alternatives';
import { DEFAULT_LOCALE, localePath } from '@/lib/site';

export function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div className="bg-background">
      <JsonLd data={blogIndexJsonLd(posts)} />

      <header className="border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-3 text-center sm:px-6">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Teleprompter guides
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
            Practical writing on reading to camera — setup guides, script craft, and honest
            comparisons of the tools available.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 py-12 sm:px-6 sm:py-16">
        <ul className="grid gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <a
                href={localePath(DEFAULT_LOCALE, `blog/${post.slug}`)}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                    {post.tag}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingMinutes} min read
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-semibold leading-snug">{post.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {post.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read the guide
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-bold tracking-tight">Comparisons</h2>
          <p className="mt-3 text-muted-foreground">
            How Teleprompter Online stacks up against the alternatives, including where they
            are the better choice.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {ALTERNATIVES.map((item) => (
              <li key={item.slug}>
                <a
                  href={localePath(DEFAULT_LOCALE, `alternatives/${item.slug}`)}
                  className="block h-full rounded-xl border border-border bg-card p-4 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  vs {item.competitor}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <CTA locale={DEFAULT_LOCALE} />
    </div>
  );
}
