// Import necessary modules
import rss from '@astrojs/rss';
import { z, defineCollection, getCollection } from 'astro:content';

/**
 * IMPORTANT! The name of these categories is used when generating routes.
 * Renaming a category will change all post permalinks in that category.
 */
const postCategories = z.enum(['Posts', 'Shop', 'Movies']);
export type Category = z.infer<typeof postCategories>;

const metadata = z
  .object({
    title: z.string(),
    ignoreTitleTemplate: z.boolean(),

    canonical: z.string().url(),

    robots: z.object({ index: z.boolean(), follow: z.boolean() }).partial(),

    description: z.string(),

    openGraph: z
      .object({
        url: z.string().url(),
        siteName: z.string(),
        images: z.array(z.object({ url: z.string().url(), width: z.number(), height: z.number().optional() })),
        locale: z.string(),
        type: z.string(),
      })
      .partial(),

    twitter: z.object({ handle: z.string(), site: z.string(), cardType: z.string() }).partial(),
  })
  .partial()
  .optional();

const postCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    publishDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    image: z.string().optional(),
    category: postCategories,
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    metadata,
    seoTitle: z.string().optional(),
    metaRobots: z.string().optional(),
  }),
});

export const collections = {
  post: postCollection,
};

// Define the GET function as an async function
export async function GET(context) {
  // Retrieve the collection named 'blog'
  const blog = await getCollection('post');

  // Generate the RSS feed
  return rss({
    title: 'SERP Media',
    description: 'Audio. Video. Disco.',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      // author: post.data.author,
      pubDate: post.data.publishDate,
      content: post.body, // Assuming you have the content of each post in post.body
      link: `/posts/${post.slug}/`, // Make sure the link structure matches your routing
    })),
  });
}
