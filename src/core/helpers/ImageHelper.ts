export function ImageHelper(NameFile: string | undefined | null) {
  if (!NameFile || NameFile === "default/Default.jpeg") {
    return "/images/dummy-image.jpg";
  }
  return `${import.meta.env.VITE_API_BASE_URL}${NameFile.startsWith('/') ? NameFile.slice(1) : NameFile}`;
}
