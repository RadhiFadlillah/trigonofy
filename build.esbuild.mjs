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
	globalName: 'trigonofy',
	outfile: 'trigonofy.js',
	entryPoints: ['./src/index.ts'],
};

const devBuildOptions = {
	...buildOptions,
	watch: !serveMode,
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
	build(devBuildOptions);
} else {
	build(prodBuildOptions);
	build(prodBundleBuildOptions);
}
