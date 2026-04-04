#!/usr/bin/env node

const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

function printHelp() {
  console.log(`
Usage:
  npm run gif -- --input <video-file> [options]

Options:
  --input <path>            Input video path. Required.
  --output <path>           Output gif path. Defaults to asset/<input-name>.gif
  --target-duration <sec>   Final gif duration in seconds. Longer videos speed up to this length; shorter videos slow down to this length. Default: 4
  --fps <number>            Output frames per second. Default: 15
  --max-width <px>          Max output width while preserving aspect ratio. Default: 720
  --max-height <px>         Max output height while preserving aspect ratio. Default: 720
  --ffmpeg <path>           Optional custom ffmpeg executable
  --ffprobe <path>          Optional custom ffprobe executable
  --help                    Show this help text

Examples:
  npm run gif -- --input .\\demo.mp4
  npm run gif -- --input .\\demo.mp4 --target-duration 3 --fps 18
  npm run gif -- --input .\\demo.mp4 --output .\\asset\\demo-fast.gif
`.trim());
}

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[i + 1];

    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    i += 1;
  }

  return args;
}

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });
}

function ensurePositiveNumber(value, label) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${label} must be a positive number. Received: ${value}`);
  }

  return parsed;
}

function resolveBinary(custom, fallback) {
  return custom || fallback;
}

function probeVideo(ffprobePath, inputPath) {
  const output = run(ffprobePath, [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height",
    "-show_entries",
    "format=duration",
    "-of",
    "json",
    inputPath,
  ]);

  const parsed = JSON.parse(output);
  const stream = parsed.streams && parsed.streams[0];
  const format = parsed.format;

  if (!stream || !stream.width || !stream.height || !format || !format.duration) {
    throw new Error("Unable to read width, height, or duration from the input video.");
  }

  return {
    width: Number(stream.width),
    height: Number(stream.height),
    duration: Number(format.duration),
  };
}

function fitDimensions(width, height, maxWidth, maxHeight) {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  const fittedWidth = Math.max(2, Math.round((width * ratio) / 2) * 2);
  const fittedHeight = Math.max(2, Math.round((height * ratio) / 2) * 2);

  return {
    width: fittedWidth,
    height: fittedHeight,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || args.h) {
    printHelp();
    return;
  }

  if (!args.input) {
    printHelp();
    throw new Error("Missing required --input argument.");
  }

  const projectRoot = process.cwd();
  const ffmpegPath = resolveBinary(args.ffmpeg, "ffmpeg");
  const ffprobePath = resolveBinary(args.ffprobe, "ffprobe");
  const inputPath = path.resolve(projectRoot, args.input);

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input video not found: ${inputPath}`);
  }

  const targetDuration = ensurePositiveNumber(args["target-duration"] || 4, "target-duration");
  const fps = ensurePositiveNumber(args.fps || 15, "fps");
  const maxWidth = ensurePositiveNumber(args["max-width"] || 720, "max-width");
  const maxHeight = ensurePositiveNumber(args["max-height"] || 720, "max-height");

  const video = probeVideo(ffprobePath, inputPath);
  const fitted = fitDimensions(video.width, video.height, maxWidth, maxHeight);
  const durationScale = targetDuration / video.duration;
  const speedExpr = `${durationScale.toFixed(6)}*PTS`;
  const defaultOutput = path.resolve(
    projectRoot,
    "asset",
    `${path.basename(inputPath, path.extname(inputPath))}.gif`,
  );
  const outputPath = path.resolve(projectRoot, args.output || defaultOutput);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const filter = [
    `[0:v]fps=${fps},scale=${fitted.width}:${fitted.height}:flags=lanczos,setpts=${speedExpr},split[v1][v2]`,
    `[v1]palettegen=stats_mode=diff[palette]`,
    `[v2][palette]paletteuse=dither=sierra2_4a`,
  ].join(";");

  run(ffmpegPath, [
    "-y",
    "-i",
    inputPath,
    "-filter_complex",
    filter,
    "-loop",
    "0",
    outputPath,
  ], { stdio: "inherit" });

  console.log("");
  console.log(`Created GIF: ${outputPath}`);
  console.log(`Source size: ${video.width}x${video.height}, ${video.duration.toFixed(2)}s`);

  const motionLabel =
    video.duration < targetDuration
      ? "slowed down"
      : video.duration > targetDuration
        ? "sped up"
        : "kept at original speed";

  console.log(`Output size: ${fitted.width}x${fitted.height}, target duration ${targetDuration}s, ${fps} fps`);
  console.log(`Timing: source was ${motionLabel} to match the target duration`);
}

try {
  main();
} catch (error) {
  console.error("");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}


