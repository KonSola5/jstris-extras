import { functionExists } from "./util";

/* A function designed for injecting stuff in the middle of functions by:
  - stringifying the function,
  - finding appropriate patterns and stuff in the function,
  - re-building the function using the Function object constructor.

  All injections can short-circuit in cases where somehow the injected functions aren't initialized properly (like in the case of Live opponent boards).
*/
export function initTamper() {
  function getArguments(theFunction) {
    let returnValue = [];
    let args = theFunction
      .toString()
      .match(/function\s*(?:[_a-zA-Z]\w*\s*)?\(((?:(?:[_a-zA-Z]\w*)\s*,\s*?)*(?:[_a-zA-Z]\w*)?)\)/);
    if (args.length > 1) {
      returnValue = args[1].split(/\s*,\s*/g);
      return returnValue;
    }
    return [];
  }

  function stripCurlyBrackets(functionString) {
    let firstCurlyBracketRegex = /\{/g;
    let firstCurlyBracketResults = firstCurlyBracketRegex.exec(functionString);
    let firstCurlyBracket = firstCurlyBracketRegex.lastIndex;
    return functionString.slice(firstCurlyBracket, -1);
  }

  function injectIntoPlaceBlock() {
    GameCore.prototype.injected_placeBlock = function (y, i, x, j) {};

    GameCore.prototype.injected_beforePlaceBlockInDeadline = function (y, i, x, j) {};

    let placeBlockString = GameCore.prototype.placeBlock.toString();

    let strippedPlaceBlockString = stripCurlyBrackets(placeBlockString);

    // Matches:
    // `this["matrix"][obfuscatedAdd(y, i)][obfuscatedAdd(x, j)]`
    const placeBlockRegex1 =
      /this\[[^,\[\]]*\]\[_0x\w*\[_0x\w*\(0x\w*\)\]\(_0x\w*\,_0x\w*\)\]\[_0x\w*\[_0x\w*\(0x\w*\)\]\(_0x\w*\,_0x\w*\)\]/g;

    let regexResults1 = placeBlockRegex1.exec(strippedPlaceBlockString); // This contains the wanted variables.
    let stringWithVariables = regexResults1[0];
    let index1 = placeBlockRegex1.lastIndex;
    // Slices after the regex match!
    let slicedFunction1 = strippedPlaceBlockString.slice(index1);

    // Now find strings like (__,__) in the string found previously - these hold wanted variables
    let variables = [];

    let array1, array2;

    const variableBracketRegex = /\(\w*\,\w*\)/g;
    const variableRegex = /_0x\w*/g;
    while ((array1 = variableBracketRegex.exec(stringWithVariables)) !== null) {
      while ((array2 = variableRegex.exec(array1[0])) !== null) {
        variables.push(array2[0]);
      }
    }

    // Matches: `),` - that's the injection point
    const placeBlockRegex2 = /\)\,/g;
    let regexResults2 = placeBlockRegex2.exec(slicedFunction1);
    let part1 = strippedPlaceBlockString.slice(0, index1 + placeBlockRegex2.lastIndex);
    let remainingPart = strippedPlaceBlockString.slice(index1 + placeBlockRegex2.lastIndex);

    const placeBlockRegex3 =
      /this\[[^,\[\]]*\]\[_0x\w*\[[^,\[\]]*\]\(_0x\w*,_0x\w*\)\]=_0x\w*\[[^,\[\]]*\]\(_0x\w*\[[^,\[\]]*\],_0x\w*\)/g;
    let regexResults3 = placeBlockRegex3.exec(remainingPart);
    let part2 = remainingPart.slice(0, placeBlockRegex3.lastIndex - regexResults3[0].length);
    let part3 = remainingPart.slice(placeBlockRegex3.lastIndex - regexResults3[0].length);

    let injectedPlaceBlockString =
      part1 +
      `this.injected_placeBlock?.(${variables[0]}, ${variables[1]}, ${variables[2]}, ${variables[3]}),` +
      part2 +
      `this.injected_beforePlaceBlockInDeadline?.(${variables[0]}, ${variables[1]}, ${variables[2]}, ${variables[3]}),` +
      part3;

    GameCore.prototype.placeBlock = new Function(
      ...getArguments(GameCore.prototype.placeBlock),
      injectedPlaceBlockString
    );
  }

  function injectIntoCheckLineClears() {
    GameCore.prototype.injected_clearHiddenRow1 = function () {};

    GameCore.prototype.injected_moveLinesDown = function (i) {};

    GameCore.prototype.injected_afterLinesMoved = function (row) {};

    let strippedLineClearsString = stripCurlyBrackets(GameCore.prototype.checkLineClears.toString());

    // Matches `this.deadline = [0,0,0,0,0,0,0,0,0,0]`.
    // There are two of them in the function, but only the first one is relevant here.
    const deadlineRegex = /this\[[^,\[\]]*?\]=\[([^,\[\]]*,){9}[^,\[\]]*\],/g;
    let regexResults1 = deadlineRegex.exec(strippedLineClearsString);
    let part1 = strippedLineClearsString.slice(0, deadlineRegex.lastIndex);
    let remainingPart = strippedLineClearsString.slice(deadlineRegex.lastIndex);

    // Matches `for (var i = row; i > 0; i--)`.
    // There are two interesting variables here: `i` and `row`.
    const forLoopRegex = /for\(var _0x\w*=_0x\w*;_0x\w*\[[^,\[\]]*\]\(_0x\w*,[^,\[\]\(\)]*\);_0x\w*--\)/g;
    let regexResults2 = forLoopRegex.exec(remainingPart);
    let part2 = remainingPart.slice(0, forLoopRegex.lastIndex);
    remainingPart = remainingPart.slice(forLoopRegex.lastIndex);

    let variables = [];
    const variableRegex = /_0x\w*/g;
    for (const i in [0, 1]) {
      let regexResult = variableRegex.exec(regexResults2[0]);
      variables.push(regexResult[0]);
    }

    const nextSemicolonRegex = /;/g;
    let regexResults3 = nextSemicolonRegex.exec(remainingPart);
    let part3 = remainingPart.slice(0, nextSemicolonRegex.lastIndex);
    remainingPart = remainingPart.slice(nextSemicolonRegex.lastIndex);

    let injectedLineClearString =
      part1 +
      `this.injected_clearHiddenRow1?.(),` +
      part2 +
      `\{this.injected_moveLinesDown?.(${variables[0]});` +
      part3 +
      `\};this.injected_afterLinesMoved?.(${variables[1]});` +
      remainingPart;

    GameCore.prototype.checkLineClears = new Function(
      ...getArguments(GameCore.prototype.checkLineClears),
      injectedLineClearString
    );
  }

  function injectIntoAddGarbage() {
    GameCore.prototype.injected_initConnectedGarbage = function (garbageLine) {};

    GameCore.prototype.injected_bumpUpConnections = function (trueHeight, amountOfLines) {};

    let strippedAddGarbageString = stripCurlyBrackets(GameCore.prototype.addGarbage.toString());

    // Matches `garbageLine[i] = 8 === garbageLine[i]` - the beginning of the ternary
    const invGarbageTernaryRegex = /_0x\w*\[_0x\w*\]=_0x\w*\[[^,\[\]]*\]\([^,\[\]]*,_0x\w*\[_0x\w*\]\)/g;
    let regexResults1_1 = invGarbageTernaryRegex.exec(strippedAddGarbageString);
    let nextPartToCheck = strippedAddGarbageString.slice(invGarbageTernaryRegex.lastIndex);

    // Matches the next semicolon - that's the injection point for the first function
    const nextSemicolonRegex = /;/g;
    let regexResults1_2 = nextSemicolonRegex.exec(nextPartToCheck);
    let part1 = strippedAddGarbageString.slice(0, invGarbageTernaryRegex.lastIndex + nextSemicolonRegex.lastIndex);
    let remainingPart = strippedAddGarbageString.slice(invGarbageTernaryRegex.lastIndex + nextSemicolonRegex.lastIndex);

    // Matches `trueHeight = this.matrix.length - this.solidHeight`
    const trueHeightRegex = /_0x\w*=_0x\w*\[[^,\[\]]*\]\(this\[[^,\[\]]*\]\[[^,\[\]]*\],this\[[^,\[\]]*\]/g;

    let trueHeightRegexResults = trueHeightRegex.exec(remainingPart);
    const variableRegex = /_0x\w*/g;

    let trueHeight = variableRegex.exec(trueHeightRegexResults[0])[0];

    // Matches `:garbageLine.slice(0);` - that's the injection point for the second function
    const garbageLineSliceRegex = /:_0x\w*\[[^,\[\]]*\]\([^,\[\]\(\)]*\);/g;
    let regexResults2 = garbageLineSliceRegex.exec(remainingPart);
    let part2 = remainingPart.slice(0, garbageLineSliceRegex.lastIndex);
    remainingPart = remainingPart.slice(garbageLineSliceRegex.lastIndex);

    // Find the `garbageLine` variable name

    variableRegex.lastIndex = 0;
    let garbageLine = variableRegex.exec(regexResults2[0])[0];

    // The `amountOfLines` variable is an argument for GameCore.prototype.addGarbage.

    let functionArguments = getArguments(GameCore.prototype.addGarbage);

    let amountOfLines = functionArguments[0];

    let injectedAddGarbageString =
      part1 +
      `this.injected_initConnectedGarbage?.(${garbageLine});` +
      part2 +
      `this.injected_bumpUpConnections?.(${trueHeight}, ${amountOfLines});` +
      remainingPart;

    GameCore.prototype.addGarbage = new Function(...functionArguments, injectedAddGarbageString);
  }

  function injectIntoReplayerAddGarbage() {
    // Same injection points as the GameCore add garbage method - the method is similar but not exactly.
    // (The GameCore method has 1 parameter, this one has 4)
    Replayer.prototype.injected_initConnectedGarbage = function (garbageLine) {};

    Replayer.prototype.injected_bumpUpConnections = function (trueHeight, amountOfLines) {};

    let strippedAddGarbageString = stripCurlyBrackets(Replayer.prototype.addGarbage.toString());

    // Matches `garbageLine[i] = 8 === garbageLine[i]` - the beginning of the ternary
    const invGarbageTernaryRegex = /_0x\w*\[_0x\w*\]=_0x\w*\[[^,\[\]]*\]\([^,\[\]]*,_0x\w*\[_0x\w*\]\)/g;
    let regexResults1_1 = invGarbageTernaryRegex.exec(strippedAddGarbageString);
    let nextPartToCheck = strippedAddGarbageString.slice(invGarbageTernaryRegex.lastIndex);

    // Matches the next semicolon - that's the injection point for the first function
    const nextSemicolonRegex = /;/g;
    let regexResults1_2 = nextSemicolonRegex.exec(nextPartToCheck);
    let part1 = strippedAddGarbageString.slice(0, invGarbageTernaryRegex.lastIndex + nextSemicolonRegex.lastIndex);
    let remainingPart = strippedAddGarbageString.slice(invGarbageTernaryRegex.lastIndex + nextSemicolonRegex.lastIndex);

    // Matches `trueHeight = this.matrix.length - this.solidHeight`
    const trueHeightRegex = /_0x\w*=_0x\w*\[[^,\[\]]*\]\(this\[[^,\[\]]*\]\[[^,\[\]]*\],this\[[^,\[\]]*\]/g;

    let trueHeightRegexResults = trueHeightRegex.exec(remainingPart);
    const variableRegex = /_0x\w*/g;

    let trueHeight = variableRegex.exec(trueHeightRegexResults[0])[0];

    // Matches `:garbageLine.slice(0);` - that's the injection point for the second function
    const garbageLineSliceRegex = /:_0x\w*\[[^,\[\]]*\]\([^,\[\]\(\)]*\);/g;
    let regexResults2 = garbageLineSliceRegex.exec(remainingPart);
    let part2 = remainingPart.slice(0, garbageLineSliceRegex.lastIndex);
    remainingPart = remainingPart.slice(garbageLineSliceRegex.lastIndex);

    // Find the `garbageLine` variable name

    variableRegex.lastIndex = 0;
    let garbageLine = variableRegex.exec(regexResults2[0])[0];

    // The `amountOfLines` variable is an argument for Replayer.prototype.addGarbage.

    let functionArguments = getArguments(Replayer.prototype.addGarbage);

    let amountOfLines = functionArguments[0];

    let injectedAddGarbageString =
      part1 +
      `this.injected_initConnectedGarbage?.(${garbageLine});` +
      part2 +
      `this.injected_bumpUpConnections?.(${trueHeight}, ${amountOfLines});` +
      remainingPart;

    Replayer.prototype.addGarbage = new Function(...functionArguments, injectedAddGarbageString);
  }

  function injectIntoStartPractice() {
    Game.prototype.injected_connectMap = function () {};

    let strippedStartPracticeString = stripCurlyBrackets(Game.prototype.startPractice.toString());

    // Matches `this.Replay.config.map = this.sprintMode = this.MapManager.mapId,`
    const mapIDbindingRegex =
      /this\[[^,\[\]]*\]\[[^,\[\]]*\]\[[^,\[\]]*\]=this\[[^,\[\]]*\]=this\[[^,\[\]]*\]\[[^,\[\]]*\],/g;
    let regexResults1 = mapIDbindingRegex.exec(strippedStartPracticeString);
    let part1 = strippedStartPracticeString.slice(0, mapIDbindingRegex.lastIndex);
    let remainingPart = strippedStartPracticeString.slice(mapIDbindingRegex.lastIndex);

    let injectedStartPracticeString = part1 + `this.injected_connectMap?.(),` + remainingPart;

    Game.prototype.startPractice = new Function(
      ...getArguments(Game.prototype.startPractice),
      injectedStartPracticeString
    );
  }

  function injectIntoExecCommand() {
    ModeManager.prototype.injected_connectMap = function () {}

    let strippedExecCommandString = stripCurlyBrackets(ModeManager.prototype.execCommand.toString());

    // Injection point
    const copyMatrixRegex =
      /this\[[^\[\]\,]*\]\[[^\[\]\,]*\]=_0x\w*\[[^\[\]\,]*\]\(copyMatrix,_0x\w*\);}/g;
    copyMatrixRegex.exec(strippedExecCommandString);

    let part1 = strippedExecCommandString.slice(0, copyMatrixRegex.lastIndex);
    let remainingPart = strippedExecCommandString.slice(copyMatrixRegex.lastIndex);

    let injectedExecCommandString =
      part1 + `this.injected_connectMap?.();` + remainingPart;

    ModeManager.prototype.execCommand = new Function(
      ...getArguments(ModeManager.prototype.execCommand),
      injectedExecCommandString
    );
  }

  if (typeof GameCore == "function") {
    injectIntoPlaceBlock();
    injectIntoCheckLineClears();
    injectIntoAddGarbage();
  }
  if (typeof Replayer == "function") {
    injectIntoReplayerAddGarbage();
  }
  if (typeof Game == "function") {
    injectIntoStartPractice();
  }
  if (typeof ModeManager == "function") {
    injectIntoExecCommand();
  }
}
