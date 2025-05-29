/**
 * A function type that determines the next items to process in the recursion.
 * @template T The type of items being processed
 * @param {T} item The current item being processed
 * @param {T | null | undefined} parent The parent item of the current item
 * @param {number} index The index of the current item in its parent's children array
 * @returns {T[] | null | undefined | false | Promise<T[] | null | undefined | false>} 
 *   - Returns an array of child items to process next
 *   - Returns null or undefined to stop processing this branch
 *   - Returns false to stop the entire recursion
 *   - Can return a Promise of any of the above
 */
export type Next<T> = (
  item: T,
  parent: T | null | undefined,
  index: number
) => T[]|any[] | null | undefined | false | Promise<T[]|any[] | null | undefined | false>;

/**
 * Recursively processes items in a tree-like structure with support for async operations.
 * @template T The type of items being processed
 * @param {T} entry The root item to start processing from
 * @param {Next<T>} next A function that determines the next items to process
 * @param {Object} [options] Configuration options
 * @param {boolean} [options.async] If true, processes children in parallel; if false, processes sequentially
 * @param {number} [options.maxRecurDepth] Maximum depth of recursion
 * @returns {Promise<void>} A promise that resolves when all processing is complete
 */
export const easyRecurse = async <T>(
  entry: T,
  next: Next<T>,
  options?: { async?: boolean, maxRecurDepth?: number }
) => {
  const maxRecurDepth = options?.maxRecurDepth ?? 10000;
  let count = 0
  const walk = async (entry: T, parent: T | null | undefined, i: number) => {
    count++
    if (maxRecurDepth > 0 && count > maxRecurDepth) {
      throw new Error(`Max recursion depth reached: ${maxRecurDepth}`);
    }
    let children = await next(entry, parent, i);
    if (children === false) {
      return false;
    }
    if (children) {
      let index = 0;
      const waits = [];
      for (const child of children) {
        const walkReturn = walk(child, entry, index);
        if (options?.async) {
          waits.push(walkReturn);
        } else {
          const walkReturn2 = await walkReturn;
          if (walkReturn2 === false) {
            return false;
          }
        }
        index++;
      }
      if (options?.async) {
        const walkReturns = await Promise.all(waits);
        if (walkReturns.find((v) => v === false)) {
          return false;
        }
      }
    }
  };
  await walk(entry, null, 0);
};

export default easyRecurse;
