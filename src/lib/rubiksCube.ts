
export class RubiksCube {
  // Each face is represented as a 1D array of 9 elements
  // Face order: U (Up), D (Down), F (Front), B (Back), L (Left), R (Right)
  private faces: { [key: string]: string[] };
  private moveHistory: string[] = [];
  
  // Color mapping for each face
  private readonly colors = {
    U: 'W', // White (Up)
    D: 'Y', // Yellow (Down)
    F: 'R', // Red (Front)
    B: 'O', // Orange (Back)
    L: 'G', // Green (Left)
    R: 'B'  // Blue (Right)
  };

  constructor() {
    this.reset();
  }

  reset(): void {
    this.faces = {
      U: Array(9).fill('W'),
      D: Array(9).fill('Y'),
      F: Array(9).fill('R'),
      B: Array(9).fill('O'),
      L: Array(9).fill('G'),
      R: Array(9).fill('B')
    };
    this.moveHistory = [];
  }

  // Get the cube state as a 54-character string for visualization
  getCubeString(): string {
    return this.faces.U.join('') + 
           this.faces.D.join('') + 
           this.faces.F.join('') + 
           this.faces.B.join('') + 
           this.faces.L.join('') + 
           this.faces.R.join('');
  }

  // Rotate a face 90 degrees clockwise
  private rotateFaceClockwise(face: string[]): void {
    const temp = [...face];
    face[0] = temp[6]; face[1] = temp[3]; face[2] = temp[0];
    face[3] = temp[7]; face[4] = temp[4]; face[5] = temp[1];
    face[6] = temp[8]; face[7] = temp[5]; face[8] = temp[2];
  }

  // Rotate a face 90 degrees counter-clockwise
  private rotateFaceCounterClockwise(face: string[]): void {
    const temp = [...face];
    face[0] = temp[2]; face[1] = temp[5]; face[2] = temp[8];
    face[3] = temp[1]; face[4] = temp[4]; face[5] = temp[7];
    face[6] = temp[0]; face[7] = temp[3]; face[8] = temp[6];
  }

  // Execute a move (F, F', B, B', U, U', D, D', L, L', R, R')
  move(moveNotation: string): void {
    const isPrime = moveNotation.includes("'");
    const baseFace = moveNotation.replace("'", "");
    
    this.moveHistory.push(moveNotation);

    switch (baseFace) {
      case 'F':
        this.moveF(isPrime);
        break;
      case 'B':
        this.moveB(isPrime);
        break;
      case 'U':
        this.moveU(isPrime);
        break;
      case 'D':
        this.moveD(isPrime);
        break;
      case 'L':
        this.moveL(isPrime);
        break;
      case 'R':
        this.moveR(isPrime);
        break;
    }
  }

  private moveF(isPrime: boolean): void {
    if (isPrime) {
      this.rotateFaceCounterClockwise(this.faces.F);
    } else {
      this.rotateFaceClockwise(this.faces.F);
    }

    // Rotate adjacent edges
    const temp = [this.faces.U[6], this.faces.U[7], this.faces.U[8]];
    
    if (isPrime) {
      this.faces.U[6] = this.faces.L[8];
      this.faces.U[7] = this.faces.L[5];
      this.faces.U[8] = this.faces.L[2];
      
      this.faces.L[2] = this.faces.D[0];
      this.faces.L[5] = this.faces.D[1];
      this.faces.L[8] = this.faces.D[2];
      
      this.faces.D[0] = this.faces.R[6];
      this.faces.D[1] = this.faces.R[3];
      this.faces.D[2] = this.faces.R[0];
      
      this.faces.R[0] = temp[0];
      this.faces.R[3] = temp[1];
      this.faces.R[6] = temp[2];
    } else {
      this.faces.U[6] = this.faces.R[0];
      this.faces.U[7] = this.faces.R[3];
      this.faces.U[8] = this.faces.R[6];
      
      this.faces.R[0] = this.faces.D[2];
      this.faces.R[3] = this.faces.D[1];
      this.faces.R[6] = this.faces.D[0];
      
      this.faces.D[0] = this.faces.L[2];
      this.faces.D[1] = this.faces.L[5];
      this.faces.D[2] = this.faces.L[8];
      
      this.faces.L[2] = temp[2];
      this.faces.L[5] = temp[1];
      this.faces.L[8] = temp[0];
    }
  }

