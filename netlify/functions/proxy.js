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
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Server missing OPENROUTER_API_KEY' }),
      };
    }

    // Validate and parse incoming body
    let incoming;
    try {
      incoming = JSON.parse(event.body || '{}');
    } catch (e) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid JSON body' }),
      };
    }
    if (!incoming || !Array.isArray(incoming.messages)) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Body must include messages: Message[]' }),
      };
    }

    // Call OpenRouter directly
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: incoming.model || 'gpt-3.5-turbo',
        messages: incoming.messages,
      }),
    });

    const contentType = upstream.headers.get('content-type') || '';
    const text = await upstream.text();

    if (contentType.includes('application/json')) {
      return {
        statusCode: upstream.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: text,
      };
    }

    // Non-JSON from upstream: wrap into JSON to keep client parsing safe
    return {
      statusCode: upstream.ok ? 200 : upstream.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Upstream returned non-JSON response',
        status: upstream.status,
        contentType,
        bodySnippet: text.slice(0, 512),
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


