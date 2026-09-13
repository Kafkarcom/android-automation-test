import { execFileSync, spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PACKAGE = 'com.example.aiautomationdemo';
const ARTIFACTS = join(process.cwd(), 'artifacts');
mkdirSync(ARTIFACTS, { recursive: true });

function adb(args, options = {}) {
  console.log(`$ adb ${args.join(' ')}`);
  return execFileSync('adb', args, {
    encoding: 'utf8',
    stdio: options.stdio ?? ['ignore', 'pipe', 'pipe'],
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function screenshot() {
  const path = join(ARTIFACTS, `screen-${Date.now()}.png`);
  const output = execFileSync(
    'adb',
    ['exec-out', 'screencap', '-p'],
    { encoding: 'buffer' }
  );
  writeFileSync(path, output);
  console.log(`Screenshot: ${path}`);
}

async function main() {
  const devices = adb(['devices']);
  console.log(devices);

  const connected = devices
    .split('\\n')
    .slice(1)
    .filter(line => line.trim().endsWith('\\tdevice'));

  if (connected.length !== 1) {
    throw new Error(
      `Expected exactly one ready Android device, found ${connected.length}.`
    );
  }

  // Start with a clean log stream.
  adb(['logcat', '-c']);

  // Launch the installed app.
  adb([
    'shell',
    'monkey',
    '-p',
    PACKAGE,
    '1',
  ]);

  await sleep(1500);
  screenshot();

  // Find the input/button using fixed demo coordinates.
  // For production, use Maestro/UIAutomator semantics instead.
  adb(['shell', 'input', 'tap', '200', '550']);
  adb(['shell', 'input', 'text', 'AI_Test']);
  adb(['shell', 'input', 'tap', '200', '650']);

  await sleep(1000);
  screenshot();

  const logs = adb(['logcat', '-d']);
  const logPath = join(ARTIFACTS, `logcat-${Date.now()}.txt`);
  writeFileSync(logPath, logs);
  console.log(`Logcat: ${logPath}`);

  if (/FATAL EXCEPTION|TypeError|ReferenceError|Unhandled JS Exception/i.test(logs)) {
    console.error('FAIL: suspicious crash/error found in Logcat.');
    process.exitCode = 1;
    return;
  }

  if (!logs.includes('[E2E] Greeting generated')) {
    console.warn('WARNING: expected demo log message was not found.');
  }

  console.log('PASS: controller completed without a detected crash.');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
