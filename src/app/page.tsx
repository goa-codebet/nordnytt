import { getTopStories } from "@/services/hn";
import Link from "next/link";

export default async function Home({ searchParams }: { searchParams: { page?: string } }) {

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const pageSize = 10;

  const topstories = await getTopStories(page, pageSize);

  const totalStories = 500;
  const totalPages = Math.ceil(totalStories / pageSize );


  return (
    <main>
      { topstories.map((story, index) => {
        const url = story.url ? new URL(story.url) : null;

        return (
          <div className="leading-none mb-4" key={story.id}>
            <a title={story.title} href={story.url || `/${story.id}`} target={url?.host ? "_blank" : ""} className="pb-1 whitespace-nowrap text-ellipsis overflow-hidden block font-bold visited:text-slate-500">{index+1}. {story.title}</a>
            <div className="text-xs text-slate-700">{url?.host ? `${url?.host} - ` : ''} <Link href={`/${story.id}`}>{story.score} poäng - {story.descendants || 'Inga'} kommentarer - {Math.floor(Date.now()/1000 - story.time)} sekunder sedan</Link></div>
          </div>
        )
      }) }
      
      <div className="flex justify-between items-center mt-6 pb-4">
        {page > 1 ? (
          <Link href={`/?page=${page - 1}`} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Föregående
          </Link>
        ) : (
          <div className="w-[90px]"></div>
        )}

        <span className="flex-grow text-center text-sm text-gray-700">
          Sida {page} av {totalPages}
        </span>

        {page < totalPages ? (
          <Link href={`/?page=${page + 1}`} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Nästa
          </Link>
        ) : (
          <div className="w-[90px]"></div>
        )}
      </div>
    </main>
  );
}
