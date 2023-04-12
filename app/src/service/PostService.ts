import PocketBase from 'pocketbase'

const PostsCollection = "posts";
const ServicePath = "http://127.0.0.1:8090/";
const pb = new PocketBase(ServicePath);

export interface Post {
  id: string;
  text: string;
  gist: string;
  tags: string;
}

export async function savePost(text: string, gist: string, tags: string): Promise<string> {
  return pb.collection(PostsCollection).create({
    text,
    gist,
    tags
  })
}

export async function getRecentPost(): Promise<Post | null> {
  const resp = await pb.collection(PostsCollection).getList<Post>(0, 1, {
    sort: "-created"
  });

  return resp.items.length > 0 ? resp.items[0] : null;
}

export async function getPost(id: string): Promise<Post | null> {
  return await pb.collection(PostsCollection).getOne(id);
}