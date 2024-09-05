import { getCubixConfig } from '@core/buildProject/getCubixConfig';
import type { Subprocess } from 'bun';
import { handleError } from '../handleError';
import { ErrorCode } from '@/types/errors';

export interface IRojoAddress {
  ip: string;
  port: number;
}

export default async function RojoServer(projectPath: string, props?: { port: number; address: string }): Promise<IRojoAddress> {
  const { port, address } = props || {};
  const cubixConfig = await getCubixConfig();
  const path = projectPath || cubixConfig.outDir;

  let runCommand = ['rojo.exe', 'serve', path];
  if (port) runCommand = [...runCommand, '--port', port.toString()];
  if (address) runCommand = [...runCommand, '--address', address];

  const proc = Bun.spawn(runCommand, {
    cwd: process.cwd(),
    stdio: ['inherit', 'pipe', 'pipe'],
    env: { ...process.env },
    cleanup: true,
    onExit: (subprocess, code, signal) => {
      process.exit(0);
    },
  });

  const output = await getOutput(proc);
  return await getIpAndPort(output, port);
}

async function getOutput(proc: Subprocess): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(handleError(ErrorCode.ROJO_SERVER_TIMEOUT_ERROR, { exitProcess: true }));
    }, 10000);

    if (!(proc.stdout instanceof ReadableStream)) {
      clearTimeout(timeoutId);
      reject(handleError(ErrorCode.ROJO_SERVER_STDOUT_ERROR, { customMessage: 'stdout não é um ReadableStream', exitProcess: true }));
      return;
    }

    const textDecoder = new TextDecoder();
    let output = '';

    proc.stdout
      .pipeTo(
        new WritableStream({
          write(chunk) {
            output += textDecoder.decode(chunk);
            if (output.includes('Rojo server listening')) {
              clearTimeout(timeoutId);
              resolve(output);
            }
          },
        }),
      )
      .catch((err) => {
        clearTimeout(timeoutId);
        reject(handleError(ErrorCode.ROJO_SERVER_STDOUT_ERROR, { customMessage: err, exitProcess: true }));
      });
  });
}

async function getIpAndPort(output: string, port?: number): Promise<IRojoAddress> {
  const urlPattern = /(https?:\/\/)([\w.-]+|\d+\.\d+\.\d+\.\d+):(\d+)/;
  const match = output.match(urlPattern);

  if (match) {
    const [, , domain, detectedPort] = match;
    const finalPort = port || Number.parseInt(detectedPort, 10);
    const ip = domain === 'localhost' ? '127.0.0.1' : domain;

    return { ip, port: finalPort };
  }
  return { ip: '', port: 0 };
}
