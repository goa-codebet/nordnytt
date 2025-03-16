import { getTopStoryIDs, getStoriesByIDs } from "@/services/hn";
import { STORIES_PER_PAGE } from "@/lib/constants";
import StoriesList from "@/app/components/StoriesList";
import { Story } from "@/types";
import Paginator from "@/app/components/Paginator";

const NO_STORIES_MESSAGE = "No stories available.";

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  let page = parseInt(searchParams.page || "1");
  const { totalPages, storyIDs } = await fetchPageIDs(page);

  if (page < 1 || page > totalPages) {
    page = 1;
  }

  const stories = await fetchPageData(page, storyIDs ?? []);

  return (
    <main>
      {stories.length > 0 ? (
        <>
          <StoriesList stories={stories} page={page} />
          <Paginator page={page} total={totalPages} />
        </>
      ) : (
        <>
          <p className="text-center">{NO_STORIES_MESSAGE}</p>
          <Paginator page={page} total={totalPages} />
        </>
      )}
    </main>
  );
}

async function fetchPageIDs(page: number) {
  const storyIDs = await getTopStoryIDs();
  if (!storyIDs.length) return { stories: [], totalPages: 0 };
  const totalPages = Math.ceil(storyIDs.length / STORIES_PER_PAGE);
  return { totalPages, storyIDs: storyIDs };
}

async function fetchPageData(page: number, storyIDs: number[]) {
  const startIndex = (page - 1) * STORIES_PER_PAGE;
  const endIndex = startIndex + STORIES_PER_PAGE;
  const currentPageIDs = storyIDs.slice(startIndex, endIndex);

  const stories = await getStoriesByIDs(currentPageIDs);
  return stories;
}
