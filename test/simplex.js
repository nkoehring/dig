// Original from Stefan Gustavson's Java implementation,
// see http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// ported to JavaScript by Sean McCullough
// Adapted and Ported to ES6 by Norman Köhring <n‹Æt›koehr.in>

const { floor, sqrt } = Math
const grad3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
]

const F2 = 0.5 * (sqrt(3.0) - 1.0)
const G2 = (3.0 - sqrt(3.0)) / 6.0

function dot (i, x, y) {
  const g = grad3[i]
  return g[0] * x + g[1] * y
}

/**
 * Usage new SimplexNoise( r: { random: Callable } )
 */
const SimplexNoise = function (r = Math) {
  if (!r.hasOwnProperty('random') || !r.random.call) {
    throw new Error('optional first argument must contain a random function')
  }

  this.p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) this.p[i] = i
  // shuffle the array
  for (let i = 255; i > 0; i--) {
    const n = floor((i + 1) * r.random())
    const q = this.p[i]
    this.p[i] = this.p[n]
    this.p[n] = q
  }

  // To remove the need for index wrapping, double the permutation table length
  this.perm = new Uint8Array(512)
  this.permMod12 = new Uint8Array(512)
  for (let i = 0; i < 512; i++) {
    this.perm[i] = this.p[i & 255]
    this.permMod12[i] = this.perm[i] % 12
  }
}

SimplexNoise.prototype.noise = function (xin, yin) {
  // Skew the input space to determine which simplex cell we're in
  const s = (xin + yin) * F2 // Hairy factor for 2D
  const i = floor(xin + s)
  const j = floor(yin + s)
  const t = (i + j) * G2

  // The x,y distances from the unskewed cell origin
  const x0 = xin - (i - t)
  const y0 = yin - (j - t)

  // For the 2D case, the simplex shape is an equilateral triangle.

  // Determine which simplex we are in.
  // Offsets for second (middle) corner of simplex in (i,j) coords
  // lower triangle, XY order: (0,0)->(1,0)->(1,1) 
  const i1 = ~~(x0 > y0) // 1 if true, false otherwise
  // upper triangle, YX order: (0,0)->(0,1)->(1,1) 
  const j1 = ~~(!i1)     // 1 if i1 is 0, 0 otherwise

  // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
  // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
  // c = (3-sqrt(3))/6
  const x1 = x0 - i1 + G2 // Offsets for middle corner in (x,y) unskewed coords
  const y1 = y0 - j1 + G2
  const x2 = x0 - 1.0 + 2.0 * G2 // Offsets for last corner in (x,y) unskewed coords
  const y2 = y0 - 1.0 + 2.0 * G2

  // Work out the hashed gradient indices of the three simplex corners
  const ii = i & 255
  const jj = j & 255
  const gi0 = this.permMod12[ii + this.perm[jj]]
  const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]]
  const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]]

  // Calculate the noise contribution from the three corners
  // let n0, n1, n2
  const t0 = 0.5 - x0 * x0 - y0 * y0
  const t1 = 0.5 - x1 * x1 - y1 * y1
  const t2 = 0.5 - x2 * x2 - y2 * y2

  const n0 = t0 < 0 ? 0.0 : (t0 ** 4) * dot(gi0, x0, y0)  // (x,y) of grad3 used for 2D gradient
  const n1 = t1 < 0 ? 0.0 : (t1 ** 4) * dot(gi1, x1, y1)
  const n2 = t2 < 0 ? 0.0 : (t2 ** 4) * dot(gi2, x2, y2)

  // Add contributions from each corner to get the final noise value.
  // The result is scaled to return values in the interval [-1,1].
  return 70.14805770653952 * (n0 + n1 + n2)
}

// export default SimplexNoise
