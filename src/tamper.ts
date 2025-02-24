/* A function designed for injecting stuff in the middle of functions by:
  - stringifying the function,
  - finding appropriate patterns and stuff in the function,
  - re-building the function using the Function object constructor.

  All injections can short-circuit in cases where somehow the injected functions aren't initialized properly (like in the case of Live opponent boards).
*/
// TODO: Cleaner way to perform those injections.
// TODO: 
export function initTamper() {
  // This function needs to accept any function, otherwise I would have to stringify functions beforehand.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  function getArguments(theFunction: Function): string[] {
    let args: string[] = [];
    const argsMatches = theFunction
      .toString()
      .match(/function\s*(?:[_a-zA-Z]\w*\s*)?\(((?:(?:[_a-zA-Z]\w*)\s*,\s*?)*(?:[_a-zA-Z]\w*)?)\)/);
    if (argsMatches && argsMatches.length > 1) {
      args = argsMatches[1].split(/\s*,\s*/g);
      return args;
    }
    return [];
  }

  function stripCurlyBrackets(functionString: string): string {
    const firstCurlyBracketRegex = /\{/g;
    firstCurlyBracketRegex.exec(functionString);
    const firstCurlyBracket: number = firstCurlyBracketRegex.lastIndex;
    return functionString.slice(firstCurlyBracket, -1);
  }

  function injectIntoPlaceBlock() {
    const placeBlockString = GameCore.prototype.placeBlock.toString();

    const strippedPlaceBlockString = stripCurlyBrackets(placeBlockString);

    // Matches:
    // `this["matrix"][obfuscatedAdd(y, i)][obfuscatedAdd(x, j)]`
    const placeBlockRegex1 =
      /this\[[^,[\]]*\]\[_0x\w*\[_0x\w*\(0x\w*\)\]\(_0x\w*,_0x\w*\)\]\[_0x\w*\[_0x\w*\(0x\w*\)\]\(_0x\w*,_0x\w*\)\]/g;

    const regexResults1 = placeBlockRegex1.exec(strippedPlaceBlockString); // This contains the wanted variables.
    if (!regexResults1) throw new TypeError("regexResults1 has no results!")
    const stringWithVariables = regexResults1[0];
    const index1 = placeBlockRegex1.lastIndex;
    // Slices after the regex match!
    const slicedFunction1 = strippedPlaceBlockString.slice(index1);

    // Now find strings like (__,__) in the string found previously - these hold wanted variables
    const variables = [];

    let array1, array2;

    const variableBracketRegex = /\(\w*,\w*\)/g;
    const variableRegex = /_0x\w*/g;
    while ((array1 = variableBracketRegex.exec(stringWithVariables)) !== null) {
      while ((array2 = variableRegex.exec(array1[0])) !== null) {
        variables.push(array2[0]);
      }
    }

    // Matches: `),` - that's the injection point
    const placeBlockRegex2 = /\),/g;
    placeBlockRegex2.exec(slicedFunction1);
    const part1 = strippedPlaceBlockString.slice(0, index1 + placeBlockRegex2.lastIndex);
    const remainingPart = strippedPlaceBlockString.slice(index1 + placeBlockRegex2.lastIndex);

    const placeBlockRegex3 =
      /this\[[^,[\]]*\]\[_0x\w*\[[^,[\]]*\]\(_0x\w*,_0x\w*\)\]=_0x\w*\[[^,[\]]*\]\(_0x\w*\[[^,[\]]*\],_0x\w*\)/g;
    const regexResults3 = placeBlockRegex3.exec(remainingPart);
    if (!regexResults3) throw new TypeError("regexResults3 has no results!")
    const part2 = remainingPart.slice(0, placeBlockRegex3.lastIndex - regexResults3[0].length);
    const part3 = remainingPart.slice(placeBlockRegex3.lastIndex - regexResults3[0].length);

    const injectedPlaceBlockString =
      part1 +
      `this.injected_placeBlock?.(${variables[0]}, ${variables[1]}, ${variables[2]}, ${variables[3]}),` +
      part2 +
      `this.injected_beforePlaceBlockInDeadline?.(${variables[0]}, ${variables[1]}, ${variables[2]}, ${variables[3]}),` +
      part3;

    GameCore.prototype.placeBlock = new Function(
      ...getArguments(GameCore.prototype.placeBlock),
      injectedPlaceBlockString
    ) as typeof GameCore.prototype.placeBlock
  }

  function injectIntoCheckLineClears() {
    const strippedLineClearsString = stripCurlyBrackets(GameCore.prototype.checkLineClears.toString());
    // Matches `this.deadline = [0,0,0,0,0,0,0,0,0,0]`.
    // There are two of them in the function, but only the first one is relevant here.
    const deadlineRegex = /this\[[^,[\]]*?\]=\[([^,[\]]*,){9}[^,[\]]*\],/g;
    deadlineRegex.exec(strippedLineClearsString);
    const part1 = strippedLineClearsString.slice(0, deadlineRegex.lastIndex);
    let remainingPart = strippedLineClearsString.slice(deadlineRegex.lastIndex);

    // Matches `matrixCopy = copyMatrix(this.matrix)`.
    const matrixCopyRegex = /_0x\w*=_0x\w*\[[^,[\]]*?\]\(copyMatrix,this\[[^,[\]]*?\]\)/g;
    matrixCopyRegex.exec(remainingPart);
    const part2 = remainingPart.slice(0, matrixCopyRegex.lastIndex);
    remainingPart = remainingPart.slice(matrixCopyRegex.lastIndex);

    // Matches `for (var i = row; i > 0; i--)`.
    // There are two interesting variables here: `i` and `row`.
    const forLoopRegex = /for\(var _0x\w*=_0x\w*;_0x\w*\[[^,[\]]*\]\(_0x\w*,[^,[\]()]*\);_0x\w*--\)/g;
    const regexResults3 = forLoopRegex.exec(remainingPart);
    const part3 = remainingPart.slice(0, forLoopRegex.lastIndex);
    remainingPart = remainingPart.slice(forLoopRegex.lastIndex);

    const variables = [];
    const variableRegex = /_0x\w*/g;
    for (let i: number = 0; i < 2; i++) {
      const regexResult = variableRegex.exec(regexResults3![0]);
      if (!regexResult) throw new TypeError("regexResult has no results!")
      variables.push(regexResult[0]);
    }

    const nextSemicolonRegex = /;/g;
    nextSemicolonRegex.exec(remainingPart);
    const part4 = remainingPart.slice(0, nextSemicolonRegex.lastIndex);
    remainingPart = remainingPart.slice(nextSemicolonRegex.lastIndex);

    // Matches `this.animator = new LineClearAnimator(matrixCopy, linesToClear, this);`
    // Class names aren't obfuscated.
    // There are two interesting variables here: `matrxixCopy` and `linesToClear`.
    const newLineClearAnimatorRegex = /this\[[^,[\]]*?\]=new LineClearAnimator\((_0x\w*),(_0x\w*),this\)/g;
    remainingPart = remainingPart.replace(
      newLineClearAnimatorRegex,
      "this.injected_createLineClearAnimator?.($1, $2, connectionsCopy)"
    );

    const injectedLineClearString: string =
      `let connectionsCopy = null;` +
      part1 +
      `this.injected_clearHiddenRow1?.(),` +
      part2 +
      `,this.connections && (connectionsCopy = copyMatrix(this.connections))` +
      part3 +
      `{this.injected_moveLinesDown?.(${variables[0]});` +
      part4 +
      `};this.injected_afterLinesMoved?.(${variables[1]});` +
      remainingPart;

    GameCore.prototype.checkLineClears = new Function(
      ...getArguments(GameCore.prototype.checkLineClears),
      injectedLineClearString
    ) as typeof GameCore.prototype.checkLineClears;
  }

  function injectIntoAddGarbage() {
    const strippedAddGarbageString = stripCurlyBrackets(GameCore.prototype.addGarbage.toString());

    // Matches `garbageLine[i] = 8 === garbageLine[i]` - the beginning of the ternary
    const invGarbageTernaryRegex = /_0x\w*\[_0x\w*\]=_0x\w*\[[^,[\]]*\]\([^,[\]]*,_0x\w*\[_0x\w*\]\)/g;
    invGarbageTernaryRegex.exec(strippedAddGarbageString);
    const nextPartToCheck = strippedAddGarbageString.slice(invGarbageTernaryRegex.lastIndex);

    // Matches the next semicolon - that's the injection point for the first function
    const nextSemicolonRegex = /;/g;
    nextSemicolonRegex.exec(nextPartToCheck);
    const part1 = strippedAddGarbageString.slice(0, invGarbageTernaryRegex.lastIndex + nextSemicolonRegex.lastIndex);
    let remainingPart = strippedAddGarbageString.slice(invGarbageTernaryRegex.lastIndex + nextSemicolonRegex.lastIndex);

    // Matches `trueHeight = this.matrix.length - this.solidHeight`
    const trueHeightRegex = /_0x\w*=_0x\w*\[[^,[\]]*\]\(this\[[^,[\]]*\]\[[^,[\]]*\],this\[[^,[\]]*\]/g;

    const trueHeightRegexResults = trueHeightRegex.exec(remainingPart);
    if (!trueHeightRegexResults) throw new TypeError("trueHeightRegexResults has no results!")
    const variableRegex = /_0x\w*/g;

    const trueHeight = variableRegex.exec(trueHeightRegexResults[0])![0];

    // Matches `:garbageLine.slice(0);` - that's the injection point for the second function
    const garbageLineSliceRegex = /:_0x\w*\[[^,[\]]*\]\([^,[\]()]*\);/g;
    const regexResults2 = garbageLineSliceRegex.exec(remainingPart);
    const part2 = remainingPart.slice(0, garbageLineSliceRegex.lastIndex);
    remainingPart = remainingPart.slice(garbageLineSliceRegex.lastIndex);

    // Find the `garbageLine` variable name

    variableRegex.lastIndex = 0;
    const garbageLine = variableRegex.exec(regexResults2![0])![0];

    // The `amountOfLines` variable is an argument for GameCore.prototype.addGarbage.

    const functionArguments: string[] = getArguments(GameCore.prototype.addGarbage);

    const amountOfLines: string = functionArguments[0];

    const injectedAddGarbageString: string =
      part1 +
      `this.injected_initConnectedGarbage?.(${garbageLine});` +
      part2 +
      `this.injected_bumpUpConnections?.(${trueHeight}, ${amountOfLines});` +
      remainingPart;

    GameCore.prototype.addGarbage = new Function(...functionArguments, injectedAddGarbageString) as typeof GameCore.prototype.addGarbage
  }

  function injectIntoReplayerAddGarbage() {
    // Same injection points as the GameCore add garbage method - the method is similar but not exactly.
    // (The GameCore method has 1 parameter, this one has 4)
    const strippedAddGarbageString = stripCurlyBrackets(Replayer.prototype.addGarbage.toString());

    // Matches `garbageLine[i] = 8 === garbageLine[i]` - the beginning of the ternary
    const invGarbageTernaryRegex = /_0x\w*\[_0x\w*\]=_0x\w*\[[^,[\]]*\]\([^,[\]]*,_0x\w*\[_0x\w*\]\)/g;
    invGarbageTernaryRegex.exec(strippedAddGarbageString);
    const nextPartToCheck = strippedAddGarbageString.slice(invGarbageTernaryRegex.lastIndex);

    // Matches the next semicolon - that's the injection point for the first function
    const nextSemicolonRegex = /;/g;
    nextSemicolonRegex.exec(nextPartToCheck);
    const part1 = strippedAddGarbageString.slice(0, invGarbageTernaryRegex.lastIndex + nextSemicolonRegex.lastIndex);
    let remainingPart = strippedAddGarbageString.slice(invGarbageTernaryRegex.lastIndex + nextSemicolonRegex.lastIndex);

    // Matches `trueHeight = this.matrix.length - this.solidHeight`
    const trueHeightRegex = /_0x\w*=_0x\w*\[[^,[\]]*\]\(this\[[^,[\]]*\]\[[^,[\]]*\],this\[[^,[\]]*\]/g;

    const trueHeightRegexResults = trueHeightRegex.exec(remainingPart);
    const variableRegex = /_0x\w*/g;

    const trueHeight = variableRegex.exec(trueHeightRegexResults![0])![0];

    // Matches `:garbageLine.slice(0);` - that's the injection point for the second function
    const garbageLineSliceRegex = /:_0x\w*\[[^,[\]]*\]\([^,[\]()]*\);/g;
    const regexResults2 = garbageLineSliceRegex.exec(remainingPart);
    const part2 = remainingPart.slice(0, garbageLineSliceRegex.lastIndex);
    remainingPart = remainingPart.slice(garbageLineSliceRegex.lastIndex);

    // Find the `garbageLine` variable name

    variableRegex.lastIndex = 0;
    const garbageLine = variableRegex.exec(regexResults2![0])![0];

    // The `amountOfLines` variable is an argument for Replayer.prototype.addGarbage.

    const functionArguments = getArguments(Replayer.prototype.addGarbage);

    const amountOfLines = functionArguments[0];

    const injectedAddGarbageString =
      part1 +
      `this.injected_initConnectedGarbage?.(${garbageLine});` +
      part2 +
      `this.injected_bumpUpConnections?.(${trueHeight}, ${amountOfLines});` +
      remainingPart;

    Replayer.prototype.addGarbage = new Function(...functionArguments, injectedAddGarbageString) as typeof Replayer.prototype.addGarbage;
  }

  function injectIntoStartPractice() {
    const strippedStartPracticeString = stripCurlyBrackets(Game.prototype.startPractice.toString());

    // Matches `this.Replay.config.map = this.sprintMode = this.MapManager.mapId,`
    const mapIDbindingRegex =
      /this\[[^,[\]]*\]\[[^,[\]]*\]\[[^,[\]]*\]=this\[[^,[\]]*\]=this\[[^,[\]]*\]\[[^,[\]]*\],/g;
    mapIDbindingRegex.exec(strippedStartPracticeString);
    const part1 = strippedStartPracticeString.slice(0, mapIDbindingRegex.lastIndex);
    const remainingPart = strippedStartPracticeString.slice(mapIDbindingRegex.lastIndex);

    const injectedStartPracticeString = part1 + `this.injected_connectMap?.(),` + remainingPart;

    Game.prototype.startPractice = new Function(
      ...getArguments(Game.prototype.startPractice),
      injectedStartPracticeString
    ) as typeof Game.prototype.startPractice;
  }

  function injectIntoExecCommand() {
    ModeManager.prototype.injected_connectMap = function () {};

    const strippedExecCommandString = stripCurlyBrackets(ModeManager.prototype.execCommand.toString());

    // Injection point
    const copyMatrixRegex = /this\[[^[\],]*\]\[[^[\],]*\]=_0x\w*\[[^[\],]*\]\(copyMatrix,_0x\w*\);}/g;
    copyMatrixRegex.exec(strippedExecCommandString);

    const part1 = strippedExecCommandString.slice(0, copyMatrixRegex.lastIndex);
    const remainingPart = strippedExecCommandString.slice(copyMatrixRegex.lastIndex);

    const injectedExecCommandString = part1 + `this.injected_connectMap?.();` + remainingPart;

    ModeManager.prototype.execCommand = new Function(
      ...getArguments(ModeManager.prototype.execCommand),
      injectedExecCommandString
    ) as typeof ModeManager.prototype.execCommand;
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
