import { ClipboardInserter, toggleTab } from "./clipboardInserter";

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
