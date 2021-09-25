// Imports
import { Points } from './points';
import { Palette } from './palette';
import { Pattern } from './pattern';
import type { PatternOptions } from './pattern';

export { Points, Palette, Pattern };
export default function (opts?: PatternOptions): Pattern {
	return new Pattern(opts);
}
