# MARS SAFE PATH
## An Interactive Educational Traverse-Planning Prototype for Jezero Crater

### 1. Abstract
Mars Safe Path is an educational web prototype developed for the NASA Space Apps Challenge theme “Interplanetary Survival Guide: Martian Map.” It presents a focused view of the Jezero Crater region and combines three independently selectable NASA Mars Trek map products: Viking visible imagery, MGS MOLA colour hillshade and Mars Odyssey THEMIS daytime infrared imagery. The application demonstrates how route-planning concepts can be introduced through an interactive map and A* search.

### 2. Problem statement
Surface exploration on Mars requires understanding the surrounding terrain and comparing possible traverses. Different remote-sensing products provide different forms of context, such as visible surface appearance, broad topography and thermal infrared observations. A map interface can help users view these sources together and explore how a route-search algorithm works.

### 3. Proposed solution
Mars Safe Path provides:
- an interactive Leaflet map centred on Jezero Crater;
- three independently selectable NASA map layers;
- example start and destination waypoints;
- a synthetic traversal-cost grid;
- A* pathfinding with eight-direction movement and a no-corner-cut rule;
- a direct-line baseline and approximate distance/cost comparison;
- transparent explanation of data sources and limitations.

### 4. Data sources and their roles
**Viking visible global mosaic:** optical visual context for Mars surface geography.  
**MGS MOLA global colour hillshade:** elevation-derived shaded relief for broad topographic context.  
**THEMIS daytime infrared global mosaic:** thermal infrared visual context from Mars Odyssey.

The layers are presented as separate visual references. They are not fused computationally and do not supply values to the route-cost grid in this version.

### 5. Methodology
The web interface is built with HTML, CSS and JavaScript. Leaflet renders the map and NASA Mars Trek WMTS tiles. The local demonstration area is represented by a 16 × 16 grid. Each cell is assigned a synthetic traversal cost: ordinary cells have a low cost, while selected patches have higher costs. A* evaluates candidate cells using:
- **g(n):** accumulated movement cost from the start;
- **h(n):** Euclidean grid-distance heuristic to the goal;
- **f(n) = g(n) + h(n):** estimated total path cost.

Eight movement directions are allowed. Diagonal moves are prevented when they would cut through a high-cost corner. The result is compared with a direct great-circle line. Distances are approximate and intended for demonstration.

### 6. Results and interpretation
The user can select different endpoint pairs and see the route update. The A* path is expected to favour lower-cost cells in the synthetic grid, even when it is longer than the direct line. The comparison demonstrates the trade-off between geometric distance and a modelled traversal cost. Since the cost grid is synthetic, the output must not be interpreted as a real hazard assessment.

### 7. Limitations
- Synthetic costs and zones are not derived from NASA terrain data.
- NASA layers are visual-only; no image classification, slope extraction, thermal interpretation or raster fusion is performed.
- Global-scale products cannot resolve every local obstacle.
- The model excludes astronaut mobility, suit constraints, power, communications, radiation forecasts, weather and operational rules.
- The application is not a certified navigation or safety system.

### 8. Future research
A scientifically stronger version could ingest a documented, appropriately resolved Jezero digital elevation model, calculate slope and terrain roughness, define transparent thresholds, propagate data uncertainty, and validate routes against independent terrain products and known rover observations. Thermal and optical data could then be analysed with documented methods rather than simply displayed.

### 9. Conclusion
Mars Safe Path is a transparent educational demonstration of multi-layer planetary mapping and A* route search. It provides an accessible interface for exploring how remote-sensing context and route-planning algorithms can be brought together, while explicitly identifying the synthetic components that still require scientific validation.

### 10. References
- NASA Mars Trek: https://trek.nasa.gov/mars/
- Mars Trek WMTS documentation: https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars
- NASA Planetary Data System: https://pds.nasa.gov/
- Mars 2020 / Perseverance: https://mars.nasa.gov/mars2020/
