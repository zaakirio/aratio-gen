export interface AspectRatio {
  width: number;
  height: number;
  label: string;
}

export interface ImageFormat {
  extension: string;
  mimeType: string;
}

export interface GenerationOptions {
  aspectRatios: AspectRatio[];
  numberOfAssets: number;
  format: ImageFormat;
  baseWidth: number;
  outputDir: string;
}

export const PRESET_ASPECT_RATIOS: AspectRatio[] = [
  { width: 9, height: 16, label: '9:16' },
  { width: 2, height: 3, label: '2:3' },
  { width: 3, height: 4, label: '3:4' },
  { width: 4, height: 5, label: '4:5' },
  { width: 1, height: 1, label: '1:1' },
  { width: 4, height: 3, label: '4:3' },
  { width: 3, height: 2, label: '3:2' },
  { width: 16, height: 9, label: '16:9' },
];

export const IMAGE_FORMATS: Record<string, ImageFormat> = {
  PNG: { extension: 'png', mimeType: 'image/png' },
  JPEG: { extension: 'jpeg', mimeType: 'image/jpeg' },
  GIF: { extension: 'gif', mimeType: 'image/gif' },
  BMP: { extension: 'bmp', mimeType: 'image/bmp' },
  TIFF: { extension: 'tiff', mimeType: 'image/tiff' },
};