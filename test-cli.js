import { ImageGenerator } from './dist/imageGenerator.js';
import path from 'path';
import fs from 'fs/promises';

async function test() {
  console.log('Testing aratio-gen CLI tool...\n');
  
  const generator = new ImageGenerator();
  const outputDir = './test-output';
  
  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });
  
  const testCases = [
    { width: 9, height: 16, label: '9:16' },
    { width: 1, height: 1, label: '1:1' },
    { width: 16, height: 9, label: '16:9' }
  ];
  
  const format = { extension: 'png', mimeType: 'image/png' };
  
  for (const aspectRatio of testCases) {
    console.log(`Generating ${aspectRatio.label} image...`);
    const filepath = await generator.generateImage(
      aspectRatio,
      800, // base width
      format,
      outputDir,
      0 // index
    );
    console.log(`✓ Generated: ${path.basename(filepath)}`);
  }
  
  console.log('\n✅ All test images generated successfully!');
  console.log(`📁 Check the ${outputDir} directory for generated images.`);
}

test().catch(console.error);