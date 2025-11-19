
export interface BlockColor {
    background: string;
    borderColor: string;
}

export function getCharacterColor(char: string): BlockColor {
    let hash = 0;
    for (let i = 0; i < char.length; i++) {
        hash = char.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash % 360);
    const saturation = 75; // High saturation for vibrancy
    const lightness = 45;  // Medium-Dark lightness for contrast with white text

    const color1 = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const color2 = `hsl(${(hue + 30) % 360}, ${saturation}%, ${lightness - 10}%)`; // Slightly darker and shifted hue for gradient

    return {
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        borderColor: `hsl(${hue}, ${saturation}%, ${lightness + 20}%)` // Lighter border
    };
}
