import { glob } from 'glob';
import { spawn } from 'child_process';

const files = await glob('src/**/*.{js,jsx}');
const child = spawn('npx', ['jsdoc', ...files], { stdio: 'inherit' });

child.on('exit', (code) => {
  process.exit(code);
});
