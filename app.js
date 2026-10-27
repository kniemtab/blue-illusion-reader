(() => {
 'use strict';
 const sections=window.BOOK.sections, $=id=>document.getElementById(id);
 const storage={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
 const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
 let saved;try{saved=JSON.parse(storage.get('blue-continuous-position')||'null')}catch{}
 let restoring=true, timer, current=0;
 const heads=[];
 const captions=[
 'รอยหมึกบนแผนที่กับจุดเริ่มต้นของการศึกษาชุมชนอายุยืน',
 'ชีวิตร่วมกันในชุมชนและข้อมูลที่นักวิจัยใช้ศึกษา',
 'เมื่อเรื่องราวจากหลายพื้นที่ถูกเล่าผ่านสื่อ',
 'จากวิถีชุมชนสู่โครงการส่งเสริมสุขภาพและธุรกิจ',
 'อาหารท้องถิ่นที่หลากหลายภายใต้บริบทที่แตกต่างกัน',
 'การตรวจสอบเอกสารเป็นส่วนสำคัญของการยืนยันอายุ',
 'อาหาร การเคลื่อนไหว ความสัมพันธ์ และสิ่งแวดล้อมเชื่อมโยงกัน',
 'เส้นทางของงานวิจัยและแบรนด์เชิงพาณิชย์',
 'เมื่อธุรกิจสุขภาพกลายเป็นสินทรัพย์ในการซื้อขายกิจการ',
 'ความเชื่อมโยงระหว่างนโยบายอาหารกับจานอาหารในชีวิตประจำวัน',
 'วงจรระหว่างงานวิจัย สื่อ ผลิตภัณฑ์ และการวัดผล',
 'แนวคิดหนึ่งขยายตัวผ่านสื่อ องค์กร และบริการ',
 'บริการอายุยืนกับคำถามเรื่องราคาและการเข้าถึง',
 'ความหลากหลายของวิถีชีวิตกับข้อจำกัดของสูตรเดียว',
 'พื้นที่สุขภาพที่ออกแบบขึ้นกับชุมชนที่ค่อย ๆ เติบโต',
 'การดูแลชีวิตผ่านอาหาร การเคลื่อนไหว และความสัมพันธ์ใกล้ตัว',
 'ทบทวนข้อเสนอเรื่องอาหารเมื่อข้อมูลและแนวทางเปลี่ยนไป'
 ];
 function illustration(index){
  const figure=node('figure',undefined,'chapter-illustration');
  const a=node('a');a.href='images/chapter-'+String(index).padStart(2,'0')+'.webp';a.target='_blank';a.rel='noopener';a.setAttribute('aria-label','เปิดภาพประกอบขนาดใหญ่');
  const img=node('img');img.src=a.href;img.alt=captions[index-1];img.width=1536;img.height=1024;img.loading='lazy';img.decoding='async';a.append(img);
  const caption=node('figcaption');caption.append(node('span',captions[index-1]),node('small','ภาพประกอบแนวคิดสร้างด้วย AI · ไม่ใช่ภาพจากต้นฉบับหรือเหตุการณ์จริง'));
  figure.append(a,caption);return figure;
 }
 function menu(open){$('sidebar').classList.toggle('open',open);$('menu').setAttribute('aria-expanded',String(open));$('overlay').hidden=!open;document.body.style.overflow=open&&innerWidth<=760?'hidden':''}
 function theme(){const dark=document.documentElement.dataset.theme==='dark';$('theme-label').textContent=dark?'โหมดสว่าง':'โหมดมืด';$('theme').setAttribute('aria-label',dark?'เปิดโหมดสว่าง':'เปิดโหมดมืด');document.querySelector('meta[name="theme-color"]').content=dark?'#191c21':'#f6f5f1'}
 let group='';
 sections.forEach((s,index)=>{
  if(s.group!==group){group=s.group;$('toc').append(node('div',group,'toc-group'))}
  const row=node('div',undefined,'toc-row'), link=node('a',(index>0&&index<17?'บทที่ '+index+': ':'')+s.title,'toc-link');link.href='#'+s.id;row.append(link);
  const sub=node('div',undefined,'toc-sub');sub.id='sub-'+s.id;sub.hidden=true;
  const headings=s.blocks.filter(b=>b[0]==='h');
  if(headings.length){const toggle=node('button','▸','toc-toggle');toggle.setAttribute('aria-label','แสดงหัวข้อย่อย '+s.title);toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls',sub.id);toggle.onclick=()=>{sub.hidden=!sub.hidden;toggle.setAttribute('aria-expanded',String(!sub.hidden));toggle.textContent=sub.hidden?'▸':'▾'};row.append(toggle)}
  $('toc').append(row,sub);
  const section=node('section',undefined,'book-section');section.id=s.id;section.tabIndex=-1;heads.push(section);
  const head=node('header',undefined,'article-head');head.append(node('div',index>0&&index<17?'CHAPTER '+s.no:index===17?'SPECIAL CHAPTER':index===18?'READER’S NOTES':index===19?'EDITION & SOURCES':'ภาพรวม','eyebrow'),node('h2',(index>0&&index<17?'บทที่ '+index+': ':'')+s.title,'section-title'),node('p',s.en,'english-title'),node('p',s.deck,'deck'));
  const meta=node('div',s.page+' · '+(index===18?'ข้อสังเกตแยกจากต้นฉบับ':'ฉบับสรุป'),'article-meta');head.append(meta);section.append(head);
  const prose=node('div',undefined,'prose');let h=0,illustrated=false;
  for(const [type,value] of s.blocks){
   if(type==='p'){prose.append(node('p',value));if(index>=1&&index<=17&&!illustrated){prose.append(illustration(index));illustrated=true}}
   if(type==='h'){h++;const title=node('h3',value);title.id=s.id+'-part-'+h;title.tabIndex=-1;prose.append(title);const a=node('a',value);a.href='#'+title.id;sub.append(a)}
   if(type==='list'){const ul=node('ul');value.forEach(t=>ul.append(node('li',t)));prose.append(ul)}
   if(type==='take'){const box=node('aside',undefined,'takeaway');box.append(node('small','ประเด็นที่ควรเก็บไว้'),node('p',value));prose.append(box)}
   if(type==='link'){const p=node('p',undefined,'source-link'),a=node('a',value[0]);a.href=value[1];a.target='_blank';a.rel='noopener noreferrer';p.append(a);prose.append(p)}
  }
  section.append(prose);$('article').append(section);
 });
 function progress(){
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight),percent=Math.min(100,Math.round(scrollY/max*100));
  $('progress-bar').style.width=percent+'%';document.querySelector('.progress-track').setAttribute('aria-valuenow',String(percent));
  let found=0;for(let i=0;i<heads.length;i++){if(heads[i].getBoundingClientRect().top<=150)found=i;else break}current=found;
  document.querySelectorAll('.toc-row .toc-link').forEach((a,i)=>{if(i===current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
 }
 function save(){if(restoring)return;const el=heads[current];storage.set('blue-continuous-position',JSON.stringify({id:el.id,offset:scrollY-(el.getBoundingClientRect().top+scrollY),y:scrollY}))}
 function jump(id,focus=false){const el=$(id);if(!el)return;menu(false);el.scrollIntoView({block:'start'});if(focus&&el.matches('section,h3'))el.focus({preventScroll:true});progress()}
 document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.hash.slice(1);if(!$(id))return;e.preventDefault();history.pushState(null,'','#'+id);jump(id,true);save()});
 window.addEventListener('hashchange',()=>jump(location.hash.slice(1)));
 $('menu').onclick=()=>menu(!$('sidebar').classList.contains('open'));
 $('overlay').onclick=()=>{menu(false);$('menu').focus()};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu(false);$('menu').focus()}});
 $('theme').onclick=()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';storage.set('blue-theme',document.documentElement.dataset.theme);theme()};
 const options=[16,17,18,19,21,23,26], old=Number(storage.get('blue-font'))||19;
 $('font-select').value=String(options.reduce((a,b)=>Math.abs(b-old)<Math.abs(a-old)?b:a));
 function font(){document.documentElement.style.setProperty('--reading-size',$('font-select').value+'px');storage.set('blue-font',$('font-select').value);progress()}
 $('font-select').onchange=font;font();theme();
 function resume(){if(!saved||!$(saved.id))return;menu(false);const el=$(saved.id);scrollTo(0,Math.max(0,el.getBoundingClientRect().top+scrollY+(Number(saved.offset)||0)));progress()}
 if(saved&&$(saved.id)){$('resume').hidden=false;$('hero-resume').hidden=false;$('resume-title').textContent=sections.find(s=>s.id===saved.id)?.title||'จุดที่อ่านล่าสุด';$('resume').onclick=resume;$('hero-resume').onclick=resume}
 async function start(){if(document.fonts)await document.fonts.ready;if(location.hash)jump(location.hash.slice(1));else if(saved)resume();restoring=false;progress()}
 start();
 window.addEventListener('scroll',()=>{progress();clearTimeout(timer);timer=setTimeout(save,200)},{passive:true});
 window.addEventListener('resize',()=>{if(innerWidth>760)menu(false);progress()});
 window.addEventListener('pagehide',save);
})();
