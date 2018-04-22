export const type = {
  air: {type: 'air', hp: 0},
  grass: {type: 'grass', hp: 1},
  leaves: {type: 'leaves', hp: 1},
  wood: {type: 'wood', hp: 5},
  soil: {type: 'soil', hp: 2},
  gravel: {type: 'gravel', hp: 5},
  stone: {type: 'stone', hp: 10},
  bedrock: {type: 'bedrock', hp: 25},
  cave: {type: 'cave', hp: 0}
}

export const level = {
  peak: 24,
  ground: 28,
  rock: 32,
  underground: 48,
  cave_max: 250
}

export const probability = {
  tree: 0.1,
  soil_hole: 0.3,
  soil_gravel: 0.2,
  rock_gravel: 0.1,
  cave: 0.5,
  fray: 0.4
}
