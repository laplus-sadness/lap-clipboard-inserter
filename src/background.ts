import {
    Background,
    ClipboardInserter,
    Request,
    notifyChange,
    sendMessageToTabs,
} from "./clipboardInserter";
import { contentScript } from "./content";

const background: Background = {
    interval: undefined,
    waitTime: 300,
};

const clipboardInserter: ClipboardInserter = {
    previousText: "",
    listeningTabs: [],
};

chrome.storage.local
    .get("interval")
    .then((data) => {
        if (data.interval) {
            background.waitTime = data.interval;
        }
    })
    .catch((error) => console.error(`Failed to load options: ${error}`));

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.interval?.newValue) {
        background.waitTime = changes.interval.newValue;
    }
});

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
                    toggleTab(tab.id);
                }
            }
        })
        .catch((error) =>
            console.error(`Error when querying the tabs: ${error}`)
        )
);

function toggleTab(id: number) {
    const index = clipboardInserter.listeningTabs.indexOf(id);
    if (index > -1) {
        sendMessageToTabs([id], <Request>{ action: "eject" });
        clipboardInserter.listeningTabs.splice(index, 1);
        chrome.browserAction.setBadgeText({ tabId: id, text: "" });
        if (
            clipboardInserter.listeningTabs.length === 0 &&
            background.interval !== undefined
        ) {
            clearInterval(background.interval);
            background.interval = undefined;
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
        if (!background.interval) {
            background.interval = setInterval(
                notifyChange,
                background.waitTime,
                clipboardInserter
            );
        }
    }
}
