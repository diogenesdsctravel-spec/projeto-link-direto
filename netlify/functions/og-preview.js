/**
 * Netlify Function: Open Graph Preview
 * 
 * Gera meta tags dinâmicas para preview no WhatsApp
 * URL: /.netlify/functions/og-preview?id=q-1766800957628
 */

const SUPABASE_URL = "https://tlwfrmzrhldjbxetmdfb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsd2ZybXpyaGxkamJ4ZXRtZGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE1NjksImV4cCI6MjA4MTYzNzU2OX0.8_mEyugrdhudeZVle7-YZIaHUY74QaZe1cMlnBOt1Do";

async function fetchQuote(publicId) {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/quotes?public_id=eq.${publicId}&select=*`,
        {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
        }
    );
    const data = await response.json();
    return data[0] || null;
}

async function fetchDestination(destinationKey) {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/destinations?destination_key=eq.${destinationKey}&select=*`,
        {
            headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
        }
    );
    const data = await response.json();
    return data[0] || null;
}

exports.handler = async (event) => {
    const publicId = event.queryStringParameters?.id;

    if (!publicId) {
        return {
            statusCode: 400,
            body: "Missing quote ID",
        };
    }

    try {
        // Buscar quote
        const quote = await fetchQuote(publicId);

        if (!quote) {
            return {
                statusCode: 404,
                body: "Quote not found",
            };
        }

        // Buscar destino para pegar a imagem
        const destination = await fetchDestination(quote.destination_key);

        // Dados para o Open Graph
        const clientName = quote.client_name || "Cliente";
        const destinationName = destination?.destination_name || quote.destination_key || "Destino";
        const heroImage = destination?.hero_image_url || "https://dsc-travel.netlify.app/og-cover.jpg";
        const siteUrl = `https://dsc-travel.netlify.app/q/${publicId}`;

        // Título e descrição
        const title = `${clientName}, sua viagem para ${destinationName} está pronta!`;
        const description = `Confira o roteiro completo da sua viagem para ${destinationName}. DSC Travel - Experiências inesquecíveis.`;

        // HTML com meta tags e redirect
        const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>${title}</title>
  
  <!-- Open Graph (WhatsApp, Facebook, LinkedIn) -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="DSC Travel">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${heroImage}">
  <meta property="og:url" content="${siteUrl}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${heroImage}">
  
  <!-- Redirect para o app React -->
  <meta http-equiv="refresh" content="0;url=${siteUrl}">
  
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
    }
    .loading {
      text-align: center;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: #c9a227;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loading">
    <div class="spinner"></div>
    <p>Carregando sua viagem...</p>
  </div>
  <script>
    window.location.href = "${siteUrl}";
  </script>
</body>
</html>`;

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "public, max-age=3600",
            },
            body: html,
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: "Internal server error",
        };
    }
};