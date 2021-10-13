import { getAllConnected, GridContext, Position } from './Grid';

type Props = {
    pos: Position,
    className: string,
};

const GridCell = ({ pos, className }: Props) => {
    return <GridContext.Consumer>
        {({ grid, setTooltip, setHovered }) => (
            <td className={className}
                onClick={(_evt) => {
                    if (grid.contents[pos.row][pos.col]) {
                        setTooltip({
                            pos,
                            text: getAllConnected(grid, pos).size.toString(),
                        });
                    }
                }}
                onMouseOver={(_evt) => {
                    setHovered(getAllConnected(grid, pos));
                }}>
                {
                    grid.tooltip?.pos.row === pos.row &&
                        grid.tooltip.pos.col === pos.col ?
                        grid.tooltip.text : null
                }
            </td>
        )}
    </GridContext.Consumer>
};

export default GridCell;
