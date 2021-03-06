export const BLOCK_SIZE = 32 // each block is 32̨̣̌̇x32 pixel in size and equals 1m
export const RECIPROCAL = 1 / BLOCK_SIZE

export const STAGE_WIDTH = 32 // 32*32 = 1024 pixel wide stage
export const STAGE_HEIGHT = ~~(STAGE_WIDTH * 0.5625) // 16:9 😎

// the player position is fixed to the middle of the x axis
export const PLAYER_X = ~~(STAGE_WIDTH / 2) + 1
export const PLAYER_Y = ~~(STAGE_HEIGHT * 0.5) // fall from the center

export const GRAVITY = 10 // blocks per second

export const type = {
  air: {type: 'air', hp: Infinity, walkable: true},
  grass: {type: 'grass', hp: 1, walkable: false},

  tree_top_left: {type: 'tree_top_left', hp: 5, walkable: true},
  tree_top_middle: {type: 'tree_top_middle', hp: 5, walkable: true},
  tree_top_right: {type: 'tree_top_right', hp: 5, walkable: true},

  tree_crown_left: {type: 'tree_crown_left', hp: 5, walkable: true},
  tree_crown_middle: {type: 'tree_crown_middle', hp: 5, walkable: true, climbable: true},
  tree_crown_right: {type: 'tree_crown_right', hp: 5, walkable: true},

  tree_trunk_left: {type: 'tree_trunk_left', hp: 5, walkable: true},
  tree_trunk_middle: {type: 'tree_trunk_middle', hp: 5, walkable: true, climbable: true},
  tree_trunk_right: {type: 'tree_trunk_right', hp: 5, walkable: true},

  tree_root_left: {type: 'tree_root_left', hp: 5, walkable: true},
  tree_root_middle: {type: 'tree_root_middle', hp: 5, walkable: true, climbable: true},
  tree_root_right: {type: 'tree_root_right', hp: 5, walkable: true},

  tree_top_left_mixed: {type: 'tree_top_left_mixed', hp: 5, walkable: true},
  tree_crown_left_mixed: {type: 'tree_crown_left_mixed', hp: 5, walkable: true},
  tree_trunk_left_mixed: {type: 'tree_trunk_left_mixed', hp: 5, walkable: true},
  tree_root_left_mixed: {type: 'tree_root_left_mixed', hp: 5, walkable: true},

  tree_top_right_mixed: {type: 'tree_top_right_mixed', hp: 5, walkable: true},
  tree_crown_right_mixed: {type: 'tree_crown_right_mixed', hp: 5, walkable: true},
  tree_trunk_right_mixed: {type: 'tree_trunk_right_mixed', hp: 5, walkable: true},
  tree_root_right_mixed: {type: 'tree_root_right_mixed', hp: 5, walkable: true},

  soil: {type: 'soil', hp: 2, walkable: false},
  soil_gravel: {type: 'soil_gravel', hp: 5, walkable: false},
  stone_gravel: {type: 'stone_gravel', hp: 5, walkable: false},
  stone: {type: 'stone', hp: 10, walkable: false},
  bedrock: {type: 'bedrock', hp: 25, walkable: false},
  cave: {type: 'cave', hp: Infinity, walkable: true}
}

export const level = {
  treeTop: 24,
  ground: 28,
  rock: 32,
  underground: 48,
  cave_max: 250
}

export const probability = {
  tree: 0.2,
  soil_hole: 0.3,
  soil_gravel: 0.2,
  stone_gravel: 0.1,
  cave: 0.5,
  fray: 0.4
}
