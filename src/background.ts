import {
    ClipboardInserter,
    Request,
    notifyChange,
    sendMessageToTabs,
} from "./clipboardInserter";
import { contentScript } from "./content";

const clipboardInserter: ClipboardInserter = {
    previousText: "",
    listeningTabs: [],
    interval: undefined,
};

chrome.browserAction.onClicked.addListener(() =>
    chrome.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs) => {
            for (const tab of tabs) {
                if (tab.id === undefined) {
                    console.error(
                        "Error when querying the tabs: ClipboardInserter " +
                            "doesn't work in windows that don't host content " +
                            "tabs (for example, devtools windows)"
                    );
                } else {
                    toggleTab(clipboardInserter, tab.id);
                }
            }
        })
        .catch((error) =>
            console.error(`Error when querying the tabs: ${error}`)
        )
);

function toggleTab(clipboardInserter: ClipboardInserter, id: number) {
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
