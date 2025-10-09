
;(function(){
  const state = { data: [], personas: new Set() }
  const el = {
    cards: document.getElementById('cards'),
    pResearcher: document.getElementById('filter-researcher'),
    pAdmin: document.getElementById('filter-admin'),
    pCoder: document.getElementById('filter-coder')
  }

  function chipActive(btn, active){
    if(!btn) return
    btn.style.background = active ? 'linear-gradient(135deg,#2563eb,#0ea5e9)' : '#fff'
    btn.style.color = active ? '#fff' : '#1a1a1a'
    btn.style.borderColor = active ? 'transparent' : '#e5e7eb'
  }

  function togglePersona(p){
    if(state.personas.has(p)) state.personas.delete(p); else state.personas.add(p)
    chipActive(el['p'+p], state.personas.has(p))
    render()
  }

  ;['Researcher','Admin','Coder'].forEach(p=>{
    const id = 'filter-'+p.toLowerCase()
    const btn = document.getElementById(id)
    if(btn) btn.addEventListener('click', ()=>togglePersona(p))
  })

  function cardHTML(t){
    const tags = (t.tags||[]).slice(0,3).map(x=>`<span class="tag">${x}</span>`).join('')
    const personas = (t.personas||[]).map(x=>`<span class="tag">${x}</span>`).join('')
    let desc = ''
    if(t.slug==='receipt-parser') desc='Upload receipt images and export structured CSV. Azure/Google Vision compatible.'
    else if(t.slug==='sentiment') desc='Group feedback into themes and visualize sentiment. Streamlit-ready.'
    else if(t.slug==='arvo-demos') desc='Three interactive demos from ARVO25 AI4Oph.'
    else if(t.slug==='grant-writing') desc='Draft sections and structure aims leveraging Apogee workflows.'
    else if(t.slug==='pubmed-search') desc='Query PubMed API, filter by author/year; export citations.'
    const repoBtn = t.repo ? `<a class="btn" href="${t.repo}" target="_blank" rel="noopener">Repo</a>` : ''
    const docBtn = t.doc_url && t.doc_url!==t.repo ? `<a class="btn" href="${t.doc_url}" target="_blank" rel="noopener">Docs</a>` : ''
    return `<article class="card">
      <span class="badge">${t.status==='online'?'Online':'Online check pending'}</span>
      <h3>${t.title}</h3>
      <p>${desc}</p>
      <div class="tags">${tags}${personas}</div>
      <div class="actions">
        <a class="btn primary" href="tutorials/${t.slug}/">Open</a>
        ${repoBtn}${docBtn}
      </div>
    </article>`
  }

  function render(){
    const items = !state.personas.size ? state.data :
      state.data.filter(t => (t.personas||[]).some(p=>state.personas.has(p)))
    el.cards.innerHTML = items.map(cardHTML).join('')
  }

  fetch('data/tutorials.json?cachebust='+Date.now())
    .then(r=>r.json())
    .then(data=>{ state.data = data; render() })
    .catch(err=>{
      console.error('Failed to load tutorials.json', err)
      el.cards.innerHTML = `<p style="color:#b91c1c">Failed to load tutorials. Try reloading.</p>`
    })
})();
