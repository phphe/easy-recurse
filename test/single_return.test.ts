import { describe, it, expect } from "vitest";
import { easyRecurse } from "../src";

describe("easyRecurse single return tests", () => {
  const DOMLikeData = {
    id: "div1",
    parent: {
      id: "div2",
      parent: {
        id: "div3",
        parent: {
          id: "body",
          parent: { id: "html" },
        },
      },
    },
  };
  
  it("process DOM like data", async () => {
    const processOrder: string[] = [];

    await easyRecurse(
      DOMLikeData,
      async (item: any) => {
        processOrder.push(item.id);
        return item.parent && [item.parent]; // must return array
      }
    );

    // In sequential processing, items should be processed in order
    expect(processOrder).toEqual(['div1', 'div2', 'div3', 'body', 'html']);
  });
  it("process DOM like data and break at body", async () => {
    const processOrder: string[] = [];

    await easyRecurse(
      DOMLikeData,
      async (item: any) => {
        processOrder.push(item.id);
        if (item.id === "body") return false;
        return item.parent && [item.parent]; // must return array
      }
    );

    // In sequential processing, items should be processed in order
    expect(processOrder).toEqual(['div1', 'div2', 'div3', 'body']);
  });
});
