import { ClipboardInserter, Request } from "./clipboardInserter";

export function contentScript() {
    const clipboardInserter: ClipboardInserter = {
        previousText: "",
        interval: undefined,
    }
    const checkClipboard = (clipboardInserter: ClipboardInserter) => {
        navigator.clipboard.readText()
            .then((clipText) => {
                if (clipText !== "" && clipText !== clipboardInserter.previousText) {
                    clipboardInserter.previousText = clipText;
                    const pasteTarget = document.createElement("p");
                    pasteTarget.textContent = clipText;
                    document.querySelector("body")?.appendChild(pasteTarget);
                }
            })
            .catch((error) => console.error(`Failed to read clipboard: ${error}`))
    };
    clipboardInserter.interval = setInterval(checkClipboard, 300, clipboardInserter);
    chrome.runtime.onMessage.addListener(function handleMessage(request: Request) {
        if (request === "eject") {
            clearInterval(clipboardInserter.interval);
            clipboardInserter.interval = undefined;
            chrome.runtime.onMessage.removeListener(handleMessage);
        }
    });
}
