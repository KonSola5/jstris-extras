/**
 * An enum for easier readability of modes.
 */
export const Modes = Object.freeze({
  SPRINT: 1,
  PRACTICE: 2,
  CHEESE_RACE: 3,
  SURVIVAL: 4,
  ULTRA: 5,
  MAPS: 6,
  TSD20: 7,
  PC_MODE: 8,
  USERMODE: 9,
  BOT: 10,
});

export const Actions = Object.freeze({
  MOVE_LEFT: 0,
  MOVE_RIGHT: 1,
  DAS_LEFT: 2,
  DAS_RIGHT: 3,
  ROTATE_LEFT: 4,
  ROTATE_RIGHT: 5,
  ROTATE_180: 6,
  HARD_DROP: 7,
  SOFT_DROP_BEGIN_END: 8,
  GRAVITY_STEP: 9,
  HOLD_BLOCK: 10,
  GARBAGE_ADD: 11,
  SGARBAGE_ADD: 12,
  REDBAR_SET: 13,
  ARR_MOVE: 14,
  AUX: 15,
});

export const AuxActions = Object.freeze({
  AFK: 0,
  BLOCK_SET: 1,
  MOVE_TO: 2,
  RANDOMIZER: 3,
  MATRIX_MOD: 4,
  WIDE_GARBAGE_ADD: 5,
});
