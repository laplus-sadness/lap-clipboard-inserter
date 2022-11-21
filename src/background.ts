import { Background, Request, sendMessageToTab } from "./clipboardInserter";
import { contentScript } from "./content"

const background: Background = {
    listeningTabs: [],
}

chrome.action.onClicked.addListener(() =>
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        for (const tab of tabs) {
            if (tab.id === undefined) {
                console.error(
                    "Error when querying the tabs: ClipboardInserter " +
                    "doesn't work in windows that don't host content " +
                    "tabs (for example, devtools windows)"
                );
            } else {
                toggleTab(background, tab.id);
            }
        }
    }).catch((error) => console.error(`Error when querying the tabs: ${error}`))
);

function toggleTab(background: Background, id: number) {
    const index = background.listeningTabs.indexOf(id);
    if (index > -1) {
        background.listeningTabs.splice(index, 1);
        sendMessageToTab(id, "eject" as Request);
        chrome.action.setBadgeText({ tabId: id, text: "" });
    } else {
        chrome.scripting
            .executeScript({
                target: { tabId: id },
                func: contentScript,
            })
            .catch((error) =>
                console.error(`Error executing the content script: ${error}`)
            );
        background.listeningTabs.push(id);
        chrome.action.setBadgeBackgroundColor({
            tabId: id,
            color: "green",
        });
        chrome.action.setBadgeText({ tabId: id, text: "ON" });
    }
}
