import { NextRequest, NextResponse } from 'next/server'

/**
 * Product preview page for WhatsApp link previews.
 * Usage: GET /api/preview?img=IMAGE_URL&article=NAME&price=PRICE
 * WhatsApp fetches this URL and shows a rich card with the product image.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const img = searchParams.get('img') || ''
  const article = searchParams.get('article') || 'Bijou Marocain'
  const price = searchParams.get('price') || ''

  const title = `${article} — Elarain Jewelry`
  const description = price
    ? `Prix: ${price} DH • Bijoux Marocains authentiques`
    : 'Elarain Jewelry — Bijoux Marocains authentiques'

  // Escape for HTML attributes
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>

  <!-- Open Graph — WhatsApp reads these for link preview -->
  <meta property="og:type"        content="product" />
  <meta property="og:site_name"   content="Elarain Jewelry" />
  <meta property="og:title"       content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  ${img ? `<meta property="og:image"       content="${esc(img)}" />
  <meta property="og:image:width"  content="800" />
  <meta property="og:image:height" content="800" />` : ''}

  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 0 16px; color: #333; }
    img  { width: 100%; border-radius: 12px; margin: 16px 0; }
    h1   { font-size: 1.4rem; }
    .price { font-size: 1.2rem; font-weight: bold; color: #b8860b; }
    .brand { color: #888; font-size: 0.9rem; }
  </style>
</head>
<body>
  <p class="brand">✨ Elarain Jewelry</p>
  <h1>${esc(article)}</h1>
  ${img ? `<img src="${esc(img)}" alt="${esc(article)}" />` : ''}
  ${price ? `<p class="price">Prix : ${esc(price)} DH</p>` : ''}
  <p>${esc(description)}</p>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
