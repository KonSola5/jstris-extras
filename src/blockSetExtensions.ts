// NW N NE
// W  ?  E
// SW S SE

interface PieceDefinition {
  name: string;
  connections: [number[][], number[][], number[][], number[][]]
  xpOverride?: [number, number]
  ypOverride?: [number, number]
  centerX?: [number, number]
  centerY?: [number, number]
}

export function getBlockSetsEX() {
  class BlockSetEX {
    name: string;
    pieces: PieceDefinition[];
    previewAs?: BlockSetEX;
    constructor() {
      this.name = "";
      this.pieces = [];
    }
  }

  const NW = 1,
    N = 2,
    NE = 4,
    W = 8,
    E = 16,
    SW = 32,
    S = 64,
    SE = 128;
  const ALL = 255,
    FULL_N = NW + N + NE + W + E,
    FULL_W = NW + N + W + SW + S,
    FULL_E = N + NE + E + S + SE,
    FULL_S = W + E + SW + S + SE;

  const bsStandard = new BlockSetEX();
  bsStandard.pieces = [
    {
      name: "I",
      xpOverride: [0, 3],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0],
          [E, W + E, W + E, W],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, S, 0],
          [0, 0, N + S, 0],
          [0, 0, N + S, 0],
          [0, 0, N, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [E, W + E, W + E, W],
          [0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0],
          [0, N + S, 0, 0],
          [0, N + S, 0, 0],
          [0, N, 0, 0],
        ],
      ],
    },
    {
      name: "O",
      xpOverride: [1, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0],
          [0, S + E + SE, S + W + SW, 0],
          [0, N + E + NE, N + W + NW, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S + E + SE, S + W + SW, 0],
          [0, N + E + NE, N + W + NW, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S + E + SE, S + W + SW, 0],
          [0, N + E + NE, N + W + NW, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S + E + SE, S + W + SW, 0],
          [0, N + E + NE, N + W + NW, 0],
          [0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "T",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0],
          [0, S, 0, 0],
          [E, N + W + E, W, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S, 0, 0],
          [0, S + N + E, W, 0],
          [0, N, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [E, S + E + W, W, 0],
          [0, N, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S, 0, 0],
          [E, N + S + W, 0, 0],
          [0, N, 0, 0],
        ],
      ],
    },
    {
      name: "L",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0],
          [0, 0, S, 0],
          [E, W + E, W + N, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S, 0, 0],
          [0, S + N, 0, 0],
          [0, N + E, W, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [S + E, W + E, W, 0],
          [N, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [E, S + W, 0, 0],
          [0, N + S, 0, 0],
          [0, N, 0, 0],
        ],
      ],
    },
    {
      name: "J",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0],
          [S, 0, 0, 0],
          [N + E, W + E, W, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S + E, W, 0],
          [0, N + S, 0, 0],
          [0, N, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [E, W + E, W + S, 0],
          [0, 0, N, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S, 0, 0],
          [0, N + S, 0, 0],
          [E, W + N, 0, 0],
        ],
      ],
    },
    {
      name: "S",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0],
          [0, S + E, W, 0],
          [E, W + N, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S, 0, 0],
          [0, N + E, W + S, 0],
          [0, 0, N, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, S + E, W, 0],
          [E, W + N, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [S, 0, 0, 0],
          [N + E, W + S, 0, 0],
          [0, N, 0, 0],
        ],
      ],
    },
    {
      name: "Z",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0],
          [E, W + S, 0, 0],
          [0, N + E, W, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, 0, S, 0],
          [0, S + E, N + W, 0],
          [0, N, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [E, W + S, 0, 0],
          [0, N + E, W, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S, 0, 0],
          [S + E, N + W, 0, 0],
          [N, 0, 0, 0],
        ],
      ],
    },
  ];
  bsStandard.previewAs = bsStandard;

  const bsBigBlock2 = new BlockSetEX();
  bsBigBlock2.pieces = [
    {
      name: "I",
      xpOverride: [0, 3],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [E + S + SE, FULL_S, FULL_S, FULL_S, FULL_S, FULL_S, FULL_S, W + S + SW],
          [N + E + NE, FULL_N, FULL_N, FULL_N, FULL_N, FULL_N, FULL_N, N + W + NW],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, S + E + SE, S + W + SW, 0, 0],
          [0, 0, 0, 0, FULL_E, FULL_W, 0, 0],
          [0, 0, 0, 0, FULL_E, FULL_W, 0, 0],
          [0, 0, 0, 0, FULL_E, FULL_W, 0, 0],
          [0, 0, 0, 0, FULL_E, FULL_W, 0, 0],
          [0, 0, 0, 0, FULL_E, FULL_W, 0, 0],
          [0, 0, 0, 0, FULL_E, FULL_W, 0, 0],
          [0, 0, 0, 0, N + E + NE, N + W + NW, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [E + S + SE, FULL_S, FULL_S, FULL_S, FULL_S, FULL_S, FULL_S, W + S + SW],
          [N + E + NE, FULL_N, FULL_N, FULL_N, FULL_N, FULL_N, FULL_N, N + W + NW],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
        ],
        [
          [0, 0, S + E + SE, S + W + SW, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, N + E + NE, N + W + NW, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "O",
      xpOverride: [1, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, S + E + SE, FULL_S, FULL_S, S + W + SW, 0, 0],
          [0, 0, FULL_E, ALL, ALL, FULL_W, 0, 0],
          [0, 0, FULL_E, ALL, ALL, FULL_W, 0, 0],
          [0, 0, N + E + NE, FULL_N, FULL_N, N + W + NW, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, S + E + SE, FULL_S, FULL_S, S + W + SW, 0, 0],
          [0, 0, FULL_E, ALL, ALL, FULL_W, 0, 0],
          [0, 0, FULL_E, ALL, ALL, FULL_W, 0, 0],
          [0, 0, N + E + NE, FULL_N, FULL_N, N + W + NW, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, S + E + SE, FULL_S, FULL_S, S + W + SW, 0, 0],
          [0, 0, FULL_E, ALL, ALL, FULL_W, 0, 0],
          [0, 0, FULL_E, ALL, ALL, FULL_W, 0, 0],
          [0, 0, N + E + NE, FULL_N, FULL_N, N + W + NW, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, S + E + SE, FULL_S, FULL_S, S + W + SW, 0, 0],
          [0, 0, FULL_E, ALL, ALL, FULL_W, 0, 0],
          [0, 0, FULL_E, ALL, ALL, FULL_W, 0, 0],
          [0, 0, N + E + NE, FULL_N, FULL_N, N + W + NW, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "T",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, S + E + SE, S + W + SW, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [S + E + SE, FULL_S, ALL - NW, ALL - NE, FULL_S, W + S + SW, 0, 0],
          [N + E + NE, FULL_N, FULL_N, FULL_N, FULL_N, N + W + NW, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, S + E + SE, S + W + SW, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, ALL - NE, FULL_S, S + W + SW, 0, 0],
          [0, 0, FULL_E, ALL - SE, FULL_N, N + W + NW, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, N + E + NE, N + W + NW, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [S + E + SE, FULL_S, FULL_S, FULL_S, FULL_S, S + W + SW, 0, 0],
          [N + E + NE, FULL_N, ALL - SW, ALL - SE, FULL_N, N + W + NW, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, N + E + NE, N + W + NW, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, S + E + SE, S + W + SW, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [S + E + SE, FULL_S, ALL - NW, FULL_W, 0, 0, 0, 0],
          [N + E + NE, FULL_N, ALL - SW, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, N + E + NE, N + W + NW, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "L",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, S + E + SE, S + W + SW, 0, 0],
          [0, 0, 0, 0, FULL_E, FULL_W, 0, 0],
          [S + E + SE, FULL_S, FULL_S, FULL_S, ALL - NW, FULL_W, 0, 0],
          [N + E + NE, FULL_N, FULL_N, FULL_N, FULL_N, N + W + NW, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, S + E + SE, S + W + SW, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, ALL - NE, FULL_S, S + W + SW, 0, 0],
          [0, 0, N + E + NE, FULL_N, FULL_N, N + W + NW, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [S + E + SE, FULL_S, FULL_S, FULL_S, FULL_S, S + W + SW, 0, 0],
          [FULL_E, ALL - SE, FULL_N, FULL_N, FULL_N, N + W + NW, 0, 0],
          [FULL_E, FULL_W, 0, 0, 0, 0, 0, 0],
          [N + E + NE, N + W + NW, 0, 0, 0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [S + E, W + E, W, 0],
          // [N, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [S + E + SE, FULL_S, FULL_S, S + W + SW, 0, 0, 0, 0],
          [N + E + NE, FULL_N, ALL - SW, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, N + E + NE, N + W + NW, 0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [E, S + W, 0, 0],
          // [0, N + S, 0, 0],
          // [0, N, 0, 0],
        ],
      ],
    },
    {
      name: "J",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [S + E + SE, S + W + SW, 0, 0, 0, 0, 0, 0],
          [FULL_E, FULL_W, 0, 0, 0, 0, 0, 0],
          [FULL_E, ALL - NE, FULL_S, FULL_S, FULL_S, S + W + SW, 0, 0],
          [N + E + NE, FULL_N, FULL_N, FULL_N, FULL_N, N + W + NW, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [S, 0, 0, 0],
          // [N + E, W + E, W, 0],
          // [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, S + E + SE, FULL_S, FULL_S, S + W + SW, 0, 0],
          [0, 0, FULL_E, ALL - SE, FULL_N, N + W + NW, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, N + E + NE, N + W + NW, 0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [0, S + E, W, 0],
          // [0, N + S, 0, 0],
          // [0, N, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [S + E + SE, FULL_S, FULL_S, FULL_S, FULL_S, S + W + SW, 0, 0],
          [N + E + NE, FULL_N, FULL_N, FULL_N, ALL - SW, FULL_W, 0, 0],
          [0, 0, 0, 0, FULL_E, FULL_W, 0, 0],
          [0, 0, 0, 0, N + E + NE, N + W + NW, 0, 0],
          // [0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [E, W + E, W + S, 0],
          // [0, 0, N, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, S + E + SE, S + W + SW, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [S + E + SE, FULL_S, ALL - NW, FULL_W, 0, 0, 0, 0],
          [N + E + NE, FULL_N, FULL_N, N + W + NW, 0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [0, S, 0, 0],
          // [0, N + S, 0, 0],
          // [E, W + N, 0, 0],
        ],
      ],
    },
    {
      name: "S",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, S + E + SE, FULL_S, FULL_S, S + W + SW, 0, 0],
          [0, 0, FULL_E, ALL - SE, FULL_N, N + W + NW, 0, 0],
          [S + E + SE, FULL_S, ALL - NW, FULL_W, 0, 0, 0, 0],
          [N + E + NE, FULL_N, FULL_N, N + W + NW, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [0, S + E, W, 0],
          // [E, W + N, 0, 0],
          // [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, S + E + SE, S + W + SW, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, ALL - NE, FULL_S, S + W + SW, 0, 0],
          [0, 0, N + E + NE, FULL_N, ALL - SW, FULL_W, 0, 0],
          [0, 0, 0, 0, FULL_E, FULL_W, 0, 0],
          [0, 0, 0, 0, N + E + NE, N + W + NW, 0, 0],
          // [0, 0, 0, 0],
          // [0, S, 0, 0],
          // [0, N + E, W + S, 0],
          // [0, 0, N, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, S + E + SE, FULL_S, FULL_S, S + W + SW, 0, 0],
          [0, 0, FULL_E, ALL - SE, FULL_N, N + W + NW, 0, 0],
          [S + E + SE, FULL_S, ALL - NW, FULL_W, 0, 0, 0, 0],
          [N + E + NE, FULL_N, FULL_N, N + W + NW, 0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [0, S + E, W, 0],
          // [E, W + N, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [S + E + SE, S + W + SW, 0, 0, 0, 0, 0, 0],
          [FULL_E, FULL_W, 0, 0, 0, 0, 0, 0],
          [FULL_E, ALL - NE, FULL_S, S + W + SW, 0, 0, 0, 0],
          [N + E + NE, FULL_N, ALL - SW, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, N + E + NE, N + W + NW, 0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [S, 0, 0, 0],
          // [N + E, W + S, 0, 0],
          // [0, N, 0, 0],
        ],
      ],
    },
    {
      name: "Z",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [S + E + SE, FULL_S, FULL_S, S + W + SW, 0, 0, 0, 0],
          [N + E + NE, FULL_N, ALL - SW, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, ALL - NE, FULL_S, S + W + SW, 0, 0],
          [0, 0, N + E + NE, FULL_N, FULL_N, N + W + NW, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [E, W + S, 0, 0],
          // [0, N + E, W, 0],
          // [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, S + E + SE, S + W + SW, 0, 0],
          [0, 0, 0, 0, FULL_E, FULL_W, 0, 0],
          [0, 0, S + E + SE, FULL_S, ALL - NW, FULL_W, 0, 0],
          [0, 0, FULL_E, ALL - SE, FULL_N, N + W + NW, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [0, 0, N + E + NE, N + W + NW, 0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [0, 0, S, 0],
          // [0, S + E, N + W, 0],
          // [0, N, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [S + E + SE, FULL_S, FULL_S, S + W + SW, 0, 0, 0, 0],
          [N + E + NE, FULL_N, ALL - SW, FULL_W, 0, 0, 0, 0],
          [0, 0, FULL_E, ALL - NE, FULL_S, S + W + SW, 0, 0],
          [0, 0, N + E + NE, FULL_N, FULL_N, N + W + NW, 0, 0],
          // [0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [E, W + S, 0, 0],
          // [0, N + E, W, 0],
        ],
        [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, S + E + SE, S + W + SW, 0, 0, 0, 0],
          [0, 0, FULL_E, FULL_W, 0, 0, 0, 0],
          [S + E + SE, FULL_S, ALL - NW, FULL_W, 0, 0, 0, 0],
          [FULL_E, ALL - SE, FULL_N, N + W + NW, 0, 0, 0, 0],
          [FULL_E, FULL_W, 0, 0, 0, 0, 0, 0],
          [N + E + NE, N + W + NW, 0, 0, 0, 0, 0, 0],
          // [0, 0, 0, 0],
          // [0, S, 0, 0],
          // [S + E, N + W, 0, 0],
          // [N, 0, 0, 0],
        ],
      ],
    },
  ];
  bsBigBlock2.previewAs = bsStandard;

  const bsBigBlock1 = new BlockSetEX();
  bsBigBlock1.pieces = bsBigBlock2.pieces;
  bsBigBlock1.previewAs = bsStandard;

  const bsArikaRS = new BlockSetEX();
  bsArikaRS.pieces = [
    {
      name: "I",
      xpOverride: [0, 3],
      ypOverride: [1, 1],
      connections: [
        [
          [0, 0, 0, 0],
          [E, W + E, W + E, W],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, S, 0],
          [0, 0, N + S, 0],
          [0, 0, N + S, 0],
          [0, 0, N, 0],
        ],
        [
          [0, 0, 0, 0],
          [E, W + E, W + E, W],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, S, 0],
          [0, 0, N + S, 0],
          [0, 0, N + S, 0],
          [0, 0, N, 0],
        ],
      ],
    },
    {
      name: "O",
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0],
          [0, S + E + SE, S + W + SW, 0],
          [0, N + E + NE, N + W + NW, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S + E + SE, S + W + SW, 0],
          [0, N + E + NE, N + W + NW, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S + E + SE, S + W + SW, 0],
          [0, N + E + NE, N + W + NW, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S + E + SE, S + W + SW, 0],
          [0, N + E + NE, N + W + NW, 0],
          [0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "T",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0],
          [E, S + E + W, W, 0],
          [0, N, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0],
          [E, N + S + W, 0, 0],
          [0, N, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S, 0, 0],
          [E, N + W + E, W, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0],
          [0, S + N + E, W, 0],
          [0, N, 0, 0],
          [0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "L",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0],
          [S + E, W + E, W, 0],
          [N, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [E, S + W, 0, 0],
          [0, N + S, 0, 0],
          [0, N, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, 0, S, 0],
          [E, W + E, W + N, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0],
          [0, S + N, 0, 0],
          [0, N + E, W, 0],
          [0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "J",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0],
          [E, W + E, W + S, 0],
          [0, 0, N, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0],
          [0, N + S, 0, 0],
          [E, W + N, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [S, 0, 0, 0],
          [N + E, W + E, W, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, S + E, W, 0],
          [0, N + S, 0, 0],
          [0, N, 0, 0],
          [0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "S",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0],
          [0, S + E, W, 0],
          [E, W + N, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [S, 0, 0, 0],
          [N + E, W + S, 0, 0],
          [0, N, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, S + E, W, 0],
          [E, W + N, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [S, 0, 0, 0],
          [N + E, W + S, 0, 0],
          [0, N, 0, 0],
          [0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "Z",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0],
          [E, W + S, 0, 0],
          [0, N + E, W, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0],
          [S + E, N + W, 0, 0],
          [N, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0],
          [E, W + S, 0, 0],
          [0, N + E, W, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0],
          [S + E, N + W, 0, 0],
          [N, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      ],
    },
  ];
  bsArikaRS.previewAs = bsArikaRS;

  const bsPentomino = new BlockSetEX();
  bsPentomino.pieces = [
    {
      name: "I5",
      xpOverride: [0, 4],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [E, W + E, W + E, W + E, W],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [E, W + E, W + E, W + E, W],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N, 0, 0],
        ],
      ],
    },
    {
      name: "V5",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, S, 0, 0],
          [0, 0, N + S, 0, 0],
          [E, W + E, W + N, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [S, 0, 0, 0, 0],
          [N + S, 0, 0, 0, 0],
          [N + E, W + E, W, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [S + E, W + E, W, 0, 0],
          [N + S, 0, 0, 0, 0],
          [N, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [E, W + E, W + S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "T5",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, E, W + N + E, W, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, 0, S, 0, 0],
          [0, 0, N + E + S, W + E, W],
          [0, 0, N, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, E, W + S + E, W, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, 0, S, 0, 0],
          [E, W + E, N + W + S, 0, 0],
          [0, 0, N, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "U",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [S, 0, S, 0, 0],
          [N + E, W + E, W + N, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, S + E, W, 0, 0],
          [0, N + S, 0, 0, 0],
          [0, N + E, W, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [S + E, W + E, W + S, 0, 0],
          [N, 0, N, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [E, S + W, 0, 0, 0],
          [0, N + S, 0, 0, 0],
          [E, N + W, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "W",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, S, 0, 0],
          [0, S + E, W + N, 0, 0],
          [E, W + N, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [S, 0, 0, 0, 0],
          [N + E, S + W, 0, 0, 0],
          [0, N + E, W, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, S + E, W, 0, 0],
          [S + E, N + W, 0, 0, 0],
          [N, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [E, S + W, 0, 0, 0],
          [0, N + E, S + W, 0, 0],
          [0, 0, N, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "X",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, S, 0, 0, 0],
          [E, N + W + E + S, W, 0, 0],
          [0, N, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0, 0],
          [E, N + W + E + S, W, 0, 0],
          [0, N, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0, 0],
          [E, N + W + E + S, W, 0, 0],
          [0, N, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0, 0],
          [E, N + W + E + S, W, 0, 0],
          [0, N, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "J5",
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0, 0],
          [0, S, 0, 0, 0],
          [0, N + E, W + E, W + E, W],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, 0, S + E, W, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [E, W + E, W + E, S + W, 0],
          [0, 0, 0, N, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, E, W + N, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "L5",
      xpOverride: [0, 3],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0, 0],
          [0, 0, 0, S, 0],
          [E, W + E, W + E, W + N, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N + E, W, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, S + E, W + E, W + E, W],
          [0, N, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, E, W + S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N, 0, 0],
        ],
      ],
    },
    {
      name: "N'",
      xpOverride: [0, 3],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0, 0],
          [0, 0, S + E, W, 0],
          [E, W + E, W + N, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N + E, W + S, 0],
          [0, 0, 0, N, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, S + E, W + E, W],
          [0, E, W + N, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, S, 0, 0, 0],
          [0, N + E, W + S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N, 0, 0],
        ],
      ],
    },
    {
      name: "N",
      xpOverride: [0, 3],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0, 0],
          [0, E, W + S, 0, 0],
          [0, 0, N + E, W + E, W],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, 0, 0, S, 0],
          [0, 0, S + E, W + N, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [E, W + E, W + S, 0, 0],
          [0, 0, N + E, W, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, S + E, N + W, 0, 0],
          [0, N, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "Y",
      xpOverride: [0, 3],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0, 0],
          [0, 0, S, 0, 0],
          [E, W + E, W + N + E, W, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N + E + S, W, 0],
          [0, 0, N, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, E, S + E + W, W + E, W],
          [0, 0, N, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, 0, S, 0, 0],
          [0, E, N + W + S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N, 0, 0],
        ],
      ],
    },
    {
      name: "Y'",
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0, 0, 0],
          [0, 0, S, 0, 0],
          [0, E, N + W + E, W + E, W],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, 0, S, 0, 0],
          [0, 0, N + E + S, W, 0],
          [0, 0, N + S, 0, 0],
          [0, 0, N, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [E, W + E, W + E + S, W, 0],
          [0, 0, N, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, S, 0, 0],
          [0, 0, N + S, 0, 0],
          [0, E, N + W + S, 0, 0],
          [0, 0, N, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "P",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [S + E + SE, W + S + SW, 0, 0, 0],
          [N + E + NE, N + W + E + NW, W, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, S + E + SE, S + W + SW, 0, 0],
          [0, N + E + NE + S, N + W + NW, 0, 0],
          [0, N, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [E, W + E + S + SE, W + S + SW, 0, 0],
          [0, N + E + NE, N + W + NW, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0, 0],
          [S + E + SE, N + W + S + SW, 0, 0, 0],
          [N + E + NE, N + W + NW, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "Q",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, S + E + SE, S + W + SW, 0, 0],
          [E, N + E + W + NE, N + W + NW, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0, 0],
          [0, N + E + S + SE, S + W + SW, 0, 0],
          [0, N + E + NE, N + W + NW, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, 0, 0, 0],
          [S + E + SE, S + E + W + SW, W, 0, 0],
          [N + E + NE, N + W + NW, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [S + E + SE, S + W + SW, 0, 0, 0],
          [N + E + NE, N + S + W + NW, 0, 0, 0],
          [0, N, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "F",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [S, 0, 0, 0, 0],
          [N + E, W + E + S, W, 0, 0],
          [0, N, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, E + S, W, 0, 0],
          [E, N + W + S, 0, 0, 0],
          [0, N, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0, 0],
          [E, N + W + E, S + W, 0, 0],
          [0, 0, N, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0, 0],
          [0, N + E + S, W, 0, 0],
          [E, N + W, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "F'",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, S, 0, 0],
          [E, W + E + S, N + W, 0, 0],
          [0, N, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0, 0],
          [E, N + W + S, 0, 0, 0],
          [0, N + E, W, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, S, 0, 0, 0],
          [S + E, N + W + E, W, 0, 0],
          [N, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [E, W + S, 0, 0, 0],
          [0, N + E + S, W, 0, 0],
          [0, N, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "Z5",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, S, 0, 0],
          [S + E, W + E, W + N, 0, 0],
          [N, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [E, W + S, 0, 0, 0],
          [0, N + S, 0, 0, 0],
          [0, N + E, W, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, 0, S, 0, 0],
          [S + E, W + E, W + N, 0, 0],
          [N, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [E, W + S, 0, 0, 0],
          [0, N + S, 0, 0, 0],
          [0, N + E, W, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    },
    {
      name: "S5",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [S, 0, 0, 0, 0],
          [N + E, W + E, S + W, 0, 0],
          [0, 0, N, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, S + E, W, 0, 0],
          [0, N + S, 0, 0, 0],
          [E, N + W, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [S, 0, 0, 0, 0],
          [N + E, W + E, S + W, 0, 0],
          [0, 0, N, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
        [
          [0, S + E, W, 0, 0],
          [0, N + S, 0, 0, 0],
          [E, N + W, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    },
  ];
  bsPentomino.previewAs = bsPentomino;

  const bsM123 = new BlockSetEX();
  bsM123.pieces = [
    {
      name: "O1",
      xpOverride: [0, 0],
      ypOverride: [1, 2],
      connections: [[[0]], [[0]], [[0]], [[0]]],
    },
    {
      name: "I2",
      xpOverride: [0, 1],
      ypOverride: [1, 2],
      connections: [
        [
          [E, W],
          [0, 0],
        ],
        [
          [0, S],
          [0, N],
        ],
        [
          [0, 0],
          [E, W],
        ],
        [
          [S, 0],
          [N, 0],
        ],
      ],
    },
    {
      name: "I3",
      xpOverride: [0, 2],
      ypOverride: [1, 2],
      connections: [
        [
          [0, 0, 0],
          [E, W + E, W],
          [0, 0, 0],
        ],
        [
          [0, S, 0],
          [0, N + S, 0],
          [0, N, 0],
        ],
        [
          [0, 0, 0],
          [E, W + E, W],
          [0, 0, 0],
        ],
        [
          [0, S, 0],
          [0, N + S, 0],
          [0, N, 0],
        ],
      ],
    },
    {
      name: "V3",
      xpOverride: [0, 1],
      ypOverride: [1, 2],
      connections: [
        [
          [S, 0, 0],
          [N + E, W, 0],
          [0, 0, 0],
        ],
        [
          [S + E, W, 0],
          [N, 0, 0],
          [0, 0, 0],
        ],
        [
          [E, S + W, 0],
          [0, N, 0],
          [0, 0, 0],
        ],
        [
          [0, S, 0],
          [E, N + W, 0],
          [0, 0, 0],
        ],
      ],
    },
  ];
  bsPentomino.previewAs = bsPentomino;
  const bsAll29 = new BlockSetEX();
  bsAll29.pieces = bsStandard.pieces.slice().concat(bsM123.pieces.slice()).concat(bsPentomino.pieces.slice());
  bsAll29.previewAs = bsAll29;
  const bsCultris2 = new BlockSetEX();
  bsCultris2.pieces = bsStandard.pieces;
  bsCultris2.previewAs = bsCultris2;
  const bsOSpin = new BlockSetEX();
  bsOSpin.pieces = structuredClone(bsStandard.pieces);
  bsOSpin.pieces[1].name = "O+";
  bsOSpin.pieces[1].connections = [
    [
      [0, 0, 0, 0],
      [0, S + E + SE, S + W + SW, 0],
      [0, N + E + NE, N + W + NW, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [S + E, W + E, W, 0],
      [N, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [S, 0, 0, 0],
      [N + E + S, W, 0, 0],
      [N, 0, 0, 0],
    ],
    [
      [S + E + SE, FULL_S, FULL_S, S + W + SW],
      [FULL_E, ALL, ALL, FULL_W],
      [FULL_E, ALL, ALL, FULL_W],
      [N + E + NE, FULL_N, FULL_N, N + W + NW],
    ],
  ];
  bsOSpin.previewAs = bsOSpin;
  const bsNONE = new BlockSetEX();
  bsNONE.pieces = [
    {
      name: "NONE",
      xpOverride: [0, 0],
      ypOverride: [1, 2],
      connections: [[[0]], [[0]], [[0]], [[0]]],
    },
  ];
  bsNONE.previewAs = bsNONE;

  return [bsStandard, bsBigBlock2, bsBigBlock1, bsArikaRS, bsPentomino, bsM123, bsAll29, bsCultris2, bsOSpin, bsNONE];
}
