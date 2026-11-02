# MARS SAFE PATH — Final project package

**Challenge:** Interplanetary Survival Guide: Martian Map  
**Project type:** Individual student educational prototype  
**Focus region:** Jezero Crater, Mars

## What is included
- `index.html` — complete interactive application interface
- `styles.css` — responsive visual design
- `app.js` — Leaflet map, NASA Mars Trek layers, demonstration waypoints and A* pathfinding
- `PROJECT_REPORT.md` — project report and technical explanation
- `SUBMISSION_DESCRIPTION.txt` — ready-to-edit challenge description
- `DEMO_SCRIPT.md` — short presentation walkthrough
- `TEST_CHECKLIST.md` — final local verification checklist

## Run on Windows
1. Extract the ZIP file.
2. Open the `Mars_Safe_Path_Final` folder.
3. Double-click `index.html` (or use VS Code + Live Server).
4. Keep an internet connection enabled; Leaflet and NASA map tiles load online.

## NASA map layers used
1. Viking visible global mosaic — optical context.
2. MGS MOLA global colour hillshade — topographic context.
3. Mars Odyssey THEMIS daytime infrared mosaic — thermal infrared context.

These layers are independently selectable in the interface. They are visual context only; the application does **not** analyse their pixels or use them to calculate route costs.

## Important honesty note
The A* algorithm operates on a small synthetic 16 × 16 cost grid created for this prototype. Waypoints and high-cost circles are illustrative examples. They are not measured terrain hazards, and the route is not a validated safe path. Do not claim that the app performs automated hazard detection or that the output is suitable for real mission operations.

## Before you submit
- Open the app on the same computer/browser you will use for your demo.
- Confirm the map tiles load and toggle all three NASA layers.
- Calculate at least two different routes.
- Capture your own screenshots and record the demo using your own voice.
- Replace the individual/team and contribution details in the submission form with accurate information.
- Check the official challenge portal for its current required fields and deadline.
