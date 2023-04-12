const ServicePath = "http://localhost:8000/ai"

export interface Tag {
  tag: string;
  selected: boolean;
}

interface TagsResponse {
  labels: string[];
  scores: number[];
}

interface SummaryResponse {
  summary_text: string
}

export async function getTags(text: string): Promise<Tag[]> {
  const request = await fetch(`${ServicePath}/tags?text=${text}&labels=javascript,web,ai,frontend,react,solid`);
  const data = await request.json() as TagsResponse;
  
  return data.labels.slice(0, 3).map(it => ({
    tag: it,
    selected: false
  }));
}

export async function getSummary(text: string): Promise<string> {
  const request = await fetch(`${ServicePath}/summarize?text=${text}`);
  const data = await request.json() as SummaryResponse[];
  return data[0].summary_text;

}