import { getTopStoryIDs, getStoriesByIDs } from "@/services/hn";
import Link from "next/link";
import { STORIES_PER_PAGE } from "@/lib/constants";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  let page = parseInt(searchParams.page || "1");
  const storyIDs = await getTopStoryIDs();

  if (isNaN(page) || page < 1) page = 1; // Prevent invalid pages
  if (!storyIDs.length) return <p>No stories available.</p>;

  const startIndex = (page - 1) * STORIES_PER_PAGE;
  const endIndex = startIndex + STORIES_PER_PAGE;
  const currentPageIDs = storyIDs.slice(startIndex, endIndex);

  const stories = await getStoriesByIDs(currentPageIDs);

  return (
    <main>
      {stories.map((story, index) => {
        const url = story.url ? new URL(story.url) : null;

        return (
          <div className="leading-none mb-4" key={story.id}>
            <a
              title={story.title}
              href={story.url || `/${story.id}`}
              target={url?.host ? "_blank" : ""}
              className="pb-1 whitespace-nowrap text-ellipsis overflow-hidden block font-bold visited:text-slate-500"
            >
              {index + 1}. {story.title}
            </a>
            <div className="text-xs text-slate-700">
              {url?.host ? `${url?.host} - ` : ""}{" "}
              <Link href={`/${story.id}`}>
                {story.score} poäng - {story.descendants || "Inga"} kommentarer
                - {Math.floor(Date.now() / 1000 - story.time)} sekunder sedan
              </Link>
            </div>
          </div>
        );
      })}
    </main>
  );
}
