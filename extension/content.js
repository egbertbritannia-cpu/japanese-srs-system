/**
 * Japanese SRS Extension - Content Script
 * Bóc tách DOM văn bản và hỗ trợ phụ đề YouTube
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "EXTRACT_SELECTION") {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : "";

    // Tìm câu hoàn chỉnh bao quanh từ được bôi đen
    let fullSentence = selectedText;
    if (selection && selection.anchorNode && selection.anchorNode.textContent) {
      const nodeText = selection.anchorNode.textContent;
      // Tách theo dấu chấm câu Nhật (。) hoặc chấm than/hỏi
      const sentences = nodeText.split(/(?<=[。！？\n])/);
      const match = sentences.find((s) => s.includes(selectedText));
      if (match) fullSentence = match.trim();
    }

    // Nếu đang ở YouTube, thử lấy thêm phụ đề hiện tại
    if (window.location.hostname.includes("youtube.com")) {
      const ytCaption = document.querySelector(".ytp-caption-segment");
      if (ytCaption && ytCaption.textContent) {
        fullSentence = ytCaption.textContent.trim();
      }
    }

    if (selectedText.length > 0) {
      chrome.storage.local.set({
        pendingCapture: {
          targetWord: selectedText,
          sentence: fullSentence,
          sourceUrl: window.location.href,
          capturedAt: Date.now()
        }
      }, () => {
        // Hiển thị thông báo Toast nhẹ trên trang
        showMiniNotification(`🌸 Đã thu thập: "${selectedText}"`);
      });
    }
  }
});

function showMiniNotification(msg) {
  const toast = document.createElement("div");
  toast.innerText = msg;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.backgroundColor = "#1A3025";
  toast.style.color = "#FFFFFF";
  toast.style.padding = "10px 18px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
  toast.style.zIndex = "999999";
  toast.style.fontSize = "13px";
  toast.style.fontFamily = "sans-serif";
  toast.style.border = "1px solid #D4AF37";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
