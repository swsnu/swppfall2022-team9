import { setupWorker, SetupWorkerApi } from "msw";
import { mockAPIs } from "./api";

export const mockServiceWorker: SetupWorkerApi = setupWorker(...mockAPIs);
