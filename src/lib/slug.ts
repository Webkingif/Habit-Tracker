export function getHabitSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // replace one or more spaces with a single hyphen
    .replace(/[^a-z0-9-]/g, '');    // remove non-alphanumeric characters except hyphens
}
