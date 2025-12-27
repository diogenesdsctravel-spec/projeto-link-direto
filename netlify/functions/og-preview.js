const SUPABASE_URL = "https://tlwfrmzrhldjbxetmdfb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsd2ZybXpyaGxkamJ4ZXRtZGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNjE1NjksImV4cCI6MjA4MTYzNzU2OX0.8_mEyugrdhudeZVle7-YZIaHUY74QaZe1cMlnBOt1Do";

async function fetchQuote(publicId) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/quotes?public_id=eq.${publicId}&select=*`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
  );
  const data = await response.json();
  return data[0] || null;
}

async function fetchDestination(destinationKey) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/destinations?destination_key=eq.${destinationKey}&select=*`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
  );
  const data = await response.json();
  return data[0] || null;
}

exports.handler = async (event) => {
  let publicId = event.queryStringParameters?.id;
  if (!publicId && event.path) {
    const match = event.path.match(/\/p\/(q-\d+)/);
    if (match) publicId = match[1];
  }
  if (!publicId) return { statusCode: 400, body: "Missing quote ID" };

  try {
    const quote = await fetchQuote(publicId);
    if (!quote) return { statusCode: 404, body: "Quote not found" };

    const destination = await fetchDestination(quote.destination_key);
    const clientName = quote.client_name || "Cliente";
    const destinationName = destination?.destination_name || quote.destination_key || "Destino";
    const heroImage = destination?.hero_image_url || "https://dsc-travel.netlify.app/og-cover.jpg";
    const previewUrl = `https://dsc-travel.netlify.app/p/${publicId}`;
    const appUrl = `https://dsc-travel.netlify.app/q/${publicId}`;
    const title = `${clientName}, sua viagem para ${destinationName} está pronta!`;
    const description = `Confira o roteiro completo da sua viagem para ${destinationName}. DSC Travel`;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="DSC Travel">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${heroImage}">
  <meta property="og:url" content="${previewUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${heroImage}">
</head>
<body>
  <p>Carregando...</p>
  <script>window.location.href="${appUrl}";</script>
</body>
</html>`;

    return { statusCode: 200, headers: { "Content-Type": "text/html; charset=utf-8" }, body: html };
  } catch (error) {
    return { statusCode: 500, body: "Error: " + error.message };
  }
};
