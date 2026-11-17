import React, { useLayoutEffect, useRef } from 'react'

const colors = {
  '.': null, X: '#1a2240', W: '#fff9dc', Y: '#ffd547', O: '#f39b35',
  R: '#ef476b', D: '#a92a57', G: '#75cb43', F: '#348654', L: '#c9ea56',
  B: '#3899db', N: '#245caa', U: '#81d8f3', P: '#f9a9ce', V: '#aa65d3',
  H: '#51314f', T: '#e79975', S: '#ffc5a0',
}

const sprites = {
  cloud: [
    '..........WWWW........', '.....WWWWWWWWWWW......', '...WWWWWWWWWWWWWWW....',
    '.WWWWWWWWWWWWWWWWWWW..', 'WWWWWWWWWWWWWWWWWWWWWW', '.UUUUUUUUUUUUUUUUUUUU.',
  ],
  heart: [
    '.XX.XX.', 'XRDXRRX', 'XWRRRDX', '.XRRDX.', '..XDX..', '...X...',
  ],
  mushroom: [
    '....XXXXX....', '..XXRRRRRXX..', '.XRWWRRRWWRX.', 'XRRWWRRRRRRRX',
    'XDDRRRRRRRDDX', '.XXXWWWWWXXX.', '....XSSTX....', '....XSSSX....', '....XXXXX....',
  ],
  flower: ['..Y..','.YRY.','YYOYY','.YYY.','..F.G','G.FF.','.FF..','..F..'],
  avatar: [
    '.......HHHHHHHH.......', '.....HHHHHHHHHHHH.....', '....HHHHHHHHHHHHHH....',
    '...HHHHHHHHHHHHHHHH...', '...HHHHHHHHHSHHHHHH...', '..HHHHHHHHSSSSHHHHHH..',
    '..HHHHHHHSSSSSSSHHHH..', '..HHHHSSSSSSSSSSHHHH..', '..HHHSSXSSSSXSSSHHHH..',
    '..HHHTSXSSSSXSSSTHHH..', '..HHHTSSSSSSSSSSTHHH..', '..HHHHSPSSSSSPSSHHHH..',
    '..HHHHHSSSDDSSSHHHHH..', '..HHHHHHSSSSSSHHHHHH..', '..HHHHPPTTSSPPPHHHHH..',
    '..HHHPVPPSSPPPVPHHHH..', '..HHPVPPPPPPPPPVPHHH..', '...XPPVPPPPPPPVPPX....',
    '..XXPPVPPYYPPPVPPXX...', '..XPPPVPPPPPPPVPPPX...', '..XVVVPPPPPPPPPVVVX...',
    '...XXXXXXXXXXXXXXXX...',
  ],
  camera: [
    '......XXXXXX......','.....XNNNNNNX.....','.XXXXXXXUUXXXXXXXX.','XNNNNNNNNNNNNNNYYX',
    'XBUBBBXXXXXXBBBBBX','XBBBBXXUUUUXXBBBBX','XBBBBXUUNNBBXBBBBX','XBBBBXUNBXBBXBBBBX',
    'XBBBBXUBBBNBXBBBBX','XBBBBXXBBBBXXBBBBX','XNNNNNXXXXXXNNNNNX','.XXXXXXXXXXXXXXXX.',
  ],
  museum: [
    '.......XX.......','.....XXOOXX.....','...XXYYYYYYXX...','.XXYYYYYYYYYYXX.',
    'XYYYYYYWYYYYYYYX','XXXXXXXXXXXXXXXX','.XOXXOXXOXXOX..','.XYXXYXXYXXYX..',
    '.XYXXYXXYXXYX..','.XYXXYXXYXXYX..','.XXXXXXXXXXXX..','XOOOOOOOOOOOOOX.','XXXXXXXXXXXXXXXX',
  ],
  sakura: [
    '.....XXXXXXXXXXX......','....XPPPPPPPPPPPX.....','....XPWWHHHWWWWPX.....',
    '....XPWWWWWWWWWPX.....','....XPWHHHHHHHWPX.....','....XPWHYYHPPHWPX.....',
    '....XPWHYYHPPHWPX.PP..','....XPWHHHHHHHWPXPDPP.','....XPWHPWHYWHWPX.PYPP',
    '....XPWHWPHWYHWPXPPRP.','..PPXPWHHHHHHHWPX.PP..','.PPDXPWWWWWWWWWPX.....',
    'PPYPXPWWWDDDWWWPX.....','.PRPXPPPPPPPPPPPX.....','..PP.XXXXXXXXXXX......',
  ],
}

