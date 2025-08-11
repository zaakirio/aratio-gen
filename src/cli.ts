import { input, select, checkbox, number } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PRESET_ASPECT_RATIOS, IMAGE_FORMATS, VIDEO_FORMATS, AspectRatio, ImageFormat, VideoFormat, GenerationOptions } from './types.js';
import { ImageGenerator } from './imageGenerator.js';
import { VideoGenerator } from './videoGenerator.js';

export class CLI {
  private imageGenerator: ImageGenerator;
  private videoGenerator: VideoGenerator;

  constructor() {
    this.imageGenerator = new ImageGenerator();
    this.videoGenerator = new VideoGenerator();
  }

  private async displayWelcome(): Promise<void> {
    console.log(chalk.cyan('\n╔════════════════════════════════════════╗'));
    console.log(chalk.cyan('║       ARATIO-GEN - Media Generator     ║'));
    console.log(chalk.cyan('║  Generate images & videos with ratios  ║'));
    console.log(chalk.cyan('╚════════════════════════════════════════╝\n'));
  }

  private async selectMediaType(): Promise<'image' | 'video'> {
    const mediaType = await select({
      message: 'What type of media do you want to generate?',
      choices: [
        { name: '🖼️  Images', value: 'image' },
        { name: '🎬  Videos (MP4)', value: 'video' },
      ],
    });

    return mediaType as 'image' | 'video';
  }

  private async selectAspectRatios(): Promise<AspectRatio[]> {
    const choices = PRESET_ASPECT_RATIOS.map(ratio => ({
      name: `${ratio.label} (${ratio.width}:${ratio.height})`,
      value: ratio,
      checked: false,
    }));

    const selected = await checkbox({
      message: 'Select aspect ratios to generate:',
      choices,
      validate: (answer) => {
        if (answer.length === 0) {
          return 'Please select at least one aspect ratio';
        }
        return true;
      },
    });

    return selected;
  }

  private async selectNumberOfAssets(): Promise<number> {
    const num = await number({
      message: 'How many assets per aspect ratio?',
      default: 1,
      min: 1,
      max: 100,
      validate: (value) => {
        if (!value || value < 1) {
          return 'Please enter a number greater than 0';
        }
        if (value > 100) {
          return 'Maximum 100 assets per aspect ratio';
        }
        return true;
      },
    });

    return num || 1;
  }

  private async selectImageFormat(): Promise<ImageFormat> {
    const format = await select({
      message: 'Select image format:',
      choices: Object.entries(IMAGE_FORMATS).map(([key, value]) => ({
        name: key,
        value,
      })),
    });

    return format;
  }

  private async selectVideoFormat(): Promise<VideoFormat> {
    const format = await select({
      message: 'Select video format:',
      choices: Object.entries(VIDEO_FORMATS).map(([key, value]) => ({
        name: key,
        value,
      })),
    });

    return format;
  }

  private async selectVideoDuration(): Promise<number> {
    const duration = await number({
      message: 'Enter video duration (in seconds):',
      default: 3,
      min: 1,
      max: 30,
      validate: (value) => {
        if (!value || value < 1) {
          return 'Duration must be at least 1 second';
        }
        if (value > 30) {
          return 'Duration must be at most 30 seconds';
        }
        return true;
      },
    });

    return duration || 3;
  }

  private async selectVideoFps(): Promise<number> {
    const fps = await select({
      message: 'Select frames per second (FPS):',
      choices: [
        { name: '24 FPS (Cinematic)', value: 24 },
        { name: '30 FPS (Standard)', value: 30 },
        { name: '60 FPS (Smooth)', value: 60 },
      ],
    });

    return fps;
  }

  private async selectBaseWidth(): Promise<number> {
    const width = await number({
      message: 'Enter base width for images (in pixels):',
      default: 800,
      min: 100,
      max: 4000,
      validate: (value) => {
        if (!value || value < 100) {
          return 'Width must be at least 100 pixels';
        }
        if (value > 4000) {
          return 'Width must be at most 4000 pixels';
        }
        return true;
      },
    });

    return width || 800;
  }

