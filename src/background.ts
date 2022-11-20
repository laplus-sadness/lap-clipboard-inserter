import { ClipboardInserter, toggleTab } from "./clipboardInserter";

let clipboardInserter: ClipboardInserter = {
    previousText: "",
    listeningTabs: [],
    interval: 0,
};

chrome.browserAction.onClicked.addListener(() =>
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        for (const tab of tabs) {
            if (tab.id === undefined) {
                console.error(`Error when querying the tabs: ClipboardInserter
                              doesn't work in windows that don't host content
                              tabs (for example, devtools windows)`);
            } else {
                toggleTab(clipboardInserter, tab.id);
            }
        }
    })
);
