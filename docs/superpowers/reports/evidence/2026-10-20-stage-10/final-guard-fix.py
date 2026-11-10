from pathlib import Path
import subprocess
root=Path.cwd();w=root/'.superpowers/sdd/2026-10-20-stage-10-documentation'
chapter=root/'docs/10-documentation.md';test=root/'web/src/lib/stage-10-structure.test.ts'
nl=chr(10)
validator_needle=' only'+nl+'if the application actually invokes it'
status_needle='2026-10-20 — Current status: Superseded.'+nl
saved=chapter.read_bytes();assert saved==subprocess.check_output(['git','show','9fd17d2:docs/10-documentation.md'])
def run(name,args,expected):
 p=subprocess.run(['pnpm','exec','vitest','run',*args],cwd=root/'web',capture_output=True,text=True)
 (w/(name+'.log')).write_text(p.stdout+p.stderr)
 print(name, 'exit',p.returncode, nl.join((p.stdout+p.stderr).splitlines()[-9:]),flush=True)
 assert p.returncode==expected,(name,p.returncode)
def mutate(name,needle):
 s=saved.decode();assert s.count(needle)==1;chapter.write_text(s.replace(needle,''))
 (w/(name+'.diff')).write_bytes(subprocess.check_output(['git','diff','--','docs/10-documentation.md']))
def restore():
 chapter.write_bytes(saved);assert not subprocess.check_output(['git','diff','--','docs/10-documentation.md'])
try:
 mutate('final-validator-mutation',validator_needle)
 run('final-validator-old-guard-green',['src/lib/stage-10-structure.test.ts'],0)
 s=test.read_text();needle=r'  expect(text).toMatch(/alone[\s\S]+owner/i)'+nl
 assert s.count(needle)==1
 s=s.replace(needle,needle+"  expect(text).toContain('only if the application actually invokes it')"+nl)
 test.write_text(s)
 run('final-validator-red',['src/lib/stage-10-structure.test.ts'],1)
finally:restore()
run('final-validator-green',['src/lib/stage-10-structure.test.ts'],0)
try:
 mutate('final-old-status-mutation',status_needle)
 run('final-old-status-old-guard-green',['src/lib/stage-10-structure.test.ts'],0)
 s=test.read_text();needle="  expect(text).toContain('2026-10-20')"
 assert s.count(needle)==1
 replacement=r'''  const previous = section(
    doc(),
    'Record decisions and supersede them visibly',
  ).match(/```markdown\n(# ADR 004:[\s\S]*?)\n```/)?.[1]
  expect(previous).toBeDefined()
  expect(previous).toContain('## Supersession notice (appended)')
  expect(previous).toMatch(/\d{4}-\d{2}-\d{2} — Current status: Superseded\./)'''
 s=s.replace(needle,replacement);test.write_text(s)
 run('final-old-status-red',['src/lib/stage-10-structure.test.ts'],1)
finally:restore()
run('final-both-guards-green',['src/lib/stage-10-structure.test.ts'],0)
for name,needle in [('validator',validator_needle),('old-status',status_needle)]:
 try:
  mutate('final-'+name+'-teeth',needle)
  run('final-'+name+'-teeth',['src/lib/stage-10-structure.test.ts'],1)
 finally:restore()
run('final-restored-green',['src/lib/stage-10-structure.test.ts','src/lib/stage-metadata.test.ts','src/lib/terms.test.ts','src/lib/glossary.test.ts','src/lib/source-citations.test.ts'],0)
print('Canonical chapter exactly restored; only semantic guards changed',flush=True)
