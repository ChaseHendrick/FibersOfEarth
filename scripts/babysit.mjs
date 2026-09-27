import {spawnSync} from 'node:child_process';
// Runs only when invoked. No scheduler, auto-merge, deployment or external-site crawling.
for(const task of ['test','check:directory','build','test:browser']){
 console.log(`\nRepository babysit: ${task}`);
 const r=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['run',task],{stdio:'inherit',env:process.env});
 if(r.error){console.error(r.error.message);process.exit(1);}
 if(r.status!==0){console.error(`Babysit stopped: ${task} failed.`);process.exit(r.status||1);}
}
console.log('\nRepository babysit passed: data, sources, build, offline behavior and browser checks.');
