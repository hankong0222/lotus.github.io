import { notFound } from "next/navigation";
import IdeaBook from "@/components/IdeaBook";
import { getIdeaBySlug, ideaListItems, ideaListTags } from "@/content/ideas";

export function generateStaticParams() {
  return ideaListItems.map((item) => ({ slug: item.slug }));
}

function colorForTag(tag: string) {
  return ideaListTags.find((item) => item.label === tag)?.color ?? "#94a3b8";
}

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idea = getIdeaBySlug(slug);

  if (!idea) {
    notFound();
  }

  const accent = colorForTag(idea.tag);
  const currentIndex = ideaListItems.findIndex((item) => item.slug === slug);
  const previousIdea = currentIndex < ideaListItems.length - 1 ? ideaListItems[currentIndex + 1] : null;
  const nextIdea = currentIndex > 0 ? ideaListItems[currentIndex - 1] : null;

  return <IdeaBook accent={accent} idea={idea} previousIdea={previousIdea} nextIdea={nextIdea} />;
}