  private async selectOutputDirectory(): Promise<string> {
    const dir = await input({
      message: 'Enter output directory:',
      default: './generated-images',
      validate: async (value) => {
        if (!value) {
          return 'Please enter a directory path';
        }
        return true;
      },
    });

    const absolutePath = path.resolve(dir);
    await fs.mkdir(absolutePath, { recursive: true });
    return absolutePath;
  }

  private displaySummary(options: GenerationOptions): void {
    console.log(chalk.yellow('\n📋 Generation Summary:'));
    console.log(chalk.white(`  • Media Type: ${options.mediaType.toUpperCase()}`));
    console.log(chalk.white(`  • Aspect Ratios: ${options.aspectRatios.map(r => r.label).join(', ')}`));
    console.log(chalk.white(`  • Assets per ratio: ${options.numberOfAssets}`));
    console.log(chalk.white(`  • Format: ${options.format.extension.toUpperCase()}`));
    console.log(chalk.white(`  • Base width: ${options.baseWidth}px`));
    if (options.mediaType === 'video') {
      console.log(chalk.white(`  • Duration: ${options.videoDuration}s`));
      console.log(chalk.white(`  • FPS: ${options.videoFps}`));
    }
    console.log(chalk.white(`  • Output: ${options.outputDir}\n`));
  }

  public async run(): Promise<void> {
    try {
      await this.displayWelcome();

      const mediaType = await this.selectMediaType();
      const aspectRatios = await this.selectAspectRatios();
      const numberOfAssets = await this.selectNumberOfAssets();
      
      let format: ImageFormat | VideoFormat;
      let videoDuration: number | undefined;
      let videoFps: number | undefined;
      
      if (mediaType === 'video') {
        format = await this.selectVideoFormat();
        videoDuration = await this.selectVideoDuration();
        videoFps = await this.selectVideoFps();
      } else {
        format = await this.selectImageFormat();
      }
      
      const baseWidth = await this.selectBaseWidth();
      const outputDir = await this.selectOutputDirectory();

      const options: GenerationOptions = {
        aspectRatios,
        numberOfAssets,
        format,
        baseWidth,
        outputDir,
        mediaType,
        videoDuration,
        videoFps,
      };

      this.displaySummary(options);

      const totalAssets = aspectRatios.length * numberOfAssets;
      const assetType = mediaType === 'video' ? 'videos' : 'images';
      const spinner = ora(`Generating ${totalAssets} ${assetType}...`).start();

      const generatedFiles: string[] = [];

      for (const aspectRatio of aspectRatios) {
        for (let i = 0; i < numberOfAssets; i++) {
          spinner.text = `Generating ${aspectRatio.label} ${mediaType} ${i + 1}/${numberOfAssets}...`;
          
          let filepath: string;
          if (mediaType === 'video') {
            filepath = await this.videoGenerator.generateVideo(
              aspectRatio,
              baseWidth,
              format as VideoFormat,
              outputDir,
              i,
              videoDuration,
              videoFps
            );
          } else {
            filepath = await this.imageGenerator.generateImage(
              aspectRatio,
              baseWidth,
              format as ImageFormat,
              outputDir,
              i
            );
          }
          
          generatedFiles.push(filepath);
        }
      }

      spinner.succeed(chalk.green(`Successfully generated ${totalAssets} ${assetType}!`));

      console.log(chalk.cyan('\n✨ Generated files:'));
      generatedFiles.forEach(file => {
        console.log(chalk.white(`  • ${path.basename(file)}`));
      });

      console.log(chalk.green(`\n✅ All ${assetType} saved to: ${outputDir}`));
      console.log(chalk.yellow('\nThank you for using aratio-gen! 🎨\n'));

    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  }
}