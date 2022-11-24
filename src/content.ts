import { Request } from "./clipboardInserter";

export function contentScript() {
    chrome.runtime.onMessage.addListener(function handleMessage(
        request: Request
    ) {
        if (request.action === "eject") {
            chrome.runtime.onMessage.removeListener(handleMessage);
        } else {
            const pasteTarget = document.createElement("p");
            pasteTarget.textContent = request.content;
            document.querySelector("body")?.appendChild(pasteTarget);
        }
    });
}
