# Lotus Portfolio

A Next.js portfolio site with:

- a research/project homepage
- an interactive MediaPipe hand overlay
- gesture-based navigation
- drawing with the index finger
- pinch-based scrolling on the main site
- swipe-to-flip interaction inside the idea book pages

## Getting Started

Run the dev server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To create a production build:

```bash
npm run build
npm run start
```

## Hand Gestures

On the main homepage:

- `👋 Open palm` -> jump to Home
- `✊ Closed fist` -> jump to About
- `✌️ Victory` -> jump to Projects
- `👌 OK` -> jump to Ideas
- `👍 Thumbs up` -> jump to Thinking
- `🤟 I love you` -> jump to Contact
- `☝️ Index finger` -> draw colored trails
- `🤏 Pinched index + middle fingers` -> scroll vertically

On idea detail pages:

- `☝️ Index finger` -> draw colored trails
- `🤏 Pinched index + middle fingers, then swipe left/right` -> flip the book pages

## Notes

- The animated homepage background is a lotus bloom.
- The site uses MediaPipe in the browser for hand tracking and gesture recognition.
- The favicon and app icon are generated from local lotus artwork in the repo.

## GIF Conversion

Convert a local demo video into a GIF with:

```bash
npm run gif -- --input .\asset\demo_with_prediction.mp4
```

You can also pass any other local video path:

```bash
npm run gif -- --input .\path\to\your-demo.mp4
```

Optional flags:

```bash
npm run gif -- --input .\asset\demo_with_prediction.mp4 --target-duration 4 --fps 15
```
