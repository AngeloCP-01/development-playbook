from pathlib import Path
from urllib.parse import unquote
import subprocess,re,json
root=Path.cwd();changed=subprocess.check_output(['git','diff','--name-only','79f9e31'],text=True).splitlines()
changed += subprocess.check_output(['git','ls-files','--others','--exclude-standard'],text=True).splitlines()
files=[root/p for p in set(changed) if p.endswith('.md') and (root/p).is_file()]
def strip_fences(s):
 out=[];f=None
 for line in s.splitlines():
  m=re.match(r'^ {0,3}(`{3,}|~{3,})(.*)$',line)
  if m:
   if f is None:f=(m[1][0],len(m[1]))
   elif m[1][0]==f[0] and len(m[1])>=f[1] and not m[2].strip():f=None
   continue
  if f is None:out.append(line)
 return '\n'.join(out)
def slug(s):
 s=re.sub(r'\[([^]]+)\]\([^)]*\)',r'\1',s)
 s=re.sub(r'<[^>]*>','',s).lower();s=re.sub(r'[^\w\- ]','',s);return s.replace(' ','-')
checks=[];bad=[]
for path in files:
 s=re.sub(r'(`+).*?\1', '', strip_fences(path.read_text()))
 # The archived cold-reader snapshot retains canonical chapter-relative links.
 link_base=root/'docs' if 'cold-reader/chapter.md' in str(path) else path.parent
 for m in re.finditer(r'\]\(([^)\n]+)\)',s):
  target=m[1].strip().split(' "')[0]
  if re.match(r'[a-zA-Z][a-zA-Z0-9+.-]*:',target) or target.startswith('//'):continue
  target=target.strip('<>');name,_,anchor=target.partition('#');destination=(link_base/unquote(name)).resolve() if name else path
  if not destination.exists():bad.append({'file':str(path.relative_to(root)),'target':target,'reason':'missing path'});continue
  if anchor and destination.suffix=='.md':
   heads=[slug(h) for h in re.findall(r'^#{1,6} (.+)$',strip_fences(destination.read_text()),re.M)]
   if unquote(anchor) not in heads:bad.append({'file':str(path.relative_to(root)),'target':target,'reason':'missing heading'})
  checks.append({'file':str(path.relative_to(root)),'target':target})
print(json.dumps({'files':len(files),'local_targets_checked':len(checks),'failures':bad},indent=2));raise SystemExit(bool(bad))
