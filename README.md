# Lap Clipboard Inserter

A browser extension whose purpose is to repetitively insert the system clipboard's content into a page.

## Demonstration

This example uses the [TheMoeWay texthooker page](https://learnjapanese.moe/texthooker.html) in addition to this extension for displaying all the changes that happen to the system clipboard.

Used alongside a texthooker, e.g. [Textractor](https://github.com/Artikash/Textractor), it's possible to capture all the text of a Visual Novel, useful to track how many characters you read that day and to easily create [Anki](https://apps.ankiweb.net/) cards. See the [TMW explanation](https://learnjapanese.moe/vn/) of this process for more details.

## Instructions

Click the icon of this extension to toggle its functionality.

If the addon is turned off, it won't execute any script or use your browser resources.

## Differences from the original Clipboard Inserter

This extension has the following differences from the [original Clipboard Inserter](https://github.com/kmltml/clipboard-inserter):

1. Support of Manifest V3.
2. More optimized.
3. Easier to enter in contact with the developer.

## Installation

TODO: provide links.

## Building

Building the extension requires `npm`. To build it, clone this repo and run:

```shell
npm install
# Build the extension without generating source map files and with optimizations
npm run build
# Build the extension for debugging
npm run start
```

After this, you can use a program like `web-ext` to run or test the extension.

## Acknowledgements

- This project inspired by the [original Clipboard Inserter](https://github.com/kmltml/clipboard-inserter), by [Kamil Tomala](https://github.com/kmltml).
- The icon used by this extension was designed by [Freepik - Flaticon](https://www.flaticon.com/free-icons/clipboard) and can be found in [this page](https://www.flaticon.com/free-icon/paste_748035).

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. See [LICENSE](LICENSE) for more details.