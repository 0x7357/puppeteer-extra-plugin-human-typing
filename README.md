# puppeteer-extra-plugin-human-typing

> A [puppeteer-extra](https://github.com/berstend/puppeteer-extra) plugin to add human typing to Puppeteer.

### Installation

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
const puppeteer = require('puppeteer-extra');

puppeteer.use(require('./PuppeteerExtraPluginHumanTyping.js')());

puppeteer.launch({ headless: false }).then(async (browser) => {
  const page = await browser.newPage();

  await page.setViewport({ height: 600, width: 800 });
  await page.goto('https://www.google.com');
  await page.typeHuman('[name="q"]', 'Is a robot writing right now?');
});```

## Options

Usage:

```js
const HumanTypingPlugin = require('puppeteer-extra-plugin-human-typing')

const humanTyping = HumanTypingPlugin({
  backspaceMaximumDelayInMs: 750 * 2,
  backspaceMinimumDelayInMs: 750,
  maximumDelayInMs: 650,
  minimumDelayInMs: 150,
  keyboardLayout: 'de',
  typoChanceInPercent: 15,
})

puppeteer.use(humanTyping)
```

Available options:

```js
const options = {
  /** The maximum delay before hitting the Backspace-button. */
  backspaceMaximumDelayInMs: 750 * 2,
  /** The minimum delay before hitting the Backspace-button. */
  backspaceMinimumDelayInMs: 750,
  /** The maximum delay before typing a character. */
  maximumDelayInMs: 650,
  /** The minimum delay before typing a character. */
  minimumDelayInMs: 150,
  /** The keyboard layout. */
  keyboardLayout: 'de',
  /** The chance for a typo in percent. */
  typoChanceInPercent: 15,
}
```