// Restore options
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local
        .get("interval")
        .then((data) => {
            const element = document.querySelector(
                "#interval"
            ) as HTMLInputElement;
            element.value = data.interval || 300;
        })
        .catch((error) => console.error(`Failed to load options: ${error}`));
});

// Save options
document.querySelector("form")?.addEventListener("submit", (event) => {
    const element = document.querySelector("#interval") as HTMLInputElement;
    chrome.storage.local
        .set({ interval: element.value })
        .catch((error) => console.error(`Failed to save options: ${error}`));
    event.preventDefault();
});
