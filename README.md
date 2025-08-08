# aratio-gen

A Node.js TypeScript CLI tool to generate media assets with various aspect ratios commonly used in ads and apps.

## Features

- 🎨 Generate images with common aspect ratios (9:16, 2:3, 3:4, 4:5, 1:1, 4:3, 3:2, 16:9)
- 🎯 Interactive wizard-like CLI experience
- 🌈 Randomized pixel colors for each image
- 📝 Aspect ratio labels overlaid on images
- 🖼️ Multiple image format support (PNG, JPEG, GIF, BMP, TIFF)
- 📦 Batch generation of multiple assets per aspect ratio
- 🔧 Customizable base width for all images
- 📁 Organized file naming: `aratio-gen_<aspect_ratio>_<dimensions>_<index>.<format>`

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd aratio-gen

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Run the CLI

```bash
npm start
# or
node dist/index.js
```

### Development Mode

```bash
npm run dev
```

### Interactive Prompts

The CLI will guide you through:

1. **Select aspect ratios** - Choose one or more aspect ratios to generate
2. **Number of assets** - Specify how many images per aspect ratio (1-100)
3. **Image format** - Choose from PNG, JPEG, GIF, BMP, or TIFF
4. **Base width** - Set the width in pixels (100-4000px)
5. **Output directory** - Specify where to save generated images

## Example Output

Generated files follow this naming pattern:
- `aratio-gen_9x16_800x1422_1.png`
- `aratio-gen_1x1_800x800_1.png`
- `aratio-gen_16x9_800x450_1.png`

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run in development mode with ts-node
- `npm start` - Run the compiled CLI
- `npm run clean` - Remove compiled files

## Requirements

- Node.js >= 18.0.0
- TypeScript 5.4.0

## License

MIT# aratio-gen
