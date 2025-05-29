import { describe, it, expect, assert } from "vitest";
import { easyRecurse } from "../src";

describe("easyRecurse maxRecurDepth option tests", () => {
  it("should use default maxRecurDepth (10000) when not specified", async () => {
    const processedItems: number[] = [];
    const generateDeepTree = (depth: number, id = 1): any => {
      if (depth <= 0) return null;
      return {
        id,
        children: [generateDeepTree(depth - 1, id + 1)],
      };
    };

    const tree = generateDeepTree(100); // 创建深度为100的树
    console.log(tree);

    await easyRecurse(tree, (item) => {
      if (!item) return false;
      processedItems.push(item.id);
      return item.children;
    });

    expect(processedItems).toHaveLength(100);
    expect(processedItems[0]).toBe(1);
    expect(processedItems[99]).toBe(100);
  });

  it("should respect custom maxRecurDepth", async () => {
    const processedItems: number[] = [];
    const tree = {
      id: 1,
      children: [
        {
          id: 2,
          children: [
            {
              id: 3,
              children: [{ id: 4 }],
            },
          ],
        },
      ],
    };

    try {
      await easyRecurse(
        tree,
        (item) => {
          processedItems.push(item.id);
          return item.children;
        },
        { maxRecurDepth: 2 }
      );
    } catch (error) {}

    expect(processedItems).toHaveLength(2);
    expect(processedItems).toEqual([1, 2]);
  });

  it("should throw error when maxRecurDepth is exceeded", async () => {
    const tree = {
      id: 1,
      children: [
        {
          id: 2,
          children: [
            {
              id: 3,
              children: [{ id: 4 }],
            },
          ],
        },
      ],
    };

    await expect(
      easyRecurse(
        tree,
        (item) => {
          return item.children;
        },
        { maxRecurDepth: 2 }
      )
    ).rejects.toThrow("Max recursion depth reached: 2");
  });

  it("should work with maxRecurDepth in async mode", async () => {
    const processedItems: number[] = [];
    const tree = {
      id: 1,
      children: [
        {
          id: 2,
          children: [{ id: 3 }, { id: 4 }],
        },
      ],
    };
    await expect(
      easyRecurse(
        tree,
        async (item) => {
          processedItems.push(item.id);
          await new Promise((resolve) => setTimeout(resolve, 10));
          return item.children;
        },
        { async: true, maxRecurDepth: 2 }
      )
    ).rejects.toThrow("Max recursion depth reached: 2");
  });
});
