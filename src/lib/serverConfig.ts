/**
 * liftr: Server Configuration and Port Resolution Helper
 */

function parsePort(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const num = parseInt(trimmed, 10);
  if (num >= 1 && num <= 65535) {
    return num;
  }
  return null;
}

/**
 * Resolves the server port with authoritative precedence:
 * 1. Valid --port argument in argv (integer 1-65535)
 * 2. Valid PORT environment variable (integer 1-65535, regardless of NODE_ENV)
 * 3. Fallback default 3000
 */
export function resolvePort(
  argv: string[] = [],
  env: Record<string, string | undefined> = {}
): number {
  const portArgIndex = argv.indexOf('--port');
  if (portArgIndex !== -1 && portArgIndex + 1 < argv.length) {
    const cliPort = parsePort(argv[portArgIndex + 1]);
    if (cliPort !== null) {
      return cliPort;
    }
  }

  const envPort = parsePort(env.PORT);
  if (envPort !== null) {
    return envPort;
  }

  return 3000;
}
