import { encode } from "@jsquash/webp";

async function loadImage(src: File) {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(src);
  await new Promise((resolve) => (img.onload = resolve));
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  [canvas.width, canvas.height] = [img.width, img.height];
  ctx?.drawImage(img, 0, 0);
  return ctx?.getImageData(0, 0, img.width, img.height);
}

export async function compressImage(image: File): Promise<File> {
  try {
    const rawImageData = await loadImage(image);
    if (!rawImageData) {
      throw new Error("Failed to load image");
    }
    const webpBuffer = await encode(rawImageData);
    console.log("webpBuffer của file", image.name);
    console.log(webpBuffer);
    // convert webpBuffer to webp file
    const webpFile = new File([webpBuffer], `${image.name.split(".")[0]}.webp`, {
      type: "image/webp",
    });
    return webpFile;
  } catch (error) {
    console.error("Error compressing image", error);
    throw error;
  }
}
