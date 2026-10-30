/**
 * Quản lý các sự kiện tương tác giữa các trang (Demo, Báo giá, Trang chủ) với LoopsChatWidget
 */

export interface OpenChatOptions {
  message?: string;
  autoSend?: boolean;
  prefillLead?: {
    serviceType?: string;
    templateTitle?: string;
    templateImg?: string;
    budget?: string;
  };
}

export function openLoopsChat(options?: string | OpenChatOptions) {
  if (typeof window === "undefined") return;

  const payload: OpenChatOptions =
    typeof options === "string" ? { message: options, autoSend: false } : options || {};

  window.dispatchEvent(
    new CustomEvent("loops:open-chat", {
      detail: payload,
    })
  );
}
