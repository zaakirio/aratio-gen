#!/usr/bin/env node

import { VideoGenerator } from './dist/videoGenerator.js';
import path from 'path';
import fs from 'fs/promises';

async function testVideoGeneration() {
  console.log('🎬 Testing video generation...\n');
  
  const videoGen = new VideoGenerator();
  const outputDir = './test-videos';
  
  await fs.mkdir(outputDir, { recursive: true });
  
  const aspectRatios = [
    { width: 16, height: 9, label: '16:9' },
    { width: 1, height: 1, label: '1:1' },
    { width: 9, height: 16, label: '9:16' },
  ];
  
  const videoFormat = { extension: 'mp4', mimeType: 'video/mp4' };
  
  console.log('Generating test videos with different aspect ratios:\n');
  
  for (const ratio of aspectRatios) {
    console.log(`Creating ${ratio.label} video...`);
    try {
      const videoPath = await videoGen.generateVideo(
        ratio,
        640,        // base width
        videoFormat,
        outputDir,
        0,          // index
        2,          // duration in seconds
        30          // fps
      );
      console.log(`✅ Generated: ${path.basename(videoPath)}`);
    } catch (error) {
      console.error(`❌ Failed to generate ${ratio.label} video:`, error.message);
    }
  }
  
  console.log('\n✨ Test complete! Check the test-videos directory for generated videos.');
}

testVideoGeneration().catch(console.error);