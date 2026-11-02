import { useSyncExternalStore } from "react";
import { ChatSession, ChatUser } from "@/lib/chatbot/types";
import {
  getStoredSessions,
  saveStoredSessions,
  createNewSession,
  generateSessionTitle,
} from "@/lib/chatbot/chatStorage";

type Listener = () => void;

interface ChatState {
  isOpen: boolean;
  view: "chat" | "history";
  sessions: ChatSession[];
  currentSessionId: string;
  isStreaming: boolean;
  streamingContent: string;
  user: ChatUser;
  hasUnread: boolean;
  isFastIntakeOpen: boolean;
  intakeTemplate: string;
}

let state: ChatState = {
  isOpen: false,
  view: "chat",
  sessions: [],
  currentSessionId: "",
  isStreaming: false,
  streamingContent: "",
  user: { id: "guest", name: "Khách vãng lai", isGuest: true },
  hasUnread: false,
  isFastIntakeOpen: false,
  intakeTemplate: "",
};

const listeners = new Set<Listener>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const chatStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },
  init(user?: ChatUser) {
    const targetUser = user || state.user;
    const stored = getStoredSessions(targetUser.isGuest ? null : targetUser.id);
    if (stored.length > 0) {
      state = {
        ...state,
        user: targetUser,
        sessions: stored,
        currentSessionId: stored[0].id,
      };
    } else {
      const initial = createNewSession();
      state = {
        ...state,
        user: targetUser,
        sessions: [initial],
        currentSessionId: initial.id,
      };
      saveStoredSessions([initial], targetUser.isGuest ? null : targetUser.id);
    }
    emitChange();
  },
  setOpen(open: boolean) {
    state = { ...state, isOpen: open, hasUnread: open ? false : state.hasUnread };
    emitChange();
  },
  setView(view: "chat" | "history") {
    state = { ...state, view };
    emitChange();
  },
  setFastIntake(open: boolean, template: string = "") {
    state = { ...state, isFastIntakeOpen: open, intakeTemplate: template };
    emitChange();
  },
  setStreaming(isStreaming: boolean, content: string = "") {
    state = { ...state, isStreaming, streamingContent: content };
    emitChange();
  },
  switchSession(sessionId: string) {
    state = { ...state, currentSessionId: sessionId, view: "chat" };
    emitChange();
  },
  startNewSession() {
    const fresh = createNewSession();
    const updated = [fresh, ...state.sessions];
    state = {
      ...state,
      sessions: updated,
      currentSessionId: fresh.id,
      view: "chat",
    };
    saveStoredSessions(updated, state.user.isGuest ? null : state.user.id);
    emitChange();
  },
  deleteSession(sessionId: string) {
    const filtered = state.sessions.filter((s) => s.id !== sessionId);
    if (filtered.length === 0) {
      const fresh = createNewSession();
      state = { ...state, sessions: [fresh], currentSessionId: fresh.id };
      saveStoredSessions([fresh], state.user.isGuest ? null : state.user.id);
    } else {
      state = {
        ...state,
        sessions: filtered,
        currentSessionId: state.currentSessionId === sessionId ? filtered[0].id : state.currentSessionId,
      };
      saveStoredSessions(filtered, state.user.isGuest ? null : state.user.id);
    }
    emitChange();
  },
  appendUserMessage(text: string) {
    const session = state.sessions.find((s) => s.id === state.currentSessionId);
    if (!session) return;

    const userMsg = {
      id: "u_" + Date.now(),
      role: "user" as const,
      content: text,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...session.messages, userMsg];
    const isFirst = session.messages.filter((m) => m.role === "user").length === 0;
    const title = isFirst ? generateSessionTitle(text) : session.title;

    const updatedSession: ChatSession = {
      ...session,
      title,
      messages: updatedMessages,
      messageCount: session.messageCount + 1,
      updatedAt: new Date().toISOString(),
    };

    const updatedSessions = state.sessions.map((s) =>
      s.id === session.id ? updatedSession : s
    );

    state = { ...state, sessions: updatedSessions };
    saveStoredSessions(updatedSessions, state.user.isGuest ? null : state.user.id);
    emitChange();
  },
  appendAssistantMessage(text: string) {
    const session = state.sessions.find((s) => s.id === state.currentSessionId);
    if (!session) return;

    const assistantMsg = {
      id: "a_" + Date.now(),
      role: "assistant" as const,
      content: text,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...session.messages, assistantMsg];
    const updatedSession: ChatSession = {
      ...session,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    };

    const updatedSessions = state.sessions.map((s) =>
      s.id === session.id ? updatedSession : s
    );

    state = { ...state, sessions: updatedSessions, isStreaming: false, streamingContent: "" };
    saveStoredSessions(updatedSessions, state.user.isGuest ? null : state.user.id);
    emitChange();
  },
};

export function useChatStore() {
  return useSyncExternalStore(chatStore.subscribe, chatStore.getSnapshot, chatStore.getSnapshot);
}
