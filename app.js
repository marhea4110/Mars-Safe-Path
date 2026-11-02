/* Mars Safe Path — educational traverse-planning prototype.
   NASA imagery layers are visual references only.
   A* route costs are synthetic teaching data, not measured hazards. */

const CENTER = [18.4, 77.5];
const map = L.map("map", {
  crs: L.CRS.EPSG4326, center: CENTER, zoom: 3, minZoom: 1, maxZoom: 8,
  zoomControl: true, worldCopyJump: false
});

const tileOptions = {
  minZoom: 0, maxZoom: 8, noWrap: true,
  attribution: 'NASA / JPL / USGS — <a href="https://trek.nasa.gov/mars/" target="_blank" rel="noopener">Mars Trek</a>'
};
const viking = L.tileLayer(
  "https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
  tileOptions
).addTo(map);
const mola = L.tileLayer(
  "https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
  {...tileOptions, opacity: 0.55}
).addTo(map);
const themis = L.tileLayer(
  "https://trek.nasa.gov/tiles/Mars/EQ/THEMIS_DayIR_ControlledMosaics_100m_v2_oct2018/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
  {...tileOptions, opacity: 0.68}
);

const locations = {
  west: {name:"West Ridge Station", lat:18.455, lon:77.405},
  delta: {name:"Delta Science Site", lat:18.385, lon:77.575},
  basin: {name:"Crater Basin Edge", lat:18.325, lon:77.475}
};

// Synthetic 16 x 16 cost grid, created solely to demonstrate A*.
const SIZE = 16;
const costGrid = Array.from({length:SIZE}, (_,r) =>
  Array.from({length:SIZE}, (_,c) => {
    let cost = 1;
    if ((r>=3 && r<=7 && c>=6 && c<=8) ||
        (r>=9 && r<=12 && c>=10 && c<=13) ||
        (r>=11 && r<=13 && c>=3 && c<=5)) cost = 9;
    if ((r===8 && c>=6 && c<=9) || (r>=4 && r<=6 && c===9)) cost = 4;
    return cost;
  })
);
const BOUNDS = {minLat:18.29,maxLat:18.48,minLon:77.39,maxLon:77.60};
function toGrid(p) {
  const c = Math.max(0,Math.min(SIZE-1,Math.round((p.lon-BOUNDS.minLon)/(BOUNDS.maxLon-BOUNDS.minLon)*(SIZE-1))));
  const r = Math.max(0,Math.min(SIZE-1,Math.round((BOUNDS.maxLat-p.lat)/(BOUNDS.maxLat-BOUNDS.minLat)*(SIZE-1))));
  return {r,c};
}
function toLatLng(p) {
  return [BOUNDS.maxLat-p.r/(SIZE-1)*(BOUNDS.maxLat-BOUNDS.minLat),
          BOUNDS.minLon+p.c/(SIZE-1)*(BOUNDS.maxLon-BOUNDS.minLon)];
}
const key = p => `${p.r},${p.c}`;
const heuristic = (a,b) => Math.hypot(a.r-b.r,a.c-b.c);

