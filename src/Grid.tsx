import React, { useState } from 'react';
import './Grid.css';
import GridCell from './GridCell';
import GridColourPicker from './GridColourPicker';

// the starting grid configuration
const initialGrid = [
  [0, 0, 0, 0, 1],
  [1, 1, 0, 0, 0],
  [1, 1, 0, 1, 1],
  [0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0],
];

export type Position = {
  row: number,
  col: number,
};

// this is required since Sets use reference equality for objects
const getPositionKey = (pos: Position): string => `${pos.row} ${pos.col}`;

export type Tooltip = {
  pos: Position,
  text: string,
};

export type GridData = {
  contents: number[][],
  hovered: Set<string>,
  tooltip?: Tooltip,
};

/**
 * Checks if a position is in a square with side-length. 
 * Meaning the coordinates must be contained in the interval [0, size).
 * 
 * @param pos the position to check
 * @param size the side-length of the square
 * @returns true iff the given position is located inside the square 
 */
const inSquare = (pos: Position, size: number) =>
  pos.row >= 0 && pos.row < size &&
  pos.col >= 0 && pos.col < size;

/**
 * Finds all neighbours (horizontal and vertical) of the given position
 * @param grid the grid in which to search for neighbours
 * @param pos the location in which to search for neighbours
 * @returns all neighbours contained in the grid
 */
const getNeighbours = (grid: GridData, pos: Position): Position[] => {
  const neighbours: Position[] = [
    { row: pos.row - 1, col: pos.col },
    { row: pos.row + 1, col: pos.col },
    { row: pos.row, col: pos.col - 1 },
    { row: pos.row, col: pos.col + 1 },
  ];

  return neighbours.filter(pos => inSquare(pos, grid.contents.length));
}

/**
 * Recursively flood-fill to find all connected filled squares
 * @param grid the grid in which to search for all connected filled squares
 * @param pos the starting location
 * @param visited the set of all connected squares previously visited
 */
const visitAllConnectedFilled = (grid: GridData, pos: Position, visited: Set<string>) => {
  visited.add(getPositionKey(pos));

  getNeighbours(grid, pos)
    .filter(pos => !visited.has(getPositionKey(pos)))
    .filter(pos => grid.contents[pos.row][pos.col])
    .forEach(pos => visitAllConnectedFilled(grid, pos, visited));
}

/**
 * Recursively flood-fill to find all connected filled squares
 * @param grid the grid in which to search for all connected filled squares
 * @param pos the starting location
 * @returns the set of all connected squares
 */
export const getAllConnected = (grid: GridData, pos: Position): Set<string> => {
  const visited = new Set<string>();

  if (!grid.contents[pos.row][pos.col]) {
    return visited;
  }

  visitAllConnectedFilled(grid, pos, visited);

  return visited;
}

/**
 * Finds the class name with the corresponding colour for the square at a given position in a given grid
 * @param grid the grid to consider
 * @param pos the position of the square
 * @returns the colour of the square at the given position
 */
const getClassName = (grid: GridData, pos: Position): string => {
  if (grid.hovered.has(getPositionKey(pos))) {
    return 'hovered';
  }

  if (grid.contents[pos.row][pos.col]) {
    return 'filled';
  }

  return 'background';
}

/**
 * Randomly generate a grid with dimensions size*size 
 * @param size the side-length of the grid
 * @returns the randomly generated grid
 */
const generateGrid = (size: number): GridData => {
  const contents: number[][] = [];

  for (let col = 0; col < size; col++) {
    const rowContents = [];

    for (let row = 0; row < size; row++) {
      rowContents.push(Math.round(Math.random()));
    }

    contents.push(rowContents);
  }

  return {
    contents,
    hovered: new Set<string>(),
  }
}

type GridContextType = {
  grid: GridData,
  setTooltip: (tooltip: Tooltip) => void,
  setHovered: (hovered: Set<string>) => void,
}

export const GridContext = React.createContext<GridContextType>({
  grid: {
    contents: initialGrid,
    hovered: new Set<string>(),
  },
  setTooltip: (tooltip: Tooltip) => { },
  setHovered: (hovered: Set<string>) => { },
});

const Grid = () => {
  const [grid, setGrid] = useState<GridData>({
    contents: initialGrid,
    hovered: new Set<string>(),
  });

  const gridContextProivder = {
    grid,
    setTooltip: (tooltip: Tooltip) => setGrid((prevGrid) => {
      return { ...prevGrid, tooltip, };
    }),
    setHovered: (hovered: Set<string>) => setGrid((prevGrid) => {
      return { ...prevGrid, hovered, };
    }),
  };

  return <>
    <p>
      <input type='range' min='1' max='32' defaultValue={initialGrid.length} id='myRange' key='slider' onChange={(evt) => {
        setGrid(generateGrid(parseInt(evt.target.value)));
      }} /> {`Size: ${grid.contents.length} x ${grid.contents.length}`}
    </p>

    <GridColourPicker
      initialFilled='#ff0000'
      initialHover='#0000ff'
      initialBackground='#ffffff' />

    <GridContext.Provider value={gridContextProivder}>
      <table onMouseLeave={(_evt) => {
        gridContextProivder.setHovered(new Set<string>());
      }}>
        <tbody>
          {grid.contents.map((rowData, row) => {
            return <tr key={row}>
              {rowData.map((_colData, col) =>
                <GridCell key={col}
                  pos={{ row, col }}
                  className={getClassName(grid, { row, col })} />)
              }
            </tr>
          })}
        </tbody>
      </table>
    </GridContext.Provider>
  </>
};

export default Grid;
