import { build, serve } from 'esbuild';

// Parse arguments
const args = process.argv.slice(2);
const devMode = args.includes('dev');
const serveMode = args.includes('serve');

// Prepare options
const serveOptions = {
	port: 9000,
	servedir: '.',
};

const buildOptions = {
	bundle: true,
	sourcemap: true,
	treeShaking: true,
	format: 'esm',
	globalName: 'Trigonofy',
	outfile: 'trigonofy.js',
	entryPoints: ['./src/index.ts'],
};

const devBuildOptions = {
	...buildOptions,
	watch: serveMode !== true,
};

const devUnbundledBuildOptions = {
	...devBuildOptions,
	sourcemap: false,
	outfile: 'trigonofy-unbundled.js',
	external: ['chroma-js', 'd3-delaunay'],
};

const bundleProdBuildOptions = {
	...buildOptions,
	minify: true,
	sourcemap: false,
	outfile: 'trigonofy-bundle.min.js',
};

const prodBuildOptions = {
	...bundleProdBuildOptions,
	outfile: 'trigonofy.min.js',
	external: ['chroma-js', 'd3-delaunay'],
};

// Run esbuild
if (serveMode) {
	serve(serveOptions, buildOptions);
} else if (devMode) {
	build(devUnbundledBuildOptions);
	build(devBuildOptions);
} else {
	build(prodBuildOptions);
	build(prodBundleBuildOptions);
}
