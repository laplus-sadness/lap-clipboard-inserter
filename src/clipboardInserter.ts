export interface ClipboardInserter {
    previousText: string;
    interval: ReturnType<typeof setInterval> | undefined;
}

export interface Background {
    listeningTabs: number[];
}

export type Request = "insert" | "eject";

export function sendMessageToTab(id: number, request: Request) {
    chrome.tabs
        .sendMessage(id, request)
        .catch((error) => console.error(`Error sending mesage: ${error}`));
}
