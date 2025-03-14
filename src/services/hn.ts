import { Comment, Story } from "@/types";

export const getTopStories = async ():Promise<Story[]> => {
  const topstories:number[] = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
    next: {
      revalidate: 120
    }
  }).then(res => res.json());
  
  //Ändrar från 10 resultat till 100 i mappen
  return Promise.all(topstories.splice(0, 100).map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
    next: {
      revalidate: 120
    }
  }).then(res => res.json())))
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