  private moveU(isPrime: boolean): void {
    if (isPrime) {
      this.rotateFaceCounterClockwise(this.faces.U);
    } else {
      this.rotateFaceClockwise(this.faces.U);
    }

    const temp = [this.faces.F[0], this.faces.F[1], this.faces.F[2]];
    
    if (isPrime) {
      this.faces.F[0] = this.faces.R[0];
      this.faces.F[1] = this.faces.R[1];
      this.faces.F[2] = this.faces.R[2];
      
      this.faces.R[0] = this.faces.B[0];
      this.faces.R[1] = this.faces.B[1];
      this.faces.R[2] = this.faces.B[2];
      
      this.faces.B[0] = this.faces.L[0];
      this.faces.B[1] = this.faces.L[1];
      this.faces.B[2] = this.faces.L[2];
      
      this.faces.L[0] = temp[0];
      this.faces.L[1] = temp[1];
      this.faces.L[2] = temp[2];
    } else {
      this.faces.F[0] = this.faces.L[0];
      this.faces.F[1] = this.faces.L[1];
      this.faces.F[2] = this.faces.L[2];
      
      this.faces.L[0] = this.faces.B[0];
      this.faces.L[1] = this.faces.B[1];
      this.faces.L[2] = this.faces.B[2];
      
      this.faces.B[0] = this.faces.R[0];
      this.faces.B[1] = this.faces.R[1];
      this.faces.B[2] = this.faces.R[2];
      
      this.faces.R[0] = temp[0];
      this.faces.R[1] = temp[1];
      this.faces.R[2] = temp[2];
    }
  }

  private moveR(isPrime: boolean): void {
    if (isPrime) {
      this.rotateFaceCounterClockwise(this.faces.R);
    } else {
      this.rotateFaceClockwise(this.faces.R);
    }

    const temp = [this.faces.F[2], this.faces.F[5], this.faces.F[8]];
    
    if (isPrime) {
      this.faces.F[2] = this.faces.D[2];
      this.faces.F[5] = this.faces.D[5];
      this.faces.F[8] = this.faces.D[8];
      
      this.faces.D[2] = this.faces.B[6];
      this.faces.D[5] = this.faces.B[3];
      this.faces.D[8] = this.faces.B[0];
      
      this.faces.B[0] = this.faces.U[8];
      this.faces.B[3] = this.faces.U[5];
      this.faces.B[6] = this.faces.U[2];
      
      this.faces.U[2] = temp[0];
      this.faces.U[5] = temp[1];
      this.faces.U[8] = temp[2];
    } else {
      this.faces.F[2] = this.faces.U[2];
      this.faces.F[5] = this.faces.U[5];
      this.faces.F[8] = this.faces.U[8];
      
      this.faces.U[2] = this.faces.B[6];
      this.faces.U[5] = this.faces.B[3];
      this.faces.U[8] = this.faces.B[0];
      
      this.faces.B[0] = this.faces.D[8];
      this.faces.B[3] = this.faces.D[5];
      this.faces.B[6] = this.faces.D[2];
      
      this.faces.D[2] = temp[0];
      this.faces.D[5] = temp[1];
      this.faces.D[8] = temp[2];
    }
  }

  private moveL(isPrime: boolean): void {
    if (isPrime) {
      this.rotateFaceCounterClockwise(this.faces.L);
    } else {
      this.rotateFaceClockwise(this.faces.L);
    }

    const temp = [this.faces.F[0], this.faces.F[3], this.faces.F[6]];
    
    if (isPrime) {
      this.faces.F[0] = this.faces.U[0];
      this.faces.F[3] = this.faces.U[3];
      this.faces.F[6] = this.faces.U[6];
      
      this.faces.U[0] = this.faces.B[8];
      this.faces.U[3] = this.faces.B[5];
      this.faces.U[6] = this.faces.B[2];
      
      this.faces.B[2] = this.faces.D[6];
      this.faces.B[5] = this.faces.D[3];
      this.faces.B[8] = this.faces.D[0];
      
      this.faces.D[0] = temp[0];
      this.faces.D[3] = temp[1];
      this.faces.D[6] = temp[2];
    } else {
      this.faces.F[0] = this.faces.D[0];
      this.faces.F[3] = this.faces.D[3];
      this.faces.F[6] = this.faces.D[6];
      
      this.faces.D[0] = this.faces.B[8];
      this.faces.D[3] = this.faces.B[5];
      this.faces.D[6] = this.faces.B[2];
      
      this.faces.B[2] = this.faces.U[6];
      this.faces.B[5] = this.faces.U[3];
      this.faces.B[8] = this.faces.U[0];
      
      this.faces.U[0] = temp[0];
      this.faces.U[3] = temp[1];
      this.faces.U[6] = temp[2];
    }
  }

