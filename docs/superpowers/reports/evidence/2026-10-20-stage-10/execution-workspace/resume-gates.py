from pathlib import Path
import subprocess,json,time
w=Path.cwd()/'.superpowers/sdd/2026-10-20-stage-10-documentation'
results=json.loads((w/'gate-results.json').read_text())
for name in ['build','test:e2e','test:dev-console']:
 print('Starting',name,flush=True); start=time.monotonic()
 log=w/('gate-'+name.replace(':','-')+'.log')
 with log.open('w') as f:p=subprocess.run(['pnpm',name],cwd='web',stdout=f,stderr=subprocess.STDOUT)
 row={'command':'pnpm '+name,'exit':p.returncode,'seconds':round(time.monotonic()-start,2),'log':log.name};results.append(row)
 (w/'gate-results.json').write_text(json.dumps(results,indent=2)+'\n')
 print(row,flush=True); print('\n'.join(log.read_text().splitlines()[-14:]),flush=True)
 if p.returncode:raise SystemExit(p.returncode)
