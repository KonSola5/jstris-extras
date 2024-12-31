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

(uses [webpack-userscript](https://github.com/freund17/webpack-userscript) template)

How do I start developing?
==========================

1. Add the `devLoader.user.js` userscript.
2. Run `npm run dev` to spin up the webpack server.
3. Refresh the page and make sure the dev loader script is on.
4. Making changes to any of the files will refresh the page and the script.

How do I build my userscript/extension for distribution?
=============================================

1. Run `npm i` to ensure all packages are properly installed
2. Run `npm run pack`
3. Your userscript is in `build/bundle.user.js`
4. Unpacked versions of extensions will be in `build/jstris-plus-chrome` and `build/jstris-plus-firefox`


Troubleshooting
===============

The server doesn't notice a filechange
--------------------------------------
Most likely the maximum number of watchers is surpassed.
Try adding `fs.inotify.max_user_watches=524288` to /etc/sysctl.conf and execute `sysctl -p`.
```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

