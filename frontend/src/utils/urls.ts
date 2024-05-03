export function extractCodeFromUrl(
  url: string,
  paramName: string
): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(paramName);
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}
