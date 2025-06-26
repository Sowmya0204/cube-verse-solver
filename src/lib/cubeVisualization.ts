
// Cube visualization utility that converts cube state to SVG
export function getCubeSvg(cubeString: string): string {
  // Parse the 54-character string into face arrays
  const faces = {
    U: cubeString.slice(0, 9).split(''),   // Up (White)
    D: cubeString.slice(9, 18).split(''),  // Down (Yellow)
    F: cubeString.slice(18, 27).split(''), // Front (Red)
    B: cubeString.slice(27, 36).split(''), // Back (Orange)
    L: cubeString.slice(36, 45).split(''), // Left (Green)
    R: cubeString.slice(45, 54).split('')  // Right (Blue)
  };

  // Color mapping
  const colorMap: { [key: string]: string } = {
    'W': '#ffffff', // White
    'Y': '#ffd700', // Yellow
    'R': '#ff0000', // Red
    'O': '#ff8c00', // Orange
    'G': '#00ff00', // Green
    'B': '#0066ff'  // Blue
  };

  // Create a 3D unfolded cube layout
  const squareSize = 30;
  const gap = 2;
  const totalSize = squareSize + gap;

  let svg = `<svg width="360" height="270" viewBox="0 0 360 270" xmlns="http://www.w3.org/2000/svg">`;
  
  // Draw the unfolded cube in a cross pattern
  // Layout:
  //     U U U
  //     U U U  
  //     U U U
  // L L L F F F R R R B B B
  // L L L F F F R R R B B B
  // L L L F F F R R R B B B
  //     D D D
  //     D D D
  //     D D D

  // Helper function to draw a square
  const drawSquare = (x: number, y: number, color: string, index: number) => {
    const fillColor = colorMap[color] || '#cccccc';
    return `<rect x="${x}" y="${y}" width="${squareSize}" height="${squareSize}" 
            fill="${fillColor}" stroke="#333" stroke-width="1" 
            rx="2" class="cube-square" data-index="${index}"/>`;
  };

  // Draw Up face (U)
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = 120 + col * totalSize;
    const y = 30 + row * totalSize;
    svg += drawSquare(x, y, faces.U[i], i);
  }

  // Draw Left face (L)
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = 30 + col * totalSize;
    const y = 120 + row * totalSize;
    svg += drawSquare(x, y, faces.L[i], i + 9);
  }

  // Draw Front face (F)
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = 120 + col * totalSize;
    const y = 120 + row * totalSize;
    svg += drawSquare(x, y, faces.F[i], i + 18);
  }

  // Draw Right face (R)
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = 210 + col * totalSize;
    const y = 120 + row * totalSize;
    svg += drawSquare(x, y, faces.R[i], i + 27);
  }

  // Draw Back face (B)
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = 300 + col * totalSize;
    const y = 120 + row * totalSize;
    svg += drawSquare(x, y, faces.B[i], i + 36);
  }

  // Draw Down face (D)
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = 120 + col * totalSize;
    const y = 210 + row * totalSize;
    svg += drawSquare(x, y, faces.D[i], i + 45);
  }

  // Add face labels
  svg += `<text x="135" y="25" fill="#333" font-size="12" font-weight="bold" text-anchor="middle">U</text>`;
  svg += `<text x="45" y="115" fill="#333" font-size="12" font-weight="bold" text-anchor="middle">L</text>`;
  svg += `<text x="135" y="115" fill="#333" font-size="12" font-weight="bold" text-anchor="middle">F</text>`;
  svg += `<text x="225" y="115" fill="#333" font-size="12" font-weight="bold" text-anchor="middle">R</text>`;
  svg += `<text x="315" y="115" fill="#333" font-size="12" font-weight="bold" text-anchor="middle">B</text>`;
  svg += `<text x="135" y="250" fill="#333" font-size="12" font-weight="bold" text-anchor="middle">D</text>`;

  svg += `</svg>`;

  return svg;
}
