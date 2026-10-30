/**
 * Minimal ambient types for Bun's built-in test runner, so `bun:test` imports
 * typecheck without adding a dependency (@types/bun is not installed and this
 * change adds no new packages). Only the APIs the tests in this folder use are
 * declared.
 */
declare module "bun:test" {
  export function describe(name: string, fn: () => void): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
  export const expect: any;
}
