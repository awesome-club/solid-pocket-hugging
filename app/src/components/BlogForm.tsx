import { Index, Show, createSignal } from "solid-js";
import "./BlogForm.scss";
import { Tag, getSummary, getTags } from "../service/AiService";
import { savePost } from "../service/PostService";

export function BlogForm() {
  const [text, setText] = createSignal("");
  const [gist, setGist] = createSignal("");
  const [tags, setTags] = createSignal<Tag[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [isAnalyzed, setAnalyzed] = createSignal();

  async function save() {
    const selected = tags()
      .filter(it => it.selected)
      .map(it => it.tag)
      .join(",");
    await savePost(text(), gist(), selected);
    setLoading(false);
    window.location.href = "/";
  }

  function analyze() {
    Promise.all([
      getSummary(text()),
      getTags(text())
    ]).then(values => {
      setGist(values[0]);
      setTags(values[1]);
      setAnalyzed(true);
      setLoading(false);
    });
  }

  async function post() {
    setLoading(true);
    isAnalyzed() ? await save() : analyze();
  }

  function toggleTag(tag: Tag) {
    tag.selected = !tag.selected;
    setTags([...tags()]);
    console.log(tags());
  }

  return <div class="form">
    <div class="content">
      <h3>Write Your Story</h3>
      
      <textarea maxLength={"1000"} value={text()} onChange={ev => setText(ev.target.value)} />
      
      <Show when={tags().length > 0}>
        <ul class="tags">
          {tags().map(it => 
            <li>
            <span class={`tag ${it.selected ? "sel" : ""}`} onClick={() => toggleTag(it)}>
              {it.tag}
            </span>
          </li>)}
        </ul>
      </Show>

      <Show when={gist().length > 0}>
        <section class="tldr">
          <h3>Gist</h3>
          <p>{gist()}</p>
        </section>
      </Show>

      <button class="btn" onClick={post}>
        {loading() ? "Saving..." : "Post"}
      </button>
    </div>
  </div>
}