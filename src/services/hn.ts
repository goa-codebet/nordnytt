import { Comment, Story } from "@/types";
import { HN_API_BASE, CACHE_TIME, STORIES_PER_PAGE } from "@/lib/constants";

// Fetch top story IDs
export const getTopStoryIDs = async (): Promise<number[]> => {
  try {
    const res = await fetch(`${HN_API_BASE}/topstories.json`, {
      next: { revalidate: CACHE_TIME },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch top stories");
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Fetch multiple stories by IDs
export const getStoriesByIDs = async (ids: number[]): Promise<Story[]> => {
  if (!ids.length) return [];
  try {
    const fetches = ids.map(id =>
      fetch(`${HN_API_BASE}/item/${id}.json`, {
        next: { revalidate: CACHE_TIME },
      })
        .then(res => res.ok ? res.json() : null)
        .catch(error => {
          console.error(error);
          return null;
        })
    );

    const stories = await Promise.all(fetches);
    return stories.filter(story => story && story.id); // filter out null values
  } catch (error) {
    console.error("Error fetching stories:", error);
    return [];
  }
}

export const getStory = async (id: number): Promise<Story> => {
  return await fetch(`${HN_API_BASE}/item/${id}.json`, {
    next: {
      revalidate: 120
    }
  })
    .then(res => res.json());
}

export const getComment = async (id: number): Promise<Comment> => {
  return await fetch(`${HN_API_BASE}/item/${id}.json`, {
    next: {
      revalidate: 120
    }
  })
    .then(res => res.json());
}
