export function truncateText(text: string, maxLength = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

export function camelCaseToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

export function snakeCaseToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}
