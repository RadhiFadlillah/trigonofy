import { build, serve } from 'esbuild';

// Parse arguments
const args = process.argv.slice(2);
const devMode = args.includes('dev');
const serveMode = args.includes('serve');

// Prepare options
const serveOpts = {
	port: 9000,
	servedir: '.',
};

const buildOpts = {
	entryPoints: ['./src/index.ts'],
	outfile: devMode ? 'trigonofy.js' : 'trigonofy.min.js',
	minify: !devMode,
	bundle: true,
	sourcemap: devMode,
	treeShaking: true,
};

// Run esbuild
if (serveMode) {
	serve(serveOpts, buildOpts).catch((err) => {
		console.error(err);
		process.exit(1);
	});
} else {
	build(buildOpts).catch((err) => {
		console.error(err);
		process.exit(1);
	});
}
