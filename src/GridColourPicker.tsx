import PopOverColourPicker from './PopOverColourPicker';

type Props = {
    initialFilled: string,
    initialHover: string,
    initialBackground: string,
};

const GridColourPicker = ({ initialBackground, initialHover, initialFilled }: Props) => {
    return <div style={{ display: 'table' }}>
        <PopOverColourPicker
            name='filledColour'
            label='Filled Colour'
            initialColour={initialFilled}
            onChange={(event) => document.documentElement.style.setProperty('--filled', event.target.value)} />

        <PopOverColourPicker
            name='hoverColour'
            label='Hover Colour'
            initialColour={initialHover}
            onChange={(event) => document.documentElement.style.setProperty('--hovered', event.target.value)} />

        <PopOverColourPicker
            name='backgroundColour'
            label='Background Colour'
            initialColour={initialBackground}
            onChange={(event) => document.documentElement.style.setProperty('--background', event.target.value)} />
    </div>
};

export default GridColourPicker;
