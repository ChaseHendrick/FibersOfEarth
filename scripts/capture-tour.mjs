// Capture the real local application. Media generation is optional and never runs in CI.
import {chromium} from 'playwright';
import {spawn,spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const python=process.env.TOUR_PYTHON||'python3';
if(spawnSync(python,['-c','from PIL import Image'],{stdio:'ignore'}).status!==0){
 console.error('Tour encoding requires Python with Pillow. See docs/MEDIA.md; set TOUR_PYTHON to that Python executable.');process.exit(1);
}
await fs.access(path.join(root,'dist/index.html'));
const framesDir=path.join(root,'work/readme-tour');
await fs.mkdir(framesDir,{recursive:true});await fs.mkdir(path.join(root,'docs/screenshots'),{recursive:true});
const port=process.env.TOUR_PORT||'4182';
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:port},stdio:['ignore','pipe','inherit']});
let browser;
try{
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('Preview server exited: '+code)));});
 browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{}),...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{})});
 const context=await browser.newContext({viewport:{width:1280,height:880},deviceScaleFactor:1,reducedMotion:'no-preference'});
 const page=await context.newPage(),errors=[],manifest=[];
 page.on('pageerror',e=>errors.push(e.message));
 const go=async route=>{await page.goto(`http://127.0.0.1:${port}/#/${route}`);await page.locator('h1').waitFor();await page.mouse.move(1270,875);await page.evaluate(()=>document.fonts.ready);};
 async function frame(duration=200){const name=`frame-${String(manifest.length).padStart(3,'0')}.png`;await page.screenshot({path:path.join(framesDir,name),caret:'hide'});manifest.push({file:name,duration});}
 async function hold(n){for(let i=0;i<n;i++){await frame();await page.waitForTimeout(150);}}
 async function scroll(to,n=5){const from=await page.evaluate(()=>scrollY);for(let i=1;i<=n;i++){await page.evaluate(y=>scrollTo(0,y),Math.round(from+(to-from)*i/n));await frame(120);}}
 await go('atlas/wool');await page.locator('.map-node').first().waitFor();
 await page.screenshot({path:path.join(root,'docs/screenshots/readme-poster.png'),caret:'hide'});
 await hold(12);
 await go('brands');await frame(1600);await scroll(230);
 await page.screenshot({path:path.join(root,'docs/screenshots/brand-directory-desktop.png'),caret:'hide'});
 const input=page.getByRole('searchbox',{name:'Search brands',exact:true});
 for(const text of ['Fox','Fox Brothers']){await input.fill(text);await page.mouse.move(1270,875);await frame(500);}
 await frame(1400);
 await page.locator('.brand-card h2 a').filter({hasText:'Fox Brothers'}).click();
 await page.getByRole('heading',{name:'Fox Brothers',level:1,exact:true}).waitFor();await page.mouse.move(1270,875);
 await frame(2200);
 await page.screenshot({path:path.join(root,'docs/screenshots/brand-research-desktop.png'),caret:'hide'});
 await go('science');await frame(1600);
 await page.getByRole('button',{name:'2/2 twill',exact:true}).click();await page.mouse.move(1270,875);await frame(1400);
 await page.getByRole('button',{name:'5-end satin',exact:true}).click();await page.mouse.move(1270,875);await frame(1600);
 await page.screenshot({path:path.join(root,'docs/screenshots/science-tour-desktop.png'),caret:'hide'});
 // Hold the first view at the loop boundary, keeping navigation transitions brief and calm.
 await go('atlas/wool');await page.locator('.map-node').first().waitFor();await frame(1800);
 if(errors.length)throw Error(errors.join('\n'));
 await fs.writeFile(path.join(framesDir,'frames.json'),JSON.stringify({width:1024,frames:manifest},null,2));
 const encoded=spawnSync(python,['scripts/encode-tour.py',path.join(framesDir,'frames.json'),'docs/screenshots/site-tour.gif'],{cwd:root,stdio:'inherit'});
 if(encoded.status!==0)throw Error('GIF encoding failed');
 console.log('Tour and still images captured from the current build.');
}finally{await browser?.close();server.kill();}
