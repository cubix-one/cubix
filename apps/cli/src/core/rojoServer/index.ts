import { getCubixConfig } from '@core/buildProject/getCubixConfig';
import type { Subprocess } from 'bun';
import { handleError } from '../handleError';
import { ErrorCode } from '@/types/errors';

export interface IRojoAddress {
  ip: string;
  port: number;
}

export default async function RojoServer(projectPath: string, port: number, address: string): Promise<IRojoAddress> {
  const cubixConfig = await getCubixConfig();
  const path = projectPath || cubixConfig.outDir;

  let command = ['rojo.exe', 'serve', path];
  if (port) command = [...command, '--port', port.toString()];
  if (address) command = [...command, '--address', address];

  const proc = Bun.spawn(command, {
    cwd: process.cwd(),
    stdio: ['inherit', 'pipe', 'pipe'],
    env: { ...process.env },
    cleanup: true,
    onExit: (subprocess, code, signal) => {
      process.exit(0);
    },
  });

  const output = await getOutput(proc);
  const { ip, port: finalPort } = await getIpAndPort(output, port);
  return { ip, port: finalPort };
}

async function getOutput(proc: Subprocess): Promise<string> {
  return new Promise((resolve, reject) => {
    let output = '';
    const timeoutId = setTimeout(() => {
      reject(handleError(ErrorCode.ROJO_SERVER_TIMEOUT_ERROR, { exitProcess: true }));
    }, 10000);

    if (proc.stdout instanceof ReadableStream) {
      proc.stdout.pipeTo(
        new WritableStream({
          write(chunk) {
            const chunkStr = new TextDecoder().decode(chunk).toString();
            output += chunkStr;
            if (output.includes('Rojo server listening')) {
              clearTimeout(timeoutId);
              resolve(output);
            }
          },
        }),
      );
    } else {
      clearTimeout(timeoutId);
      reject(handleError(ErrorCode.ROJO_SERVER_STDOUT_ERROR, { customMessage: 'stdout não é um ReadableStream', exitProcess: true }));
    }
  }).catch((err) => {
    handleError(ErrorCode.ROJO_SERVER_STDOUT_ERROR, { customMessage: err, exitProcess: true });
    return '';
  }) as Promise<string>;
}

async function getIpAndPort(output: string, port: number): Promise<IRojoAddress> {
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
