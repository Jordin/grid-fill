import { ChangeEventHandler } from 'react';

type Props = {
    name: string,
    label: string,
    initialColour: string,
    onChange: ChangeEventHandler<HTMLInputElement>,
};

const PopOverColourPicker = (props: Props) => {
    return <div style={{ display: 'table-cell' }}>
        <input type='color' id={props.name} name={props.name} defaultValue={props.initialColour} onChange={props.onChange} />
        <label htmlFor={props.name}>{props.label}</label>
    </div>
};

export default PopOverColourPicker;
