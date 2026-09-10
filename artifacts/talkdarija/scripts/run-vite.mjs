import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '..');
const mode = process.argv[2] || 'dev';

const env = {
  ...process.env,
  PORT: process.env.PORT || '4173',
  BASE_PATH: process.env.BASE_PATH || '/',
};

const configArg = ['--config', path.join(appDir, 'vite.config.ts')];
const devArgs = ['--host', '0.0.0.0', '--port', env.PORT, '--strictPort'];

const viteEntry = path.join(appDir, 'node_modules', 'vite', 'bin', 'vite.js');
const viteArgs =
  mode === 'build'
    ? ['build', ...configArg]
    : mode === 'preview'
      ? ['preview', ...configArg, ...devArgs]
      : ['--config', path.join(appDir, 'vite.config.ts'), ...devArgs];

const child = spawn(process.execPath, [viteEntry, ...viteArgs], {
  cwd: appDir,
  env,
  stdio: 'inherit',
  shell: false,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    process.exit(1);
  }
  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error('Failed to start Vite:', error);
  process.exit(1);
});
