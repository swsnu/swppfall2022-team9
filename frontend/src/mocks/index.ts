// TODO: [resolve Warning on Console] captured a request without a matching request handler

export const initMockAPI = async (): Promise<void> => {
  if (typeof window === "undefined") {
    const { mockServer } = await import("./server");
    mockServer.listen({ onUnhandledRequest: "bypass" });
  } else {
    const { mockServiceWorker } = await import("./browser");
    mockServiceWorker.start();
  }
};
