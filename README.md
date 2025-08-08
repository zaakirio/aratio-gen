# aratio-gen

CLI tool for generating placeholder images with common aspect ratios used in digital advertising and applications.

## Features

- Generate images with standard aspect ratios: 9:16, 2:3, 3:4, 4:5, 1:1, 4:3, 3:2, 16:9
- Interactive command-line interface
- Randomized pixel patterns for visual distinction
- Large aspect ratio labels for easy identification
- Support for PNG, JPEG, GIF, BMP, and TIFF formats
- Batch generation capabilities (1-100 images per aspect ratio)
- Configurable output dimensions

## Installation

```bash
git clone <repository-url>
cd aratio-gen
npm install
npm run build
```

## Usage

Run the interactive CLI:

```bash
npm start
```

Or directly:

```bash
node dist/index.js
```

## Interactive Options

1. **Aspect Ratios** - Select one or more ratios
2. **Quantity** - Number of images per ratio (1-100)
3. **Format** - Image format (PNG, JPEG, GIF, BMP, TIFF)
4. **Base Width** - Width in pixels (100-4000)
5. **Output Directory** - Destination folder

## Output

Files are named: `aratio-gen_<aspect-ratio>_<index>.<format>`

Example: `aratio-gen_16x9_1.png`

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