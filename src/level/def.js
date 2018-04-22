export const type = {
  air: {type: 'air', hp: 0, walkable: true},
  grass: {type: 'grass', hp: 1, walkable: true},
  leaves: {type: 'leaves', hp: 1, walkable: true},
  wood: {type: 'wood', hp: 5, walkable: true},
  soil: {type: 'soil', hp: 2, walkable: false},
  gravel: {type: 'gravel', hp: 5, walkable: false},
  stone: {type: 'stone', hp: 10, walkable: false},
  bedrock: {type: 'bedrock', hp: 25, walkable: false},
  cave: {type: 'cave', hp: 0, walkable: true},
  player: {type: 'player', hp: 10, background: 'air'}
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
