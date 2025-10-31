export async function handler(event) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const resp = await fetch('https://chatbot.wuaze.com/backend/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body,
    });

    const upstreamContentType = resp.headers.get('content-type') || '';
    const rawBody = await resp.text();

    // If upstream returns JSON, pass through. Otherwise, wrap as JSON error to avoid SyntaxError in client
    const isJson = upstreamContentType.includes('application/json');
    if (isJson) {
      return {
        statusCode: resp.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: rawBody,
      };
    }

    return {
      statusCode: resp.ok ? 200 : resp.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Upstream returned non-JSON response',
        status: resp.status,
        contentType: upstreamContentType,
        bodySnippet: rawBody.slice(0, 512),
      }),
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Upstream error', detail: String(e) }),
    };
  }
}


