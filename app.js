// Shared functions for lookup/generation/rendering across pages
const STORAGE_KEY = 'ai_catalog_last_product'

function saveLastProduct(product){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(product)) }catch(e){}
}
function loadLastProduct(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) }catch(e){return null}
}

function initLookupPage(){
  const upcInput = document.getElementById('upcInput')
  const imageInput = document.getElementById('imageInput')
  const preview = document.getElementById('preview')
  const lookupBtn = document.getElementById('lookupBtn')
  const generateBtn = document.getElementById('generateBtn')
  const toneSelect = document.getElementById('toneSelect')

  if(!lookupBtn) return

  imageInput && imageInput.addEventListener('change', (e)=>{
    const f = e.target.files && e.target.files[0]
    if(!f) { if(preview) preview.src = ''; return }
    const url = URL.createObjectURL(f)
    if(preview) preview.src = url
  })

  lookupBtn.addEventListener('click', ()=>{
    const upc = upcInput ? upcInput.value.trim() : ''
    simulateLookup(upc, (product)=>{
      saveLastProduct(product)
      // redirect to results page to view
      window.location.href = 'results.html'
    })
  })

  generateBtn.addEventListener('click', ()=>{
    simulateLookup('', (product)=>{
      const tone = toneSelect ? toneSelect.value : 'Neutral'
      product.generatedDescription = generateDescription(product, tone)
      saveLastProduct(product)
      // show immediate feedback by opening results
      window.location.href = 'results.html'
    })
  })
}

function initResultsPage(){
  const results = document.getElementById('results')
  const product = loadLastProduct()
  if(!results) return
  if(!product){
    results.innerHTML = '<div class="card">No saved product yet. Visit Create to add one.</div>'
    return
  }
  renderResults([product], results, true)
}

function simulateLookup(upc, cb){
  // Mocked product database
  const sample = {
    upc: upc || '012345678905',
    title: 'Stellar Wireless Headphones',
    brand: 'SoundSmith',
    category: 'Electronics > Audio > Headphones',
    images: [
      'https://images.unsplash.com/photo-1518444025131-3a0c1b0d5f6a?w=800&q=60&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516728778615-2d590ea1856f?w=800&q=60&auto=format&fit=crop'
    ],
    specs: {
      battery: '30 hours',
      connectivity: 'Bluetooth 5.2',
      weight: '240g'
    }
  }
  // simulate network
  setTimeout(()=> cb && cb(sample), 600)
}

function generateDescription(product, tone){
  const tonePhrases = {
    'Neutral': 'High-quality, reliable product with excellent performance.',
    'Friendly': "Meet your new favorite headphones — comfy, clear, and built for long listening sessions.",
    'Technical': 'Advanced Bluetooth 5.2 connectivity, 30-hour battery life, engineered for low-latency audio.',
    'Luxury': 'Premium materials and exceptional soundstage, crafted for discerning listeners.'
  }
  const base = `${product.brand} ${product.title} — ${product.category}.`;
  const extras = `Features: ${Object.entries(product.specs).map(([k,v])=>`${k}: ${v}`).join(', ')}.`
  return `${base} ${tonePhrases[tone] || tonePhrases['Neutral']} ${extras} Ready for retail listings.`
}

function renderResults(items, containerEl, allowGenerate){
  const resultsEl = containerEl || document.getElementById('results')
  if(!resultsEl) return
  resultsEl.innerHTML = ''
  items.forEach(item=>{
    const card = document.createElement('div')
    card.className = 'card'
    card.innerHTML = `
      <img src="${item.images && item.images[0]}" alt="product" />
      <h4>${item.title}</h4>
      <div class="meta">${item.brand} • ${item.category}</div>
      <div class="meta">UPC: ${item.upc}</div>
      <div class="generated">${item.generatedDescription || '<em>No generated description yet — click Generate description.</em>'}</div>
      <div style="margin-top:10px;display:flex;gap:8px;">
        <button class="copy">Copy Description</button>
        ${allowGenerate ? '<button class="gen alt">Generate</button>' : ''}
      </div>
    `
    const copyBtn = card.querySelector('.copy')
    copyBtn && copyBtn.addEventListener('click', ()=>{
      navigator.clipboard && navigator.clipboard.writeText(item.generatedDescription || '')
      copyBtn.textContent = 'Copied!'
      setTimeout(()=>copyBtn.textContent = 'Copy Description',1200)
    })

    const genBtn = card.querySelector('.gen')
    genBtn && genBtn.addEventListener('click', ()=>{
      const tone = 'Neutral'
      item.generatedDescription = generateDescription(item, tone)
      saveLastProduct(item)
      renderResults([item], resultsEl, true)
    })

    resultsEl.appendChild(card)
  })
}

// Initialize depending on page
document.addEventListener('DOMContentLoaded', ()=>{
  initLookupPage()
  initResultsPage()
})
