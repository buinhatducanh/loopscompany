try {
  process.loadEnvFile(".env.local");
} catch {
  // Bỏ qua nếu môi trường đã có sẵn biến
}

import { sendChatMessage } from "../src/lib/chatbot/geminiService";

async function runTest() {
  console.log("=== BẮT ĐẦU TEST CHATBOT LOOPS ===");
  const testQuestion = "Giờ anh muốn làm web với app mobile tổng luôn 1tr thì được không em.";
  console.log("Câu hỏi từ khách hàng:", testQuestion);

  const response = await sendChatMessage([
    {
      role: "user",
      content: testQuestion,
    },
  ]);

  console.log("\n=== KẾT QUẢ PHẢN HỒI TỪ AI (Model: " + response.modelUsed + ") ===");
  console.log(response.reply);
  console.log("\n=== TEST HOÀN TẤT THÀNH CÔNG ===");
}

runTest();
