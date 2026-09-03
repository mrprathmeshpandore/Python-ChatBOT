import { create } from 'zustand';

interface ChatState {
  currentChatId: string | null;
  isStreaming: boolean;
  dragActive: boolean;
  inputText: string;
  abortController: AbortController | null;
  activeSources: any[];
  
  setCurrentChatId: (id: string | null) => void;
  setIsStreaming: (streaming: boolean) => void;
  setDragActive: (active: boolean) => void;
  setInputText: (text: string) => void;
  setAbortController: (controller: AbortController | null) => void;
  setActiveSources: (sources: any[]) => void;
  stopGeneration: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentChatId: null,
  isStreaming: false,
  dragActive: false,
  inputText: '',
  abortController: null,
  activeSources: [],
  
  setCurrentChatId: (id) => set({ currentChatId: id }),
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
  setDragActive: (active) => set({ dragActive: active }),
  setInputText: (text) => set({ inputText: text }),
  setAbortController: (controller) => set({ abortController: controller }),
  setActiveSources: (sources) => set({ activeSources: sources }),
  stopGeneration: () => {
    const controller = get().abortController;
    if (controller) {
      controller.abort();
      set({ isStreaming: false, abortController: null });
    }
  },
}));
