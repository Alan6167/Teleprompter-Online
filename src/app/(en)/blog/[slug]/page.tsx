import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPostPage } from '@/components/pages/BlogPostPage';
import { buildMetadata } from '@/lib/seo';
import { BLOG_SLUGS, getPost } from '@/lib/blog';
import { DEFAULT_LOCALE } from '@/lib/site';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return buildMetadata({
    locale: DEFAULT_LOCALE,
    path: `blog/${slug}`,
    localized: false,
    title: post.title,
    description: post.description,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  return <BlogPostPage slug={slug} />;
}
