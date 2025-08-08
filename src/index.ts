#!/usr/bin/env node

import { CLI } from './cli.js';

async function main() {
  const cli = new CLI();
  await cli.run();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});