import Link from "next/link";
import { Story } from "@/types";

interface PageProps {
  searchParams: {
    page?: string;
  };
}

export default async function Home({ searchParams }: PageProps) {
  const pageSize = 10;
  const currentPage = parseInt(searchParams.page || "1", 10);

  // Fetch full list of top story IDs
  const allIds: number[] = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    { next: { revalidate: 120 } }
  ).then((res) => res.json());

  // Calculate total pages and determine the current slice
  const totalPages = Math.ceil(allIds.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentIds = allIds.slice(startIndex, startIndex + pageSize);

  // Fetch the stories for the current page with proper type
  const topstories: Story[] = await Promise.all(
    currentIds.map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        next: { revalidate: 120 },
      }).then((res) => res.json())
    )
  );

  return (
    <main>
      <p>
        Current Page: {currentPage} of {totalPages}
      </p>
      {topstories.map((story, index) => {
        const url = story.url ? new URL(story.url) : null;
        return (
          <div key={story.id} className="leading-none mb-4">
            <a
              title={story.title}
              href={story.url || `/${story.id}`}
              target={url?.host ? "_blank" : ""}
              className="pb-1 whitespace-nowrap text-ellipsis overflow-hidden block font-bold visited:text-slate-500"
            >
              {startIndex + index + 1}. {story.title}
            </a>
            <div className="text-xs text-slate-700">
              {url?.host ? `${url.host} - ` : ""} 
              <Link href={`/${story.id}`}>
                {story.score} poäng - {story.descendants || "Inga"} kommentarer -{" "}
                {Math.floor(Date.now() / 1000 - story.time)} sekunder sedan
              </Link>
            </div>
          </div>
        );
      })}
    </main>
  );
}
