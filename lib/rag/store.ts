import { GraphState } from "./graph";

const globalStore = globalThis as unknown as { pipelineStore?: Map<string, GraphState> };
if (!globalStore.pipelineStore) {
  globalStore.pipelineStore = new Map<string, GraphState>();
}
export const pipelineStore = globalStore.pipelineStore;