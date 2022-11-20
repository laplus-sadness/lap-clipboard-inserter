export interface ClipboardInserter {
    previousText: string;
    listeningTabs: number[];
    interval: number;
}

export interface Request {
    action: "insert" | "uninject";
    content: string;
}

function sendMessageToTabs(tabs: number[], request: Request) {
    for (const id of tabs) {
        chrome.tabs
            .sendMessage(id, request)
            .catch((error) => console.error(`Error sending mesage: ${error}`));
    }
}

export function notifyChange(clipboardInserter: ClipboardInserter) {
    navigator.clipboard.readText().then((clipText) => {
        if (clipText !== "" && clipText !== clipboardInserter.previousText) {
            clipboardInserter.previousText = clipText;
            sendMessageToTabs(clipboardInserter.listeningTabs, <Request>{
                action: "insert",
                content: clipText,
            });
        }
    });
}

function contentScript() {
    chrome.runtime.onMessage.addListener(function handleMessage(
        request: Request
    ) {
        if (request.action === "uninject") {
            chrome.runtime.onMessage.removeListener(handleMessage);
        } else {
            const pasteTarget = document.createElement("p");
            pasteTarget.textContent = request.content;
            document.querySelector("body")?.appendChild(pasteTarget);
        }
    });
}

export function toggleTab(clipboardInserter: ClipboardInserter, id: number) {
    const index = clipboardInserter.listeningTabs.indexOf(id);
    if (index > -1) {
        sendMessageToTabs([id], <Request>{ action: "uninject" });
        clipboardInserter.listeningTabs.splice(index, 1);
        chrome.browserAction.setBadgeText({ tabId: id, text: "" });
        if (
            clipboardInserter.listeningTabs.length === 0 &&
            clipboardInserter.interval
        ) {
            window.clearInterval(clipboardInserter.interval);
            clipboardInserter.interval = 0;
        }
    } else {
        chrome.scripting
            .executeScript({
                target: { tabId: id },
                func: contentScript,
            })
            .catch((error) =>
                console.error(`Error executing the content script: ${error}`)
            );
        clipboardInserter.listeningTabs.push(id);
        chrome.browserAction.setBadgeBackgroundColor({
            tabId: id,
            color: "green",
        });
        chrome.browserAction.setBadgeText({ tabId: id, text: "ON" });
        if (!clipboardInserter.interval) {
            clipboardInserter.interval = window.setInterval(
                notifyChange,
                300,
                clipboardInserter
            );
        }
    }
}
