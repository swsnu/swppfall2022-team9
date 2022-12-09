import EventDispatcher from "./eventDispatcher";

describe("eventDispatcher", () => {
  it("test eventDispatcher", async () => {
    const eventDispatcher = new EventDispatcher();
    eventDispatcher.addEventListener("event1", () => {});
    // Branch test
    eventDispatcher.addEventListener("event1", () => {});
    eventDispatcher.events.event1.toString();
    eventDispatcher.removeEventListener("event1");
  });
});
