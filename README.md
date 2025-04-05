# Jstris Extras

A fork of [Jstris+](https://github.com/JstrisPlus/jstris-plus-userscript) that adds even more customization features for [Jstris](https://jstris.jezevec10.com/):
Beware - may be more break-prone!

- Connected skins that finally connect pieces together instead of colors!
- Better NEXT queue, which centers and distributes equally any polyomino, not just tetrominoes!
- New configuration UI that allows you to find your desired customization settings more quickly!

TODO:
- Stats on sides of the board instead of the bottom,
- Ability to have a stat in the center of the board, just like in TETR.IO,
- Finish line for sprints,
- Rotation centers,
- Improved Replayer layout,
- Action text fix and remake,
- Ability to distinguish giant pieces from normal ones (at least the ones that move 1 cell at a time)
- Peeking hidden row,
- Grayed out HOLD piece,
- Bag separators
- Fully customizable Practice mode (basically TETR.IO Zen in Jstris)
- The ability to distinguish the active piece from the stack,
- New sound events (like T-spin being detected after a rotation, garbage being received, garbage being added to field)
- Option to launch Jstris into singleplayer instead of defaulting to Live

Features removed:
- 3rd party matchmaking (who even plays this?)
- Screenshot feature (as it uploads the screenshot onto an external server for modifications)

This project uses [WXT](https://wxt.dev/).

How do I start developing?
==========================

1. Run `npm install` to install all dependencies.
2. Run `npm run dev` to launch a Chromium browser, or `npm run dev:firefox` to launch a Firefox browser with the extension applied.
3. Running the task should automatically start a browser at https://jstris.jezevec10.com/play/practice.
4. Saving changes in the extension will automatically reload it.

How do build the extension?
=============================================

1. Run `npm install` to install all dependencies.
2. Run `npm run build` to build a Chromium extension, or `npm run build:firefox` to build a Firefox extension.
3. Unpacked versions of extensions will be in `.output/chrome-mv3` and `/output/firefox-mv2`.
4. To pack the extensions, run `npm run zip`.

