const {createRequire}=require('node:module');
const requireWeb=createRequire(process.cwd()+'/package.json');
const {chromium}=requireWeb('@playwright/test');
const fs=require('node:fs');const assert=require('node:assert/strict');
const out=process.env.STAGE10_EVIDENCE_DIR;const base=process.env.STAGE10_BASE_URL||'http://localhost:3101';
(async()=>{
 const browser=await chromium.launch(); const results=[];
 try{
  for(const theme of ['light','dark'])for(const width of [320,1440]){
   const context=await browser.newContext({viewport:{width,height:900},colorScheme:theme}); const page=await context.newPage();const errors=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
   await page.goto(base+'/stages/03-architecture#record',{waitUntil:'networkidle'});
   await page.evaluate(t=>localStorage.setItem('playbook:theme',JSON.stringify(t)),theme);
   await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
   const button=page.getByRole('button',{name:'ADR',exact:true}).first();await button.click();
   const panel=page.getByRole('note').filter({hasText:'dated supersession notice'});await panel.waitFor({state:'visible'});await panel.scrollIntoViewIfNeeded();
   const text=await panel.innerText();assert(text.includes('historical reasoning'));assert(text.includes('new ADR'));assert(!text.includes('never edited afterward'));
   assert.equal(await page.evaluate(()=>innerWidth),width);
   const geometry=await panel.evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,panelWidth:r.width,overflow:document.documentElement.scrollWidth-innerWidth}});
   assert(geometry.left>=0 && geometry.right<=width+1 && geometry.overflow<=1);
   const colors=await panel.evaluate(el=>{
    const text=Array.from(el.querySelectorAll('span')).find(n=>n.textContent.includes('historical reasoning')&&n.children.length===0);const cs=getComputedStyle(text),bg=getComputedStyle(el).backgroundColor;
    const rgb=c=>{const cv=document.createElement('canvas');cv.width=cv.height=1;const ctx=cv.getContext('2d');ctx.fillStyle=c;ctx.fillRect(0,0,1,1);return Array.from(ctx.getImageData(0,0,1,1).data).slice(0,3)};
    return {fg:rgb(cs.color),bg:rgb(bg)};
   });
   const lum=rgb=>rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
   const a=lum(colors.fg),b=lum(colors.bg),contrast=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);assert(contrast>=4.5);
   assert.deepEqual(errors,[]);const file=`adr-${theme}-${width}.png`;await page.screenshot({path:out+'/'+file});
   const row={url:page.url(),theme,viewportWidth:width,...geometry,contrast:Number(contrast.toFixed(2)),errors,screenshot:file};results.push(row);console.log(JSON.stringify(row));await context.close();
  }
  const glossary=fs.readFileSync('../reference/glossary.md','utf8');const line=glossary.split('\n').find(l=>l.startsWith('**ADR ('));
  assert(line.includes('historical reasoning')&&line.includes('dated supersession notice'));assert(line.includes('(../docs/03-architecture.md)'));assert(fs.existsSync('../docs/03-architecture.md'));
  const response=await fetch(base+'/stages/03-architecture');assert.equal(response.status,200);
  console.log('Generated Markdown ADR entry and Stage03 destination verified. No standalone web glossary route or see link in Term component exists.');
  fs.writeFileSync(out+'/adr-visual-results.json',JSON.stringify(results,null,2)+'\n');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
