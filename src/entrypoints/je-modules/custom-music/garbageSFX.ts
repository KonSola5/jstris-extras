export function initGarbageSFX() {
  const oldAddGarbage = GameCore.prototype.addGarbage;
  GameCore.prototype.addGarbage = function(amountOfLines: number, ...args) {
    const returnValue = oldAddGarbage.apply(this, [amountOfLines, ...args])
    if (amountOfLines > 0) this.playSound("garbage");
    return returnValue;
  }
}