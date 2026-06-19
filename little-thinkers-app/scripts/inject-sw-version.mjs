import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

let buildId;
try {
  buildId = readFileSync(join(root, '.next', 'BUILD_ID'), 'utf8').trim();
} catch {
  buildId = `dev-${Date.now()}`;
}

const swPath = join(root, 'public', 'sw.js');
let sw = readFileSync(swPath, 'utf8');

sw = sw
  .replace(/const CACHE_NAME = 'little-thinkers-[^']*';/, `const CACHE_NAME = 'little-thinkers-${buildId}';`)
  .replace(/const SHELL_CACHE = 'little-thinkers-shell-[^']*';/, `const SHELL_CACHE = 'little-thinkers-shell-${buildId}';`);

writeFileSync(swPath, sw);
console.log(`[inject-sw-version] Cache version set to: ${buildId}`);
