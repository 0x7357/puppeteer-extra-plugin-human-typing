const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin');

class PuppeteerExtraPluginHumanTyping extends PuppeteerExtraPlugin {
  constructor(options = {}) {
    super(options);

    this.keyboardLayout = this.opts.keyboardLayouts[this.opts.keyboardLayout || 'en'];
  }

  get name() {
    return 'human-typing';
  }

  get defaults() {
    return {
      backspaceMaximumDelayInMs: 750 * 2,
      backspaceMinimumDelayInMs: 750,
      keyboardLayout: 'de',
      keyboardLayouts: {
        de: [
          ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'ß'],
          ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü'],
          ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä'],
          ['y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-'],
        ],
        en: [
          ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'],
          ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '['],
          ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
          ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
        ],
      },
      maximumDelayInMs: 650,
      minimumDelayInMs: 150,
      typoChanceInPercent: 15,
    };
  }

  _addCustomMethods(page) {
    page.typeHuman = async (selector, text, options) => this._typeHuman(page, selector, text, (options = {}));
  }

  _delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  _getCharacterCoordinates(character) {
    const characterLowerCased = character.toLowerCase();

    if (!this._isInKeyboardLayout(characterLowerCased)) {
      return null;
    }

    const keyboardLayout = this.keyboardLayout;

    for (let row = 0; row < keyboardLayout.length; row++) {
      for (let column = 0; column < keyboardLayout[row].length; column++) {
        if (keyboardLayout[row][column] === characterLowerCased) {
          return {
            column,
            row,
          };
        }
      }
    }

    return null;
  }

  _getCharacterCloseTo(character, attempt = 0) {
    if (attempt > 3) {
      return character;
    }

    const characterLowerCased = character.toLowerCase();

    if (!this._isInKeyboardLayout(characterLowerCased)) {
      return character;
    }

    const characterCoordinates = this._getCharacterCoordinates(character);

    if (characterCoordinates === null) {
      return character;
    }

    const isCharacterLowerCase = character.toLowerCase() === character;

    let possibleColumns = [];
    let possibleRows = [];

    const _c = characterCoordinates.column;
    const _r = characterCoordinates.row;

    // A higher chance to select characters to the left and right, than above and below. (66%)
    if (this._getRandomIntegerBetween(1, 100) <= 66) {
      possibleRows = [characterCoordinates.row];
    } else {
      if (_r === 0) {
        possibleRows = [_r, _r + 1];
      } else if (_r === this.keyboardLayout.length - 1) {
        possibleRows = [_r - 1, _r];
      } else {
        possibleRows = [_r - 1, _r, _r + 1];
      }
    }

    if (_c === 0) {
      possibleColumns = [_c, _c + 1];
    } else if (_c === this.keyboardLayout[_r].length - 1) {
      possibleColumns = [_c - 1, _c];
    } else {
      possibleColumns = [_c - 1, _c, _c + 1];
    }

    const selectedColumn = possibleColumns[Math.floor(Math.random() * possibleColumns.length)];
    const selectedRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];

    const result = this.keyboardLayout[selectedRow][selectedColumn] ?? null;

    // This can happen because each line ("row") must not have the same length/number of letters ("columns").
    if (result === null) {
      return character;
    }

    if (result === characterLowerCased) {
      return this._getCharacterCloseTo(character, attempt + 1);
    }

    return isCharacterLowerCase ? result : result.toUpperCase();
  }

  _getRandomIntegerBetween(a, b) {
    return Math.floor(Math.random() * (b - a + 1) + a);
  }

  _getTypingFlow(text) {
    console.log(this.defaults);

    const typingFlow = [];

    const characters = text.split('');

    for (let i = 0; i < characters.length; i++) {
      const character = characters[i];
      const characterLowerCased = character.toLowerCase();

      if (!this._isInKeyboardLayout(characterLowerCased)) {
        typingFlow.push(character);

        continue;
      }

      let hasTypo = this._getRandomIntegerBetween(0, 100) <= this.opts.typoChanceInPercent;

      if (hasTypo) {
        typingFlow.push(this._getCharacterCloseTo(character));
        typingFlow.push('Backspace');
      }

      typingFlow.push(character);
    }

    return typingFlow;
  }

  _isInKeyboardLayout(character) {
    for (const row of this.keyboardLayout) {
      if (row.includes(character)) {
        return true;
      }
    }

    return false;
  }

  async _typeHuman(page, selector, text, options = {}) {
    await this._delay(1000 * 5);

    await page.focus(selector);

    const typingFlow = this._getTypingFlow(text);

    for (const character of typingFlow) {
      if (character.length === 1) {
        await page.keyboard.type(character);
      } else {
        await this._delay(this._getRandomIntegerBetween(this.opts.backspaceMinimumDelayInMs, this.opts.backspaceMaximumDelayInMs));

        await page.keyboard.press(character);
      }

      await this._delay(this._getRandomIntegerBetween(this.opts.minimumDelayInMs, this.opts.maximumDelayInMs));
    }
  }

  async onBrowser(browser) {
    const pages = await browser.pages();

    for (const page of pages) {
      this._addCustomMethods(page);

      for (const frame of page.mainFrame().childFrames()) {
        this._addCustomMethods(frame);
      }
    }
  }

  async onPageCreated(page) {
    this._addCustomMethods(page);
  }
}

const defaultExport = (options) => {
  return new PuppeteerExtraPluginHumanTyping(options || {});
};

module.exports = defaultExport;
