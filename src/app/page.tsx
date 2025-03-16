import { getTopStoryIDs, getStoriesByIDs } from "@/services/hn";
import { STORIES_PER_PAGE } from "@/lib/constants";
import StoriesList from "@/app/components/StoriesList";
import { Story } from "@/types";

const NO_STORIES_MESSAGE = "No stories available.";

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  let page = parseInt(searchParams.page || "1");
  const stories = await getStories(page, 0);

  return (
    <main>
      {stories.length > 0 ? (
        <StoriesList stories={stories} page={page} />
      ) : (
        <p className="text-center">{NO_STORIES_MESSAGE}</p>
      )}
    </main>
  );
}

// function for getting the stories
async function getStories(
  page: number,
  storyIDcount: number
): Promise<Story[]> {
  const storyIDs = await getTopStoryIDs();
  if (!storyIDs.length) return [];

  const startIndex = (page - 1) * STORIES_PER_PAGE;
  const endIndex = startIndex + STORIES_PER_PAGE;
  const currentPageIDs = storyIDs.slice(startIndex, endIndex);

  const stories = await getStoriesByIDs(currentPageIDs);
  if (!stories.length) return [];

  return stories;
}
