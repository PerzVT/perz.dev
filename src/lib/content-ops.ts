/**
 * Edits to content/portfolio/pages.json, as plain operations. The local
 * editor, the dev API route and anything that can POST JSON share these.
 *
 * A path is a slash-separated address into the document. A segment of the
 * form `slug:name` picks the array item whose `slug` is `name`, so paths stay
 * valid when projects are reordered: `projects/slug:supercat/sections/0/body`.
 */
export type ContentPath = string;
export type ContentOp =
  | { op: "setText"; path: ContentPath; value: string }
  | { op: "setLines"; path: ContentPath; value: string[] }
  | { op: "move"; list: ContentPath; from: number; to: number }
  | { op: "transfer"; from: { list: ContentPath; index: number }; to: { list: ContentPath; index: number } }
  | { op: "remove"; list: ContentPath; index: number };

type Doc = Record<string, unknown>;

export class ContentError extends Error {}

function step(node: unknown, segment: string, path: string): unknown {
  if (Array.isArray(node)) {
    if (segment.startsWith("slug:")) {
      const slug = segment.slice(5);
      const found = node.find(item => (item as { slug?: string })?.slug === slug);
      if (!found) throw new ContentError(`No item with slug "${slug}" in ${path}.`);
      return found;
    }
    const index = Number(segment);
    if (!Number.isInteger(index) || index < 0 || index >= node.length) throw new ContentError(`Index ${segment} is out of range in ${path}.`);
    return node[index];
  }
  if (node && typeof node === "object" && segment in node) return (node as Doc)[segment];
  throw new ContentError(`"${segment}" does not exist in ${path || "the document"}.`);
}

/** The parent container and final key of a path, so a value can be replaced. */
function locate(doc: Doc, path: ContentPath): { parent: unknown; key: string | number } {
  const segments = path.split("/").filter(Boolean);
  if (!segments.length) throw new ContentError("The path is empty.");
  let node: unknown = doc;
  for (let i = 0; i < segments.length - 1; i++) node = step(node, segments[i], segments.slice(0, i).join("/"));
  const last = segments[segments.length - 1];
  if (Array.isArray(node)) {
    const index = Number(last);
    if (!Number.isInteger(index) || index < 0 || index >= node.length) throw new ContentError(`Index ${last} is out of range in ${path}.`);
    return { parent: node, key: index };
  }
  if (!node || typeof node !== "object" || !(last in node)) throw new ContentError(`${path} does not exist.`);
  return { parent: node, key: last };
}

export function read(doc: Doc, path: ContentPath): unknown {
  const { parent, key } = locate(doc, path);
  return (parent as Record<string | number, unknown>)[key];
}

function mediaList(doc: Doc, path: ContentPath): Record<string, unknown>[] {
  const list = read(doc, path);
  if (!Array.isArray(list) || !list.every(item => item && typeof item === "object" && typeof (item as Doc).src === "string"))
    throw new ContentError(`${path} is not a list of images.`);
  return list as Record<string, unknown>[];
}

const within = (index: number, length: number, path: string) => {
  if (!Number.isInteger(index) || index < 0 || index > length) throw new ContentError(`Position ${index} is out of range in ${path}.`);
};

/** Applies one operation in place and returns a short description of it. */
export function apply(doc: Doc, op: ContentOp): string {
  switch (op.op) {
    case "setText": {
      const { parent, key } = locate(doc, op.path);
      const current = (parent as Record<string | number, unknown>)[key];
      if (typeof current !== "string") throw new ContentError(`${op.path} holds ${Array.isArray(current) ? "a list" : typeof current}, not text.`);
      if (typeof op.value !== "string") throw new ContentError("The new value must be text.");
      (parent as Record<string | number, unknown>)[key] = op.value;
      return `Set ${op.path}`;
    }
    case "setLines": {
      const { parent, key } = locate(doc, op.path);
      const current = (parent as Record<string | number, unknown>)[key];
      if (!Array.isArray(current) || !current.every(line => typeof line === "string")) throw new ContentError(`${op.path} is not a list of lines.`);
      if (!Array.isArray(op.value) || !op.value.every(line => typeof line === "string")) throw new ContentError("The new value must be a list of lines.");
      (parent as Record<string | number, unknown>)[key] = op.value.map(line => line.trim()).filter(Boolean);
      return `Set ${op.path}`;
    }
    case "move": {
      const list = mediaList(doc, op.list);
      within(op.from, list.length - 1, op.list);
      within(op.to, list.length - 1, op.list);
      const [item] = list.splice(op.from, 1);
      list.splice(op.to, 0, item);
      return `Moved image ${op.from + 1} to ${op.to + 1} in ${op.list}`;
    }
    case "transfer": {
      const from = mediaList(doc, op.from.list), to = mediaList(doc, op.to.list);
      within(op.from.index, from.length - 1, op.from.list);
      const [item] = from.splice(op.from.index, 1);
      within(op.to.index, to.length, op.to.list);
      to.splice(op.to.index, 0, item);
      return `Moved an image from ${op.from.list} to ${op.to.list}`;
    }
    case "remove": {
      const list = mediaList(doc, op.list);
      within(op.index, list.length - 1, op.list);
      list.splice(op.index, 1);
      return `Removed image ${op.index + 1} from ${op.list}`;
    }
    default:
      throw new ContentError(`Unknown operation "${(op as { op?: string }).op}".`);
  }
}
