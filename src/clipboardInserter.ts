export interface ClipboardInserter {
    previousText: string;
    listeningTabs: number[];
    interval: ReturnType<typeof setInterval> | undefined;
}

interface Request {
    action: "insert" | "eject";
    content: string;
}

function sendMessageToTabs(tabs: number[], request: Request) {
    for (const id of tabs) {
        chrome.tabs
            .sendMessage(id, request)
            .catch((error) => console.error(`Error sending mesage: ${error}`));
    }
}

function notifyChange(clipboardInserter: ClipboardInserter) {
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

function contentScript() {
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

export function toggleTab(clipboardInserter: ClipboardInserter, id: number) {
    const index = clipboardInserter.listeningTabs.indexOf(id);
    if (index > -1) {
        sendMessageToTabs([id], <Request>{ action: "eject" });
        clipboardInserter.listeningTabs.splice(index, 1);
        chrome.browserAction.setBadgeText({ tabId: id, text: "" });
        if (
            clipboardInserter.listeningTabs.length === 0 &&
            clipboardInserter.interval !== undefined
        ) {
            clearInterval(clipboardInserter.interval);
            clipboardInserter.interval = undefined;
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
            clipboardInserter.interval = setInterval(
                notifyChange,
                300,
                clipboardInserter
            );
        }
    }
}
