;(function(){
  const state = { data: [], personas: new Set() }
  const cardsEl = document.getElementById('cards')

  function chipActive(btn, on){
    if(!btn) return
    btn.style.background = on ? 'linear-gradient(135deg,#2563eb,#0ea5e9)' : '#fff'
    btn.style.color = on ? '#fff' : '#1a1a1a'
    btn.style.borderColor = on ? 'transparent' : '#e5e7eb'
  }

  function togglePersona(p){
    if(state.personas.has(p)) state.personas.delete(p); else state.personas.add(p)
    chipActive(document.getElementById('filter-'+p.toLowerCase()), state.personas.has(p))
    render()
  }

  ;['Researcher','Admin','Coder'].forEach(p=>{
    const b = document.getElementById('filter-'+p.toLowerCase())
    if(b) b.addEventListener('click', ()=>togglePersona(p))
  })

  function cardHTML(t){
    const tags = (t.tags||[]).slice(0,3).map(x=>`<span class="tag">${x}</span>`).join('')
    const personas = (t.personas||[]).map(x=>`<span class="tag">${x}</span>`).join('')

    let desc = ''
    if(t.slug==='receipt-parser') desc='Upload receipt images and export structured CSV. Azure/Google Vision compatible.'
    else if(t.slug==='sentiment') desc='Group feedback into themes and visualize sentiment.'
    else if(t.slug==='arvo-demos') desc='Three interactive demos from ARVO25 AI4Oph.'
    else if(t.slug==='grant-writing') desc='Draft sections and structure aims leveraging Apogee workflows.'
    else if(t.slug==='pubmed-search') desc='Query PubMed API, filter by author/year; export citations.'

    const hasDemo = !!(t.demo_url && t.demo_url.trim())
    const launchHref = hasDemo ? t.demo_url : `tutorials/${t.slug}/`
    const launchTarget = hasDemo && /^https?:\/\//i.test(launchHref) ? '_blank' : '_self'

    if(t.slug==='arvo-ex1') desc='Extract table data from screenshots to CSV (prompting).';
    else if(t.slug==='arvo-ex2') desc='Colab/Jupyter: quick plots & regression on GRAPE.';
    else if(t.slug==='arvo-ex3') desc='NotebookLM: summarize & compare ophthalmology papers.';


    return `<article class="card">
      <span class="badge">${t.status==='online'?'Online':'Online check pending'}</span>
      <h3>${t.title}</h3>
      <p>${desc}</p>
      <div class="tags">${tags}${personas}</div>
      <div class="actions">
        <a class="btn primary" href="${launchHref}" target="${launchTarget}" rel="noopener">Launch</a>
        <a class="btn" href="tutorials/${t.slug}/">Details</a>
        ${t.repo ? `<a class="btn" href="${t.repo}" target="_blank" rel="noopener">Repo</a>` : ''}
        ${t.doc_url && t.doc_url!==t.repo ? `<a class="btn" href="${t.doc_url}" target="_blank" rel="noopener">Docs</a>` : ''}
      </div>
    </article>`
  }

  function render(){
    const items = !state.personas.size ? state.data :
      state.data.filter(t => (t.personas||[]).some(p=>state.personas.has(p)))
    cardsEl.innerHTML = items.map(cardHTML).join('')
  }

  fetch('data/tutorials.json?cachebust='+Date.now())
    .then(r=>r.json())
    .then(data=>{ state.data = data; render() })
    .catch(err=>{
      console.error('Failed to load tutorials.json', err)
      cardsEl.innerHTML = `<p style="color:#b91c1c">Failed to load tutorials. Check data/tutorials.json path & syntax.</p>`
    })
})();
