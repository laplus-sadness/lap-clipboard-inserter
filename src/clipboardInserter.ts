export interface ClipboardInserter {
    previousText: string;
    listeningTabs: number[];
    interval: ReturnType<typeof setInterval> | undefined;
}

export interface Request {
    action: "insert" | "eject";
    content: string;
}

export function sendMessageToTabs(tabs: number[], request: Request) {
    for (const id of tabs) {
        chrome.tabs
            .sendMessage(id, request)
            .catch((error) => console.error(`Error sending mesage: ${error}`));
    }
}

export function notifyChange(clipboardInserter: ClipboardInserter) {
    navigator.clipboard
        .readText()
        .then((clipText) => {
            if (
                clipText !== "" &&
                clipText !== clipboardInserter.previousText
            ) {
                clipboardInserter.previousText = clipText;
                sendMessageToTabs(clipboardInserter.listeningTabs, <Request>{
                    action: "insert",
                    content: clipText,
                });
            }
        })
        .catch((error) => console.error(`Failed to read clipboard: ${error}`));
}