function drawSprite(context, sprite, x, y, scale) {
  sprite.forEach((row, dy) => {
    Array.from(row).forEach((token, dx) => {
      if (!colors[token]) return
      context.fillStyle = colors[token]
      context.fillRect(x + dx * scale, y + dy * scale, scale, scale)
    })
  })
}

export function Pixels({ name, className }) {
  const ref = useRef(null)
  const sprite = sprites[name]
  const width = Math.max(...sprite.map((row) => row.length))
  useLayoutEffect(() => {
    const context = ref.current.getContext('2d')
    context.clearRect(0, 0, width, sprite.length)
    drawSprite(context, sprite, 0, 0, 1)
  }, [sprite, width])
  return <canvas ref={ref} width={width} height={sprite.length} className={className} aria-hidden="true" />
}

function drawLandscape(context, width) {
  const rect = (color, x, y, w, h) => {
    context.fillStyle = color
    context.fillRect(x, y, w, h)
  }
  let seed = 67
  function random(max) {
    seed = (seed * 16807) % 2147483647
    return seed % max
  }

  // Draw the skyline in two layers so the windows stay clear at small sizes.
  for (const layer of [
    { start: -8, base: 119, color: '#65aedc', glass: '#a5dced', windows: 2 },
    { start: 6, base: 128, color: '#4494cb', glass: '#8bd0e7', windows: 3 },
  ]) {
    for (let x = layer.start; x < width;) {
      const w = 12 + random(18)
      const h = 10 + random(32)
      const y = layer.base - h
      rect(layer.color, x, y, w, h)
      rect(layer.color, x + 3, y - 3, w - 6, 3)
      if (random(3) === 0) rect(layer.color, x + Math.floor(w / 2), y - 10, 1, 7)
      for (let wy = y + 5; wy < layer.base - 3; wy += 6) {
        for (let wx = x + 3; wx < x + w - 4; wx += 6) {
          if (random(6) > 0) rect(layer.glass, wx, wy, layer.windows, 3)
        }
      }
      x += w + 3 + random(5)
    }
  }

  for (let x = -4; x < width; x += 4) {
    const y = 108 + Math.floor(Math.sin(x / 25) * 8 + Math.sin(x / 13) * 3)
    rect('#6fc449', x, y, 4, 35)
    rect('#a0d957', x, y, 4, 2)
    const front = 126 + Math.floor(Math.cos(x / 23) * 5)
    rect('#419845', x, front, 4, 25)
    rect('#82ce4c', x, front, 4, 2)
  }

  rect('#75443c', 0, 143, width, 17)
  rect('#955737', 0, 146, width, 4)
  rect('#412b41', 0, 159, width, 3)
  for (let x = 0; x < width; x += 4) {
    const edge = 142 + random(3)
    rect('#2c743c', x, 139, 4, edge - 137)
    rect('#adDE55', x, 139, 4, 2)
    if (random(3) === 0) rect('#c4814e', x, 149 + random(8), 3, 2)
  }
  for (let i = 0; i < width / 3; i++) {
    const x = random(width)
    const y = 128 + random(11)
    rect('#b8e56a', x, y, 2, 1)
    rect('#277c42', x + 1, y + 1, 1, 2)
  }

  drawSprite(context, sprites.mushroom, 12, 113, 3)
  drawSprite(context, sprites.mushroom, 49, 126, 1)
  drawSprite(context, sprites.mushroom, width - 36, 123, 2)
  drawSprite(context, sprites.flower, 5, 124, 2)
  drawSprite(context, sprites.flower, 68, 124, 2)
  drawSprite(context, sprites.flower, width - 53, 124, 2)
  drawSprite(context, sprites.flower, width - 10, 131, 1)
  for (let x = 92; x < width - 58; x += 26 + random(16)) {
    drawSprite(context, sprites.flower, x, 130 + random(3), 1)
  }
}

export function Landscape() {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const canvas = ref.current
    function draw() {
      canvas.width = Math.max(118, Math.ceil(canvas.clientWidth / 3.4))
      drawLandscape(canvas.getContext('2d'), canvas.width)
    }
    draw()
    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])
  return <canvas ref={ref} className="landscape" height="162" aria-hidden="true" />
}
