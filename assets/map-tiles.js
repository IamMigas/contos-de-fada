/* Load only visible map tiles at a detail level matching the displayed size. */
(() => {
const layer=document.createElement('div');layer.className='map-tile-layer';layer.setAttribute('aria-hidden','true');mapWorld.insertBefore(layer,mapMarkers);
// Decorative parchment panels cover only the two logos in empty map margins.
const margins=document.createElement('div');margins.className='map-margin-panels';margins.setAttribute('aria-hidden','true');
for(const name of ['top','bottom']){const panel=document.createElement('div');panel.className='map-margin-'+name;margins.append(panel)}
mapWorld.insertBefore(margins,mapMarkers);
let scheduled=false;
function paint(){scheduled=false;layer.hidden=activeMapMode!=='hd'||!mapOpened;margins.hidden=layer.hidden;if(layer.hidden)return;
 const width=mapImage.clientWidth,height=mapImage.clientHeight;if(!width||!height)return;
 const target=width*zoom*Math.min(window.devicePixelRatio||1,2);const sizes=[900,1800,3600,7200];const level=Math.min(3,Math.max(0,Math.ceil(Math.log2(Math.max(900,target)/900))));const nativeWidth=sizes[level],nativeHeight=nativeWidth*.75;
 const scaleX=width*zoom/nativeWidth,scaleY=height*zoom/nativeHeight;
 const minX=Math.max(0,Math.floor((-panX/scaleX)/1024)-1),maxX=Math.min(Math.ceil(nativeWidth/1024)-1,Math.floor(((mapViewport.clientWidth-panX)/scaleX)/1024)+1);
 const minY=Math.max(0,Math.floor((-panY/scaleY)/1024)-1),maxY=Math.min(Math.ceil(nativeHeight/1024)-1,Math.floor(((mapViewport.clientHeight-panY)/scaleY)/1024)+1);
 const wanted=new Set();for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){const key=level+'/'+x+'-'+y;wanted.add(key);if(layer.querySelector('[data-tile="'+key+'"]'))continue;const tile=new Image();tile.dataset.tile=key;tile.alt='';tile.decoding='async';tile.draggable=false;tile.style.cssText=`position:absolute;left:${x*1024/nativeWidth*100}%;top:${y*1024/nativeHeight*100}%;width:${Math.min(1024,nativeWidth-x*1024)/nativeWidth*100}%;height:${Math.min(1024,nativeHeight-y*1024)/nativeHeight*100}%;`;tile.src='./assets/tiles/'+key+'.jpg';tile.onerror=()=>{tile.remove();document.getElementById('mapQualityNote').textContent='Alguns detalhes do mapa não carregaram. Reabre o mapa para tentar novamente.'};layer.append(tile)}
 for(const tile of [...layer.children])if(!wanted.has(tile.dataset.tile))tile.remove();
}
const original=updateMapTransform;updateMapTransform=function(){original();if(!scheduled){scheduled=true;requestAnimationFrame(paint)}};
mapImage.addEventListener('load',paint);window.addEventListener('resize',paint);
})();

// Two-finger zoom, retaining ordinary one-finger panning.
(() => {
const touches=new Map();let distance=0;
mapFrame.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||e.target.closest('.map-marker'))return;touches.set(e.pointerId,{x:e.clientX,y:e.clientY});if(touches.size===2){dragging=false;const [a,b]=[...touches.values()];distance=Math.hypot(a.x-b.x,a.y-b.y);e.stopImmediatePropagation()}},true);
mapFrame.addEventListener('pointermove',e=>{if(!touches.has(e.pointerId))return;touches.set(e.pointerId,{x:e.clientX,y:e.clientY});if(touches.size!==2)return;dragging=false;dragMoved=true;e.stopImmediatePropagation();const [a,b]=[...touches.values()],next=Math.hypot(a.x-b.x,a.y-b.y),rect=mapViewport.getBoundingClientRect();if(distance>0)zoomMapBy(next/distance,(a.x+b.x)/2-rect.left,(a.y+b.y)/2-rect.top);distance=next;},true);
for(const event of ['pointerup','pointercancel'])mapFrame.addEventListener(event,e=>{touches.delete(e.pointerId);if(touches.size<2)distance=0},true);
})();
