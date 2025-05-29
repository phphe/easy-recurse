import { describe, it, expect } from "vitest";
import { easyRecurse } from "../src";

describe("easyRecurse async option tests", () => {
  // Helper function to create a delay
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it("should process items sequentially when async is false", async () => {
    const processOrder: number[] = [];
    const tree = {
      id: 1,
      children: [{ id: 3, children: [{ id: 3 }, { id: 3 }] }, { id: 1 }],
    };

    await easyRecurse(
      tree,
      async (item: any) => {
        processOrder.push(item.id);
        await delay(item.id * 10); // Delay proportional to id
        return item.children;
      },
      { async: false }
    );

    // In sequential processing, items should be processed in order
    expect(processOrder).toEqual([1, 3, 3, 3, 1]);
  });

  it("should process items in parallel when async is true", async () => {
    const processOrder: number[] = [];
    const tree = {
      id: 1,
      children: [{ id: 3, children: [{ id: 3 }, { id: 3 }] }, { id: 1 }],
    };

    await easyRecurse(
      tree,
      async (item: any) => {
        processOrder.push(item.id);
        await delay(item.id * 10); // Delay proportional to id
        return item.children;
      },
      { async: true }
    );

    // In parallel processing, children might finish before parent due to different delays
    expect(processOrder).toEqual([1, 3, 1, 3, 3]);
  });

  it("should stop processing when next returning false", async () => {
    const processOrder: number[] = [];
    const tree = {
      id: 1,
      children: [{ id: 3, children: [{ id: 3 }, { id: 3 }] }, { id: 1 }],
    };

    await easyRecurse(tree, async (item: any) => {
      processOrder.push(item.id);
      if (item.id === 3) return false; // Stop processing when id is 2
      return item.children;
    });

    expect(processOrder).toEqual([1, 3]);
  });

  it("should ignore children when next returning null", async () => {
    const processOrder: number[] = [];
    const tree = {
      id: 1,
      children: [{ id: 3, children: [{ id: 3 }, { id: 3 }] }, { id: 1 }],
    };

    await easyRecurse(tree, async (item: any) => {
      processOrder.push(item.id);
      if (item.id === 3) return null; // ignore children
      return item.children;
    });

    expect(processOrder).toEqual([1, 3, 1]);
  });
});
