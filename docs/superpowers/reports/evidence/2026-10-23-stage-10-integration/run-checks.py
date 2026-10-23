from pathlib import Path
import subprocess,json,os,datetime
root=Path('/Users/angelito/personal/Development-Playbook/.worktrees/stage10-chapter')
d=root/'docs/superpowers/reports/evidence/2026-10-23-stage-10-integration'
env=os.environ.copy();env.pop('NO_COLOR',None)
jobs=[('format',['pnpm','format:check']),('lint',['pnpm','lint']),('typecheck',['pnpm','typecheck']),('test',['pnpm','test','--maxWorkers=1']),('build',['pnpm','build'])]
results=[]
for name,command in jobs:
 start=datetime.datetime.now(datetime.timezone.utc).isoformat()
 with (d/(name+'.log')).open('w') as out:
  run=subprocess.run(command,cwd=root/'web',env=env,stdout=out,stderr=subprocess.STDOUT)
 results.append({'name':name,'command':command,'cwd':str(root/'web'),'started':start,'exit_code':run.returncode,'log':name+'.log'})
 (d/'gate-results.json').write_text(json.dumps(results,indent=2)+'\n')
 print(name+': exit '+str(run.returncode),flush=True)
 print('\n'.join((d/(name+'.log')).read_text().splitlines()[-14:]),flush=True)
 if run.returncode:raise SystemExit(run.returncode)
