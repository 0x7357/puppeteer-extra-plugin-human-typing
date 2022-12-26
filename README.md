# puppeteer-extra-plugin-human-typing

> A [puppeteer-extra](https://github.com/berstend/puppeteer-extra) plugin to add human typing to Puppeteer.

## Features

- gives `page` the function `.typeHuman()` which "humanizes" the writing of input elements
- makes, up to the specified percentage chance, typos and automatically corrects them (or keeps them with a given chance)

## Installation

```bash
yarn add puppeteer-extra-plugin-human-typing
# - or -
npm install puppeteer-extra-plugin-human-typing
```

If this is your first [puppeteer-extra](https://github.com/berstend/puppeteer-extra) plugin here's everything you need:

```bash
yarn add puppeteer puppeteer-extra puppeteer-extra-plugin-human-typing
# - or -
npm install puppeteer puppeteer-extra puppeteer-extra-plugin-human-typing
```

## Usage

The plugin adds human typing to Puppeteer.

```javascript
const puppeteer = require("puppeteer-extra");

puppeteer.use(require("puppeteer-extra-plugin-human-typing")());

puppeteer.launch({ headless: false }).then(async (browser) => {
  const page = await browser.newPage();

  await page.setViewport({ height: 600, width: 800 });
  await page.goto("https://www.google.com");

  /** During initialization and also here, settings can be specified. */
  await page.typeHuman('[name="q"]', "Is a robot writing right now?", {
    backspaceMaximumDelayInMs: 750 * 2,
    backspaceMinimumDelayInMs: 750,
    maximumDelayInMs: 650,
    minimumDelayInMs: 150,
  });
});
```

## Options

Usage:

```js
const HumanTypingPlugin = require("puppeteer-extra-plugin-human-typing");

const humanTyping = HumanTypingPlugin({
  backspaceMaximumDelayInMs: 750 * 2,
  backspaceMinimumDelayInMs: 750,
  chanceToKeepATypoInPercent: 0,
  keyboardLayout: "de",
  keyboardLayouts: {
    de: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "ß"],
      ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "ü"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä"],
      ["y", "x", "c", "v", "b", "n", "m", ",", ".", "-"],
    ],
    en: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-"],
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "["],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
      ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
    ],
  },
  maximumDelayInMs: 650,
  minimumDelayInMs: 150,
  typoChanceInPercent: 15,
});

puppeteer.use(humanTyping);
```

Available options:

```js
const options = {
  /** The maximum delay before hitting the Backspace-button. */
  backspaceMaximumDelayInMs: 750 * 2,
  /** The minimum delay before hitting the Backspace-button. */
  backspaceMinimumDelayInMs: 750,
  /** The chance to keep a typo in percent. */
  chanceToKeepATypoInPercent: 0,
  /** The keyboard layout. */
  keyboardLayout: "de",
  /** The predefined keyboard layouts. See "Keyboard Layouts" */
  keyboardLayouts: {},
  /** The maximum delay before typing a character. */
  maximumDelayInMs: 650,
  /** The minimum delay before typing a character. */
  minimumDelayInMs: 150,
  /** The chance for a typo in percent. */
  typoChanceInPercent: 15,
};
```

## Keyboard Layouts

A keyboard layout is a multidimensional array, built like a real keyboard. I intentionally left out some characters because I suspect that these characters are used less frequently. It is therefore important that it is set up like a real keyboard so that a suitable/correct selection can be made for "typos".

```js
const customKeyboardLayout = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "["],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
];

const humanTyping = HumanTypingPlugin({
  keyboardLayout: "custom",
  keyboardLayouts: {
    custom: customKeyboardLayout,
  },
});
```
