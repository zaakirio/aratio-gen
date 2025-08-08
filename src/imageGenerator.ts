import Jimp from 'jimp';
import path from 'node:path';
import { AspectRatio, ImageFormat } from './types.js';

export class ImageGenerator {
  private getRandomColor(): number {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return Jimp.rgbaToInt(r, g, b, 255);
  }

  private calculateDimensions(aspectRatio: AspectRatio, baseWidth: number): { width: number; height: number } {
    const width = baseWidth;
    const height = Math.round((baseWidth * aspectRatio.height) / aspectRatio.width);
    return { width, height };
  }

  private createRandomPixelPattern(image: Jimp): void {
    const pixelSize = 10;
    const width = image.getWidth();
    const height = image.getHeight();

    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        const color = this.getRandomColor();
        for (let py = y; py < Math.min(y + pixelSize, height); py++) {
          for (let px = x; px < Math.min(x + pixelSize, width); px++) {
            image.setPixelColor(color, px, py);
          }
        }
      }
    }
  }

  public async generateImage(
    aspectRatio: AspectRatio,
    baseWidth: number,
    format: ImageFormat,
    outputDir: string,
    index: number
  ): Promise<string> {
    const { width, height } = this.calculateDimensions(aspectRatio, baseWidth);
    
    const image = new Jimp(width, height, 0xFFFFFFFF);
    
    this.createRandomPixelPattern(image);
    
    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);
    const text = aspectRatio.label;
    const textWidth = Jimp.measureText(font, text);
    const textHeight = Jimp.measureTextHeight(font, text, width);
    
    const bgPadding = 80;
    const bgWidth = textWidth + bgPadding;
    const bgHeight = textHeight + bgPadding;
    const bgX = Math.floor((width - bgWidth) / 2);
    const bgY = Math.floor((height - bgHeight) / 2);
    
    for (let y = bgY; y < bgY + bgHeight && y < height; y++) {
      for (let x = bgX; x < bgX + bgWidth && x < width; x++) {
        const currentColor = image.getPixelColor(x, y);
        const rgba = Jimp.intToRGBA(currentColor);
        const newColor = Jimp.rgbaToInt(
          Math.floor(rgba.r * 0.2 + 255 * 0.8),
          Math.floor(rgba.g * 0.2 + 255 * 0.8),
          Math.floor(rgba.b * 0.2 + 255 * 0.8),
          255
        );
        image.setPixelColor(newColor, x, y);
      }
    }
    
    image.print(
      font,
      0,
      0,
      {
        text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      width,
      height
    );
    
    const dimensionText = `${width}x${height}`;
    const smallFont = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    image.print(
      smallFont,
      0,
      height - 80,
      {
        text: dimensionText,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      width,
      60
    );
    
    const filename = `aratio-gen_${aspectRatio.label.replace(':', 'x')}_${index + 1}.${format.extension}`;
    const filepath = path.join(outputDir, filename);
    
    await image.writeAsync(filepath);
    
    return filepath;
  }
}