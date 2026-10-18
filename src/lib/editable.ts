/** Marks text as editable by the local content editor; production gets no attributes. */
export function editable(path: string, value: string | string[]) {
  if (process.env.NODE_ENV !== "development") return {};
  return {
    "data-edit-path": path,
    "data-edit-kind": Array.isArray(value) ? "lines" : "text",
    "data-edit-value": Array.isArray(value) ? value.join("\n") : value,
  };
}

/** Marks a media list for the local editor, which draws its thumbnail strip here. */
export function editableList(path: string, label: string, items: { src: string; alt?: string; video?: string }[]) {
  if (process.env.NODE_ENV !== "development") return {};
  return { "data-edit-list": path, "data-edit-label": label, "data-edit-items": JSON.stringify(items.map(({ src, alt, video }) => ({ src, alt, video }))) };
}
