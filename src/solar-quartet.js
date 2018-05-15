/* Adapted from the original "Solar Quartet" by y0natan
 * https://codepen.io/y0natan/pen/MVvxBM
 * https://js1k.com/2018-coins/demo/3075
 */

// sunY sets the height of the sun and with this the time of the day
// where 0 is lowest (night) and -100 is highest (day), other values are possible
// but don't make much sense / difference
export default function drawFrame (canvas, ctx, width, height, grCanvas, grCtx, grWidth, grHeight, frame, sunY) {
  // reset canvas state
  canvas.width = width
  canvas.height = height
  grCanvas.width = grWidth
  grCanvas.height = grHeight

  const sunCenterX = grWidth / 2
  const sunCenterY = grHeight / 2 + sunY
  // Set the godrays' context fillstyle to a newly created gradient
  // which we also run through our abbreviator.
  let emissionGradient = grCtx.createRadialGradient(
      sunCenterX, sunCenterY, // The sun's center.
      0,                      // Start radius.
      sunCenterX, sunCenterY, // The sun's center.
      44                      // End radius.
  )
  grCtx.fillStyle = emissionGradient

  // Now we addColorStops. This needs to be a dark gradient because our
  // godrays effect will basically overlay it on top of itself many many times,
  // so anything lighter will result in lots of white.
  // If you're not space-bound you can add another stop or two, maybe fade out to black,
  // but this actually looks good enough.

  // we use different gradients for different day times (sunY):
  // > -25: night (black sky)
  // < -70: day (blue sky)
  // otherwise red (dawn / sunset)

  if (sunY < -25 && sunY > -70) { // dawn or sunset
    emissionGradient.addColorStop(.1, '#0C0804') // pixels in radius 0 to 4.4 (44 * .1).
    emissionGradient.addColorStop(.2, '#060201') // everything past radius 8.8.
  }

  // Now paint the gradient all over our godrays canvas.
  grCtx.fillRect(0, 0, grWidth, grHeight)

  // And set the fillstyle to black, we'll use it to paint our occlusion (mountains).
  grCtx.fillStyle = '#000'

  // Paint the sky
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height)
  if (sunY > -25) { // night
   skyGradient.addColorStop(0, '#001') // slight blue hue
   skyGradient.addColorStop(.7, '#004') // but mainly black
  } else if (sunY < -70) { // day
   skyGradient.addColorStop(0, '#79F') // blue with a light gradient
   skyGradient.addColorStop(.7, '#33A') // into more blue
  } else { // dawn / sunset
    skyGradient.addColorStop(0, '#2a3e55') // Blueish at the top.
    skyGradient.addColorStop(.7, '#8d4835') // Reddish at the bottom.
  }
  ctx.fillStyle = skyGradient
  ctx.fillRect(0, 0, width, height)

  // Our mountains will be made by summing up sine waves of varying frequencies and amplitudes.
  function mountainHeight(position, roughness) {
    // Our frequencies (prime numbers to avoid extra repetitions).
    // TODO: play with the numbers
    let frequencies = [1721, 947, 547, 233, 73, 31, 7]
    // Add them up.
    return frequencies.reduce((height, freq) => height * roughness - Math.cos(freq * position), 0)
  }

  // Draw 4 layers of mountains.
  for(let i = 0; i < 4; i++) {
    // Set the main canvas fillStyle to a shade of brown with variable lightness
    // (darker at the front)
    if (sunY > -25) { // night
     ctx.fillStyle = `hsl(5, 23%, ${4-i}%)`
    } else if (sunY < -70) { // day (TODO)
      ctx.fillStyle = `hsl(${220 - i*40}, 23%, ${33-i*6}%)`
    } else { // dawn / sunset
      ctx.fillStyle = `hsl(7, 23%, ${23-i*6}%)`
    }

    // For each column in our canvas...
    for(let x = width; x--;) {
      // Ok, I don't really remember the details here, basically the (frame+frame*i*i) makes the
      // near mountains move faster than the far ones. We divide by large numbers because our
      // mountains repeat at position 1/7*Math.PI*2 or something like that...
      let mountainPosition = (frame * 2 * i**2) / 1000 + x / 2000;
      // Make further mountains more jagged, adds a bit of realism and also makes the godrays
      // look nicer.
      let mountainRoughness = i / 19 - .5;
      // 128 is the middle, i * 25 moves the nearer mountains lower on the screen.
      let y = 128 + i * 25 + mountainHeight(mountainPosition, mountainRoughness) * 45;
      // Paint a 1px-wide rectangle from the mountain's top to below the bottom of the canvas.
      ctx.fillRect(x, y, 1, 999); // 999 can be any large number...
      // Paint the same thing in black on the godrays emission canvas, which is 1/4 the size,
      // and move it one pixel down (otherwise there can be a tiny underlit space between the
      // mountains and the sky).
      grCtx.fillRect(x/4, y/4+1, 1, 999);
    }
  }

  // The godrays are generated by adding up RGB values, gCt is the bane of all js golfers -
  // globalCompositeOperation. Set it to 'lighter' on both canvases.
  ctx.globalCompositeOperation = grCtx.globalCompositeOperation = 'lighter';

  // NOW - let's light this motherfucker up! We'll make several passes over our emission canvas,
  // each time adding an enlarged copy of it to itself so at the first pass we get 2 copies, then 4,
  // then 8, then 16 etc... We square our scale factor at each iteration.
  for (let scaleFactor = 1.07; scaleFactor < 5; scaleFactor *= scaleFactor) {
    // The x, y, width and height arguments for drawImage keep the light source in the same
    // spot on the enlarged copy. It basically boils down to multiplying a 2D matrix by itself.
    // There's probably a better way to do this, but I couldn't figure it out.
    // For reference, here's an AS3 version (where BitmapData:draw takes a matrix argument):
    // https://github.com/yonatan/volumetrics/blob/d3849027213e9499742cc4dfd2838c6032f4d9d3/src/org/zozuar/volumetrics/EffectContainer.as#L208-L209
    grCtx.drawImage(
      grCanvas,
      (grWidth - grWidth * scaleFactor) / 2,
      (grHeight - grHeight * scaleFactor) / 2 - sunY * scaleFactor + sunY,
      grWidth * scaleFactor,
      grHeight * scaleFactor
    )
  }

  // Draw godrays to output canvas (whose globalCompositeOperation is already set to 'lighter').
  ctx.drawImage(grCanvas, 0, 0, width, height);
}
