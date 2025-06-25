export function ImageHelper(NameFile: string | undefined | null) {
  if (!NameFile) {
    return "/images/dummy-image.jpg";
  }
  return `${import.meta.env.VITE_API_BASE_URL}${NameFile}`;
}
