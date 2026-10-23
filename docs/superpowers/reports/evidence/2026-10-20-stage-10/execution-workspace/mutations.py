from pathlib import Path
import subprocess, json, hashlib, re, tempfile
root=Path.cwd(); w=root/'.superpowers/sdd/2026-10-20-stage-10-documentation'
chapter=root/'docs/10-documentation.md'; terms=root/'web/src/lib/terms.ts'
saved={p:p.read_bytes() for p in [chapter,terms]}
for p,data in saved.items():
 committed=subprocess.check_output(['git','show','HEAD:'+str(p.relative_to(root))]); assert committed==data
 (w/('saved-'+p.name)).write_bytes(data)
def run(name,args,expected):
 p=subprocess.run(['pnpm','exec','vitest','run',*args],cwd=root/'web',capture_output=True,text=True)
 (w/(name+'.log')).write_text(p.stdout+p.stderr)
 print(name, 'exit',p.returncode, '\n'.join((p.stdout+p.stderr).splitlines()[-6:]),flush=True)
 assert p.returncode==expected,(name,p.returncode)
def mutation(name,path,text,args,full=False):
 try:
  path.write_text(text)
  diff=subprocess.check_output(['git','diff','--',str(path.relative_to(root))],text=True)
  assert diff; (w/(name+'.diff')).write_text(diff)
  run(name,args,1)
  if full:run(name+'-full',['src/lib/stage-10-structure.test.ts'],1)
 finally:
  path.write_bytes(saved[path]); assert path.read_bytes()==saved[path]
  assert not subprocess.check_output(['git','diff','--',str(path.relative_to(root))])
  (w/(name+'-restored.log')).write_text('Restored saved committed bytes; git diff empty for '+str(path.relative_to(root))+'\nSHA256 '+hashlib.sha256(path.read_bytes()).hexdigest()+'\n')
run('task-3-baseline',['src/lib/terms.test.ts','src/lib/glossary.test.ts','src/lib/stage-10-structure.test.ts','src/lib/stage-metadata.test.ts'],0)
s=saved[chapter].decode(); start=s.index('### Choose the document for the reader’s task'); end=s.index('### Keep the README usable',start)
mut=s[:start]+s[end:]+'\n## Research findings for chapter review\n\n'+s[start:end]
mutation('task-3-appendix',chapter,mut,['src/lib/stage-10-structure.test.ts','-t','^reader needs choose a small useful set'])
needle='### Update and verify documentation with the change\n'
assert needle in s
mutation('task-3-enforcement',chapter,s.replace(needle,needle+'\nA configuration example means the app stops booting when it drifts.\n',1),['src/lib/stage-10-structure.test.ts','-t','^documentation checks include configuration'],True)
needle='[ADR 005](005-generated-contract-reference.md)'; assert s.count(needle)==1
mutation('task-3-link',chapter,s.replace(needle,'ADR 005',1),['src/lib/stage-10-structure.test.ts','-t','^replaced ADRs expose current status'],True)
old=subprocess.check_output(['git','show','ac30cf7:web/src/lib/terms.ts'],text=True)
oldfull=re.search(r"  adr: \{.*?    full: '([^']*)'",old,re.S).group(1)
t=saved[terms].decode(); match=re.search(r"  adr: \{.*?    full: '([^']*)'",t,re.S); assert match
mut=t[:match.start(1)]+oldfull+t[match.end(1):]
mutation('task-3-term',terms,mut,['src/lib/terms.test.ts','-t','^ADR history stays intact'])
# Additional teeth for the confirmed inbound-anchor integration correction.
p=root/'docs/03-architecture.md'; original=p.read_bytes()
try:
 p.write_text(original.decode().replace('10-documentation.md#record-decisions-and-supersede-them-visibly','10-documentation.md#document-decisions-not-descriptions'))
 (w/'task-3-anchor.diff').write_bytes(subprocess.check_output(['git','diff','--','docs/03-architecture.md']))
 run('task-3-anchor',['src/lib/source-citations.test.ts','-t','^every cross-document anchor link'],1)
finally:
 p.write_bytes(original); assert not subprocess.check_output(['git','diff','--','docs/03-architecture.md'])
 (w/'task-3-anchor-restored.log').write_text('Restored committed Stage 03 bytes; git diff empty\n')
run('task-3-restored-green',['src/lib/terms.test.ts','src/lib/glossary.test.ts','src/lib/stage-10-structure.test.ts','src/lib/stage-metadata.test.ts'],0)
print('All mutation source bytes restored and targeted group GREEN',flush=True)