// A* with 8-direction movement and a no-corner-cut rule.
function findPath(start,goal) {
  const open=[{...start,g:0,f:heuristic(start,goal)}], came=new Map();
  const scores=new Map([[key(start),0]]), closed=new Set();
  const dirs=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
  while(open.length) {
    open.sort((a,b)=>a.f-b.f);
    const cur=open.shift(), ck=key(cur);
    if(closed.has(ck)) continue;
    if(cur.r===goal.r && cur.c===goal.c) {
      const path=[goal]; let k=key(goal);
      while(came.has(k)){const prev=came.get(k);path.unshift(prev);k=key(prev);}
      return path;
    }
    closed.add(ck);
    for(const [dr,dc] of dirs) {
      const nr=cur.r+dr,nc=cur.c+dc;
      if(nr<0||nr>=SIZE||nc<0||nc>=SIZE) continue;
      if(dr!==0&&dc!==0&&(costGrid[cur.r][nc]>=9||costGrid[nr][cur.c]>=9)) continue;
      const next={r:nr,c:nc}, nk=key(next);
      if(closed.has(nk)) continue;
      const step=(dr&&dc)?Math.SQRT2:1;
      const tentative=cur.g+step*costGrid[nr][nc];
      if(tentative<(scores.get(nk)??Infinity)) {
        came.set(nk,{r:cur.r,c:cur.c}); scores.set(nk,tentative);
        open.push({...next,g:tentative,f:tentative+heuristic(next,goal)});
      }
    }
  }
  return [];
}
function marsDistance(a,b) {
  const R=3390, rad=x=>x*Math.PI/180;
  const dLat=rad(b.lat-a.lat),dLon=rad(b.lon-a.lon);
  const h=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
function pathCost(path) {
  return path.reduce((sum,p)=>sum+costGrid[p.r][p.c],0);
}
function makeIcon(cls) {
  return L.divIcon({className:"",html:`<div class="${cls}"></div>`,iconSize:[14,14],iconAnchor:[7,7]});
}
const waypointLayer=L.layerGroup().addTo(map);
const zoneLayer=L.layerGroup().addTo(map);
const routeLayer=L.layerGroup().addTo(map);

Object.values(locations).forEach(p =>
  L.marker([p.lat,p.lon],{icon:makeIcon("waypoint-dot")})
   .bindPopup(`<b>${p.name}</b><br>Example waypoint · ${p.lat.toFixed(3)}° N, ${p.lon.toFixed(3)}° E`)
   .addTo(waypointLayer)
);
[
  {lat:18.425,lon:77.475,radius:1900,label:"Synthetic high-cost area A"},
  {lat:18.345,lon:77.555,radius:1700,label:"Synthetic high-cost area B"},
  {lat:18.325,lon:77.445,radius:1200,label:"Synthetic high-cost area C"}
].forEach(z=>L.circle([z.lat,z.lon],{
  radius:z.radius,color:"#ff8b70",weight:1.5,fillColor:"#ef7059",fillOpacity:.2
}).bindPopup(`<b>${z.label}</b><br>Illustrative only — not a measured terrain hazard.`).addTo(zoneLayer));

function calculate() {
  routeLayer.clearLayers();
  const start=locations[document.getElementById("start").value];
  const end=locations[document.getElementById("destination").value];
  const msg=document.getElementById("routeMessage");
  if(start===end){msg.textContent="Choose two different mission endpoints.";return;}
  const path=findPath(toGrid(start),toGrid(end));
  if(!path.length){msg.textContent="No path found in the synthetic grid. Try another endpoint pair.";return;}
  const pts=path.map(toLatLng), direct=[[start.lat,start.lon],[end.lat,end.lon]];
  const routeKm=pts.slice(1).reduce((sum,p,i)=>sum+marsDistance(
    {lat:pts[i][0],lon:pts[i][1]},{lat:p[0],lon:p[1]}),0);
  const directKm=marsDistance(start,end);
  const routeCost=pathCost(path);
  const directCost=Math.round((directKm/0.7)*2.4);
  L.polyline(direct,{color:"#f5c06d",weight:3,dashArray:"7 8",opacity:.9})
    .bindPopup("Direct comparison line; no terrain-cost optimisation.").addTo(routeLayer);
  L.polyline(pts,{color:"#7ed6ad",weight:5,opacity:.95,lineCap:"round"})
    .bindPopup("A* path through the synthetic demonstration cost grid.").addTo(routeLayer);
  document.getElementById("routeDistance").textContent=`${routeKm.toFixed(2)} km`;
  document.getElementById("directDistance").textContent=`${directKm.toFixed(2)} km`;
  document.getElementById("routeCost").textContent=`${routeCost} units`;
  document.getElementById("directCost").textContent=`${directCost} units`;
  document.getElementById("extraDistance").textContent=`${Math.max(0,routeKm-directKm).toFixed(2)} km`;
  msg.textContent=`Demonstration route: ${start.name} → ${end.name}. A* minimises the synthetic grid cost; this output is not derived from NASA terrain measurements and is not a safety rating.`;
  map.fitBounds(L.latLngBounds(pts),{padding:[45,45],maxZoom:5});
}
document.getElementById("planBtn").addEventListener("click",calculate);
["start","destination"].forEach(id=>document.getElementById(id).addEventListener("change",calculate));
document.getElementById("molaToggle").addEventListener("change",e=>e.target.checked?mola.addTo(map):map.removeLayer(mola));
document.getElementById("themisToggle").addEventListener("change",e=>e.target.checked?themis.addTo(map):map.removeLayer(themis));
document.getElementById("vikingToggle").addEventListener("change",e=>e.target.checked?viking.addTo(map):map.removeLayer(viking));
document.getElementById("hazardToggle").addEventListener("change",e=>e.target.checked?zoneLayer.addTo(map):map.removeLayer(zoneLayer));
document.getElementById("waypointToggle").addEventListener("change",e=>e.target.checked?waypointLayer.addTo(map):map.removeLayer(waypointLayer));
calculate();
