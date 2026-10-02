/**
 * Japanese SRS Extension - Popup Logic
 * Xử lý Co-creation (đồng sáng tạo) và gửi API capture
 */

document.addEventListener("DOMContentLoaded", () => {
  const wordInput = document.getElementById("word");
  const sentenceInput = document.getElementById("sentence");
  const meaningInput = document.getElementById("meaning");
  const saveBtn = document.getElementById("saveBtn");
  const statusDiv = document.getElementById("status");

  let currentSourceUrl = "";

  // Nạp dữ liệu vừa capture trong storage
  chrome.storage.local.get(["pendingCapture"], (result) => {
    if (result.pendingCapture) {
      wordInput.value = result.pendingCapture.targetWord || "";
      sentenceInput.value = result.pendingCapture.sentence || "";
      currentSourceUrl = result.pendingCapture.sourceUrl || "";
      statusDiv.innerText = "Đã nạp nội dung bóc tách gần nhất.";
    }
  });

  saveBtn.addEventListener("click", async () => {
    const targetWord = wordInput.value.trim();
    const sentence = sentenceInput.value.trim();
    const meaning = meaningInput.value.trim();

    if (!targetWord || !sentence) {
      statusDiv.innerText = "Vui lòng nhập cả từ vựng và câu ngữ cảnh!";
      statusDiv.style.color = "#D9381E";
      return;
    }

    statusDiv.innerText = "Đang gửi lên Japanese SRS...";
    statusDiv.style.color = "#88A752";
    saveBtn.disabled = true;

    try {
      // Gửi lên endpoint cục bộ hoặc production
      const endpoint = "http://localhost:3000/api/capture/process";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetWord,
          sentence,
          meaning,
          sourceUrl: currentSourceUrl,
          autoApprove: true
        })
      });

      const json = await res.json();
      if (json.success) {
        statusDiv.innerText = "✅ Đã lưu thẻ thành công vào hệ thống!";
        statusDiv.style.color = "#88A752";
        // Xóa pending capture
        chrome.storage.local.remove(["pendingCapture"]);
        setTimeout(() => window.close(), 1500);
      } else {
        throw new Error(json.error || "Gửi thẻ thất bại");
      }
    } catch (err) {
      statusDiv.innerText = "❌ Lỗi kết nối máy chủ Japanese SRS!";
      statusDiv.style.color = "#D9381E";
      saveBtn.disabled = false;
    }
  });
});
