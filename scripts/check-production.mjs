import {spawn} from 'node:child_process';
import {TOOLS_REGISTRY} from '../data/toolsRegistry.ts';
const server=spawn('node',['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3001'],{stdio:['ignore','pipe','pipe']});
try {
 await new Promise((resolve,reject)=>{server.stdout.on('data',d=>{if(d.toString().includes('Ready'))resolve()});server.on('exit',c=>reject(new Error(`server exited ${c}`)));setTimeout(()=>reject(new Error('startup timeout')),15000).unref()});
 for (const tool of TOOLS_REGISTRY) {
  const res=await fetch(`http://127.0.0.1:3001/tools/${tool.slug}`);
  if(res.status!==200)throw new Error(`${tool.slug}: ${res.status}`);
  const html=await res.text();
  const schemas=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(x=>JSON.parse(x[1]));
  if(!schemas.some(x=>x['@type']==='WebApplication'))throw new Error(`schema missing ${tool.slug}`);
  for(const alias of tool.aliases||[]){const r=await fetch(`http://127.0.0.1:3001/tools/${alias}`,{redirect:'manual'});if(r.status!==308)throw new Error(`${alias}: ${r.status}`)}
 }
 const robots=await(await fetch('http://127.0.0.1:3001/robots.txt')).text();
 if(robots.includes('Disallow: /_next/'))throw new Error('Blocked assets');
 const home=await(await fetch('http://127.0.0.1:3001/')).text();
 if(!home.includes('Free online text tools for everyday work'))throw new Error('Missing server content');
 console.log('PASS: 43 tool routes, all alias redirects, parsed JSON-LD, crawlable assets, server-rendered homepage content');
}finally{server.kill()}