  private moveD(isPrime: boolean): void {
    if (isPrime) {
      this.rotateFaceCounterClockwise(this.faces.D);
    } else {
      this.rotateFaceClockwise(this.faces.D);
    }

    const temp = [this.faces.F[6], this.faces.F[7], this.faces.F[8]];
    
    if (isPrime) {
      this.faces.F[6] = this.faces.L[6];
      this.faces.F[7] = this.faces.L[7];
      this.faces.F[8] = this.faces.L[8];
      
      this.faces.L[6] = this.faces.B[6];
      this.faces.L[7] = this.faces.B[7];
      this.faces.L[8] = this.faces.B[8];
      
      this.faces.B[6] = this.faces.R[6];
      this.faces.B[7] = this.faces.R[7];
      this.faces.B[8] = this.faces.R[8];
      
      this.faces.R[6] = temp[0];
      this.faces.R[7] = temp[1];
      this.faces.R[8] = temp[2];
    } else {
      this.faces.F[6] = this.faces.R[6];
      this.faces.F[7] = this.faces.R[7];
      this.faces.F[8] = this.faces.R[8];
      
      this.faces.R[6] = this.faces.B[6];
      this.faces.R[7] = this.faces.B[7];
      this.faces.R[8] = this.faces.B[8];
      
      this.faces.B[6] = this.faces.L[6];
      this.faces.B[7] = this.faces.L[7];
      this.faces.B[8] = this.faces.L[8];
      
      this.faces.L[6] = temp[0];
      this.faces.L[7] = temp[1];
      this.faces.L[8] = temp[2];
    }
  }

  private moveB(isPrime: boolean): void {
    if (isPrime) {
      this.rotateFaceCounterClockwise(this.faces.B);
    } else {
      this.rotateFaceClockwise(this.faces.B);
    }

    const temp = [this.faces.U[0], this.faces.U[1], this.faces.U[2]];
    
    if (isPrime) {
      this.faces.U[0] = this.faces.R[2];
      this.faces.U[1] = this.faces.R[5];
      this.faces.U[2] = this.faces.R[8];
      
      this.faces.R[2] = this.faces.D[8];
      this.faces.R[5] = this.faces.D[7];
      this.faces.R[8] = this.faces.D[6];
      
      this.faces.D[6] = this.faces.L[0];
      this.faces.D[7] = this.faces.L[3];
      this.faces.D[8] = this.faces.L[6];
      
      this.faces.L[0] = temp[2];
      this.faces.L[3] = temp[1];
      this.faces.L[6] = temp[0];
    } else {
      this.faces.U[0] = this.faces.L[6];
      this.faces.U[1] = this.faces.L[3];
      this.faces.U[2] = this.faces.L[0];
      
      this.faces.L[0] = this.faces.D[6];
      this.faces.L[3] = this.faces.D[7];
      this.faces.L[6] = this.faces.D[8];
      
      this.faces.D[6] = this.faces.R[8];
      this.faces.D[7] = this.faces.R[5];
      this.faces.D[8] = this.faces.R[2];
      
      this.faces.R[2] = temp[0];
      this.faces.R[5] = temp[1];
      this.faces.R[8] = temp[2];
    }
  }

  // Scramble the cube with random moves
  scramble(numMoves: number = 15): string[] {
    const moves = ['F', "F'", 'B', "B'", 'U', "U'", 'D', "D'", 'L', "L'", 'R', "R'"];
    const scrambleMoves: string[] = [];
    
    this.reset();
    this.moveHistory = [];
    
    for (let i = 0; i < numMoves; i++) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      scrambleMoves.push(randomMove);
      this.move(randomMove);
    }
    
    return scrambleMoves;
  }

  // Solve the cube by reversing the scramble moves
  solve(): string[] {
    const solveMoves: string[] = [];
    const reversedHistory = [...this.moveHistory].reverse();
    
    for (const move of reversedHistory) {
      // Reverse the move
      const reverseMove = move.includes("'") ? move.replace("'", "") : move + "'";
      solveMoves.push(reverseMove);
      this.move(reverseMove);
    }
    
    return solveMoves;
  }

  getMoveHistory(): string[] {
    return [...this.moveHistory];
  }

  isSolved(): boolean {
    return Object.values(this.faces).every(face => 
      face.every(color => color === face[0])
    );
  }
}
