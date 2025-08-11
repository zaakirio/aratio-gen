import { createCanvas, SKRSContext2D } from '@napi-rs/canvas';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import fs from 'node:fs';
import path from 'node:path';
import { AspectRatio, VideoFormat } from './types.js';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export class VideoGenerator {
  private generateRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  private createPixelShuffleFrame(
    ctx: SKRSContext2D,
    width: number,
    height: number,
    frameNumber: number
  ): void {
    const pixelSize = 10;
    const cols = Math.ceil(width / pixelSize);
    const rows = Math.ceil(height / pixelSize);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const shouldShuffle = Math.random() > 0.7;
        
        if (shouldShuffle) {
          ctx.fillStyle = this.generateRandomColor();
        } else {
          const hue = (frameNumber * 2 + row * 10 + col * 10) % 360;
          ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        }
        
        ctx.fillRect(
          col * pixelSize,
          row * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = `${Math.min(width, height) / 10}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `${width}x${height}`,
      width / 2,
      height / 2
    );
    
    ctx.font = `${Math.min(width, height) / 15}px Arial`;
    ctx.fillText(
      `Frame ${frameNumber}`,
      width / 2,
      height / 2 + Math.min(width, height) / 8
    );
  }

  private async generateFrames(
    width: number,
    height: number,
    frameCount: number,
    tempDir: string
  ): Promise<string[]> {
    const framePaths: string[] = [];
    
    for (let i = 0; i < frameCount; i++) {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      
      this.createPixelShuffleFrame(ctx, width, height, i + 1);
      
      const framePath = path.join(tempDir, `frame_${String(i).padStart(4, '0')}.png`);
      const buffer = canvas.toBuffer('image/png');
      await fs.promises.writeFile(framePath, buffer);
      framePaths.push(framePath);
    }
    
    return framePaths;
  }

  public async generateVideo(
    aspectRatio: AspectRatio,
    baseWidth: number,
    format: VideoFormat,
    outputDir: string,
    index: number,
    duration: number = 3,
    fps: number = 30
  ): Promise<string> {
    // Ensure width is even (required by many video codecs)
    const width = baseWidth % 2 === 0 ? baseWidth : baseWidth + 1;
    // Calculate height and ensure it's even
    let height = Math.round((width * aspectRatio.height) / aspectRatio.width);
    height = height % 2 === 0 ? height : height + 1;
    const frameCount = duration * fps;
    
    const tempDir = path.join(outputDir, '.temp', `video_${Date.now()}`);
    await fs.promises.mkdir(tempDir, { recursive: true });
    
    try {
      await this.generateFrames(width, height, frameCount, tempDir);
      
      const filename = `video_${aspectRatio.label.replace(':', 'x')}_${width}x${height}_${index + 1}.${format.extension}`;
      const outputPath = path.join(outputDir, filename);
      
      return new Promise((resolve, reject) => {
        const framePattern = path.join(tempDir, 'frame_%04d.png');
        
        let command = ffmpeg()
          .input(framePattern)
          .inputOptions(['-framerate', String(fps)])
          .outputOptions([
            '-c:v', 'libx264',
            '-pix_fmt', 'yuv420p',
            '-crf', '23',
            '-preset', 'medium'
          ])
          .fps(fps);
        
        if (format.extension === 'mp4') {
          command = command.outputOptions(['-movflags', '+faststart']);
        } else if (format.extension === 'webm') {
          command = command.outputOptions([
            '-c:v', 'libvpx-vp9',
            '-crf', '30',
            '-b:v', '0'
          ]);
        } else if (format.extension === 'avi') {
          command = command.outputOptions([
            '-c:v', 'mpeg4',
            '-vtag', 'xvid',
            '-q:v', '5'
          ]);
        }
        
        command
          .on('error', (err) => {
            console.error('FFmpeg error:', err);
            reject(err);
          })
          .on('end', () => {
            fs.promises.rm(tempDir, { recursive: true, force: true })
              .then(() => resolve(outputPath))
              .catch(console.error);
          })
          .save(outputPath);
      });
    } catch (error) {
      await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(console.error);
      throw error;
    }
  }
}