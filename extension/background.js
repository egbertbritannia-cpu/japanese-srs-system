/**
 * Japanese SRS Extension - Service Worker
 * Điều phối lệnh Alt+S và Context Menu
 */

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "mine-selection",
    title: "🌸 Đào mỏ vào Japanese SRS (Alt+S)",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "mine-selection" && tab.id) {
    chrome.tabs.sendMessage(tab.id, { action: "EXTRACT_SELECTION" });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "quick-mine") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "EXTRACT_SELECTION" });
      }
    });
  }
});
