import { Comment, Story } from "@/types";

export const getTopStories = async ():Promise<Story[]> => {
  const topstories:number[] = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
    next: {
      revalidate: 120
    }
  }).then(res => res.json());
  
  return Promise.all(topstories.splice(0, 10).map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
    next: {
      revalidate: 120
    }
  }).then(res => res.json())))
}

// we get all stories but we only return 10 of them depending on the page number that we send in also return total pages.
export const getAllStories = async (page:number): Promise<{stories:Story[]; totalPages:number}> => {
  const allstories:number[] = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
    next: {
      revalidate: 120
    }
  }).then(res => res.json());

  const totalStories = allstories.length
  const totalPages = Math.ceil(totalStories / 10)

  const stories:Story[] = await Promise.all(allstories.slice((page -1) * 10, page * 10).map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`,{
      next: {
        revalidate: 120
      }
    }).then(res => res.json())))

  return {stories, totalPages}
}


export const getStory = async (id:number):Promise<Story> => {
  return await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
    next: {
      revalidate: 120
    }
  })
    .then(res => res.json());
}

export const getComment = async (id:number):Promise<Comment> => {
  return await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
    next: {
      revalidate: 120
    }
  })
    .then(res => res.json());
}

