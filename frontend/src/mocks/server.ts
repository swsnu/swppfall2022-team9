import { setupServer, SetupServerApi } from "msw/node";
import { mockAPIs } from "./api";

export const mockServer: SetupServerApi = setupServer(...mockAPIs);
