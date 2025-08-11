# aratio-gen

CLI tool for generating placeholder images and videos with common aspect ratios used in digital advertising and applications.

## Features

- Generate images and videos with standard aspect ratios: 9:16, 2:3, 3:4, 4:5, 1:1, 4:3, 3:2, 16:9
- Interactive command-line interface
- Randomized pixel patterns for visual distinction
- Large aspect ratio labels for easy identification
- **Image formats**: PNG, JPEG, GIF, BMP, and TIFF
- **Video formats**: MP4 with configurable duration (1-10 seconds)
- Batch generation capabilities (1-100 items per aspect ratio)
- Configurable output dimensions

## Installation

### Using npx (no installation required)

```bash
npx aratio-gen
```

### Global installation

```bash
npm install -g aratio-gen
aratio-gen
```

### Local development

```bash
git clone <repository-url>
cd aratio-gen
npm install
npm run build
```

## Usage

After installation, run:

```bash
aratio-gen
```

Or use directly without installation:

```bash
npx aratio-gen
```

## Interactive Options

1. **Media Type** - Choose between image or video generation
2. **Aspect Ratios** - Select one or more ratios
3. **Quantity** - Number of items per ratio (1-100)
4. **Format** - Image format (PNG, JPEG, GIF, BMP, TIFF) or Video (MP4)
5. **Base Width** - Width in pixels (100-4000)
6. **Duration** (Video only) - Length in seconds (1-10)
7. **Output Directory** - Destination folder

## Output

Files are named: `aratio-gen_<aspect-ratio>_<index>.<format>`

Examples: 
- Images: `aratio-gen_16x9_1.png`
- Videos: `aratio-gen_9x16_1.mp4`

## Development

```bash
npm run dev    # Run with ts-node
npm run build  # Compile TypeScript
npm run clean  # Remove build artifacts
```

## Requirements

- Node.js >= 18.0.0
- TypeScript 5.4.0

## License

MIT