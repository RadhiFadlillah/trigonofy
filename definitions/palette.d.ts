export declare class Palette {
    static random(baseColor?: string): string[];
    static chaos(baseColor?: string): string[];
    static complementary(baseColor?: string): string[];
    static monochromatic(baseColor?: string): string[];
    static analogous(baseColor?: string): string[];
    static triadic(baseColor?: string): string[];
    static tetradic(baseColor?: string): string[];
    static colorbrewer(key?: string): string[];
}
