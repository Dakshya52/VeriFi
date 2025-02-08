import { UIManager } from "./ui/UIManager";

// Initialize the extension UI
const uiManager = new UIManager();

// Cleanup when the window is unloaded
window.addEventListener("unload", () => {
  uiManager.destroy();
});