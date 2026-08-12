
async function loadArticles(){
  const grid=document.getElementById('articleGrid');
  const filters=document.querySelectorAll('.filter');
  try{
    const res=await fetch('articles.json');
    const items=await res.json();
    const draw=(category='All')=>{
      grid.innerHTML='';
      items.filter(x=>category==='All'||x.category===category).forEach(x=>{
        const a=document.createElement('a');
        a.className='article-card';
        a.href=`articles/${x.slug}.html`;
        a.innerHTML=`<span class="num">${x.num} / ${x.category.toUpperCase()}</span><h3>${x.title}</h3><p>${x.description}</p><div class="meta"><span>${x.read} read</span><span>Read →</span></div>`;
        grid.appendChild(a);
      });
    };
    filters.forEach(btn=>btn.addEventListener('click',()=>{
      filters.forEach(x=>x.classList.remove('active'));
      btn.classList.add('active'); draw(btn.dataset.category);
    }));
    draw();
  }catch(e){
    grid.innerHTML='<p>Articles are temporarily unavailable.</p>';
  }
}
loadArticles();
