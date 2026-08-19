from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
import json,shutil,xml.etree.ElementTree as ET
R=Path(__file__).resolve().parents[1];S=R/"summit";Q=S/"publish-queue.json";L=S/"articles";D=S/"scheduled";A=S/"articles.json";M=R/"sitemap.xml"
now=datetime.now(ZoneInfo("America/Phoenix"));q=json.loads(Q.read_text());due=[];rem=[]
for x in q:
 w=datetime.fromisoformat(x["publish_date"]+"T"+x.get("publish_time","05:00")).replace(tzinfo=ZoneInfo(x.get("timezone","America/Phoenix")));(due if now>=w else rem).append(x)
if due:
 a=json.loads(A.read_text());known={x.get("slug") for x in a};ns="http://www.sitemaps.org/schemas/sitemap/0.9";ET.register_namespace("",ns);t=ET.parse(M);r=t.getroot();urls={e.text for e in r.findall(f".//{{{ns}}}loc")}
 for x in sorted(due,key=lambda y:y["publish_date"]):
  src=D/(x["slug"]+".html");dst=L/(x["slug"]+".html")
  if not src.exists():rem.append(x);continue
  shutil.copy2(src,dst);src.unlink()
  if x["slug"] not in known:a.insert(0,{k:x[k] for k in ("slug","title","category","read","description")});known.add(x["slug"])
  u=f'https://summerpeaks.com/summit/articles/{x["slug"]}.html'
  if u not in urls:
   n=ET.SubElement(r,f"{{{ns}}}url");loc=ET.SubElement(n,f"{{{ns}}}loc");loc.text=u;lm=ET.SubElement(n,f"{{{ns}}}lastmod");lm.text=x["publish_date"];urls.add(u)
 for i,x in enumerate(a,1):x["num"]=f"{len(a)-i+1:02d}"
 A.write_text(json.dumps(a,indent=2));Q.write_text(json.dumps(rem,indent=2));t.write(M,encoding="utf-8",xml_declaration=True)
 print("Published",len(due),"article(s)")
else:print("Nothing due")
