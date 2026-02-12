/**
 * [INPUT]: None (pure functions)
 * [OUTPUT]: normalizePath, pathStartsWith, stripPathPrefix
 * [POS]: utils/ — cross-platform path handling, replaces @craft-agent/core/utils/paths
 * [PROTOCOL]: Update this header on change, then check AGENTS.md
 */

/** Normalize backslashes to forward slashes for cross-platform comparison. */
export function normalizePath(path: string): string {
  return path.replace(/\\/g, '/');
}

/** Check if filePath starts with dirPath (cross-platform). */
export function pathStartsWith(filePath: string, dirPath: string): boolean {
  const f = normalizePath(filePath);
  const d = normalizePath(dirPath);
  return f.startsWith(d + '/') || f === d;
}

/** Strip a directory prefix, returning the relative portion. */
export function stripPathPrefix(filePath: string, prefix: string): string {
  const f = normalizePath(filePath);
  const p = normalizePath(prefix);
  if (f.startsWith(p + '/')) return f.slice(p.length + 1);
  return filePath;
}
