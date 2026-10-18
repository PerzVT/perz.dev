/** Marks text as editable by the local content editor; production gets no attributes. */
export function editable(path: string, value: string | string[]) {
  if (process.env.NODE_ENV !== "development") return {};
  return {
    "data-edit-path": path,
    "data-edit-kind": Array.isArray(value) ? "lines" : "text",
    "data-edit-value": Array.isArray(value) ? value.join("\n") : value,
  };
}
