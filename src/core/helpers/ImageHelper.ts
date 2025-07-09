export function ImageHelper(NameFile: string | File | undefined | null) {
  if (!NameFile || NameFile === "default/Default.jpeg") {
    return "/images/dummy-image.jpg";
  }
  if (typeof NameFile === "string") {
    return `${import.meta.env.VITE_BASE_STORAGE}${NameFile.startsWith('/') ? NameFile.slice(1) : NameFile}`;
  }
  if (typeof File !== "undefined" && NameFile instanceof File) {
    return URL.createObjectURL(NameFile);
  }
  return "/images/dummy-image.jpg";
}