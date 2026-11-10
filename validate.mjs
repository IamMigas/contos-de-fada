import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import crypto from 'node:crypto';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const recipes=read('./data/recipes.js'),locations=read('./data/locations.js');
const baseline=JSON.parse(read('./data/recipes-baseline.json'));
const context=vm.createContext({});vm.runInContext(recipes+'\n'+locations,context);
for(const key of ['ARMAS_RECIPES','ARMAS','DESTILARIA','FARMACOS','BARCO']){const value=vm.runInContext(key,context);assert.deepEqual(JSON.parse(JSON.stringify(value)),baseline[key],key+' difere das receitas base');for(const [name,recipe] of Object.entries(value)){assert(name.trim());assert(Object.keys(recipe).length);for(const [material,q] of Object.entries(recipe))assert(material.trim()&&Number.isInteger(q)&&q>0)}}
const points=vm.runInContext('CRAFT_LOCATIONS',context);for(const [name,p]of Object.entries(points)){assert(Number.isFinite(p.x)&&p.x>=0&&p.x<=1,name);assert(Number.isFinite(p.y)&&p.y>=0&&p.y<=1,name)}
const html=read('./index.html');for(const [,code]of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(code);
for(const name of ['assets/pro.js','assets/map-tiles.js','data/recipes.js','data/locations.js'])new vm.Script(read(name));
for(const [,src]of html.matchAll(/(?:src|href)="(\.\/[^"?#]+)(?:[^"#]*)"/g))assert(fs.existsSync(new URL(src,import.meta.url)),src+' em falta');
for(const [level,width]of [900,1800,3600,7200].entries())for(let y=0;y<Math.ceil(width*.75/1024);y++)for(let x=0;x<Math.ceil(width/1024);x++)assert(fs.existsSync(new URL(`./assets/tiles/${level}/${x}-${y}.jpg`,import.meta.url)));
console.log('OK: receitas base, quantidades, coordenadas, JavaScript, ficheiros e blocos do mapa.');
console.log('Nota: Remington 1858 tem localização preparada; a receita ainda não foi fornecida.');
