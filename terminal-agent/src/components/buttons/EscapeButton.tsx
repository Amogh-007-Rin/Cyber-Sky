interface EscapeButtonProps {
    onPress: () => void;
}

export default function EscapeButton({ onPress }: EscapeButtonProps) {
    return (
        <box onMouseDown={onPress}>
            <text>esc</text>
        </box>
    );
}