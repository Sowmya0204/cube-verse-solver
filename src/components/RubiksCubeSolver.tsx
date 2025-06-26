
import React, { useState, useEffect } from 'react';
import { RubiksCube } from '@/lib/rubiksCube';
import { getCubeSvg } from '@/lib/cubeVisualization';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shuffle, RotateCcw, Play, Pause, SkipForward } from 'lucide-react';
import { toast } from 'sonner';

const RubiksCubeSolver = () => {
  const [cube] = useState(() => new RubiksCube());
  const [cubeState, setCubeState] = useState(cube.getCubeString());
  const [isScrambling, setIsScrambling] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [solveMoves, setSolveMoves] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [scrambleMoves, setScrambleMoves] = useState<string[]>([]);

  const updateCubeState = () => {
    setCubeState(cube.getCubeString());
  };

  const handleScramble = async () => {
    if (isScrambling || isSolving) return;
    
    setIsScrambling(true);
    const moves = cube.scramble(15);
    setScrambleMoves(moves);
    setSolveMoves([]);
    setCurrentMoveIndex(-1);
    
    // Animate the scramble
    cube.reset();
    updateCubeState();
    
    for (let i = 0; i < moves.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 150));
      cube.move(moves[i]);
      updateCubeState();
    }
    
    setIsScrambling(false);
    toast.success(`Cube scrambled with ${moves.length} moves!`);
  };

  const handleSolve = async () => {
    if (isSolving || isScrambling) return;
    
    if (cube.isSolved()) {
      toast.info("Cube is already solved!");
      return;
    }
    
    setIsSolving(true);
    const moves = cube.solve();
    setSolveMoves(moves);
    
    // Reset cube to scrambled state and animate solution
    cube.scramble(scrambleMoves.length);
    for (const move of scrambleMoves) {
      cube.move(move);
    }
    updateCubeState();
    
    setCurrentMoveIndex(0);
    
    for (let i = 0; i < moves.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      cube.move(moves[i]);
      updateCubeState();
      setCurrentMoveIndex(i + 1);
    }
    
    setIsSolving(false);
    setCurrentMoveIndex(-1);
    toast.success("Cube solved successfully!");
  };

  const handleReset = () => {
    if (isScrambling || isSolving) return;
    
    cube.reset();
    updateCubeState();
    setSolveMoves([]);
    setScrambleMoves([]);
    setCurrentMoveIndex(-1);
    toast.info("Cube reset to solved state");
  };

  const renderMoveHistory = (moves: string[], title: string, isActive: boolean = false) => {
    if (moves.length === 0) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-gray-700">{title}</h4>
        <div className="flex flex-wrap gap-1">
          {moves.map((move, index) => (
            <Badge 
              key={index} 
              variant={isActive && index === currentMoveIndex - 1 ? "default" : "secondary"}
              className={`text-xs ${
                isActive && index === currentMoveIndex - 1 
                  ? "bg-blue-500 text-white animate-pulse" 
                  : ""
              }`}
            >
              {move}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Rubik's Cube Solver
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Watch as the cube gets scrambled and then solved using a reverse-engineering algorithm. 
            Each step is animated to show the solving process in action.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Cube Visualization */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Cube Visualization</span>
                <Badge variant={cube.isSolved() ? "default" : "secondary"} className="bg-green-100 text-green-800">
                  {cube.isSolved() ? "SOLVED" : "SCRAMBLED"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div 
                  className="transition-all duration-300 hover:scale-105"
                  dangerouslySetInnerHTML={{ __html: getCubeSvg(cubeState) }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Controls and Move History */}
          <div className="space-y-6">
            {/* Control Buttons */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <Button 
                    onClick={handleScramble}
                    disabled={isScrambling || isSolving}
                    className="h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                  >
                    {isScrambling ? (
                      <>
                        <Shuffle className="mr-2 h-4 w-4 animate-spin" />
                        Scrambling...
                      </>
                    ) : (
                      <>
                        <Shuffle className="mr-2 h-4 w-4" />
                        Scramble Cube
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleSolve}
                    disabled={isSolving || isScrambling || cube.isSolved()}
                    className="h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold"
                  >
                    {isSolving ? (
                      <>
                        <Play className="mr-2 h-4 w-4 animate-pulse" />
                        Solving...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Solve Cube
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleReset}
                    disabled={isScrambling || isSolving}
                    variant="outline"
                    className="h-12 border-2 hover:bg-gray-50"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Cube
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Move History */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle>Move History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderMoveHistory(scrambleMoves, "Scramble Moves")}
                {renderMoveHistory(solveMoves, "Solution Moves", isSolving)}
                
                {scrambleMoves.length === 0 && solveMoves.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    Scramble the cube to see move history
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{scrambleMoves.length}</div>
                    <div className="text-sm text-gray-600">Scramble Moves</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{solveMoves.length}</div>
                    <div className="text-sm text-gray-600">Solution Moves</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Algorithm Info */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Scrambling</h4>
                <p className="text-gray-600 text-sm">
                  The cube is scrambled using 15 random moves from the set: F, F', B, B', U, U', D, D', L, L', R, R'. 
                  Each move rotates one face of the cube 90 degrees clockwise or counter-clockwise.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Solving Algorithm</h4>
                <p className="text-gray-600 text-sm">
                  The solver uses a simple reverse-engineering approach: it records all scramble moves and then 
                  applies them in reverse order with opposite rotations. While not optimal, this guarantees a solution.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RubiksCubeSolver;
