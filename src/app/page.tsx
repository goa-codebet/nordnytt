import Link from "next/link";

interface PageProps {
  searchParams: {
    page?: string;
  };
}

export default async function Home({ searchParams }: PageProps) {
  const currentPage = parseInt(searchParams.page || "1", 10);

  // Fetch the complete list of top story IDs from HackerNews
  const allIds: number[] = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    { next: { revalidate: 120 } }
  ).then((res) => res.json());

  const topstories = await Promise.all(
    allIds.splice(0, 10).map((id) =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        next: { revalidate: 120 },
      }).then((res) => res.json())
    )
  );

  return (
    <main>
      <p>Current Page: {currentPage}</p>
      {topstories.map((story: any, index: number) => {
        const url = story.url ? new URL(story.url) : null;
        return (
          <div key={story.id} className="leading-none mb-4">
            <a
              title={story.title}
              href={story.url || `/${story.id}`}
              target={url?.host ? "_blank" : ""}
              className="pb-1 whitespace-nowrap text-ellipsis overflow-hidden block font-bold visited:text-slate-500"
            >
              {index + 1}. {story.title}
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
