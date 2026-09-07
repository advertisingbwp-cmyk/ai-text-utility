export interface TabsToSpacesOptions {
  direction?: "tabs-to-spaces" | "spaces-to-tabs";
  spacesPerTab?: number;
}

export function convertTabsAndSpaces(
  input: string,
  options: TabsToSpacesOptions = {}
): string {
  if (!input) return "";
  const direction = options.direction || "tabs-to-spaces";
  const count = Math.max(1, Math.min(8, options.spacesPerTab ?? 2));
  const spaces = " ".repeat(count);

  if (direction === "tabs-to-spaces") {
    return input.replace(/\t/g, spaces);
  } else {
    const regex = new RegExp(spaces, "g");
    return input.replace(regex, "\t");
  }
}
