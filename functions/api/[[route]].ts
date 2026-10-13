/**
 * Cloudflare Pages Functions: Fullstack API Gateway
 * Supports D1 Database, R2 Object Storage, Cloudflare Zero Trust Auth, and Gemini API Proxy
 */

interface Env {
  DB?: any;              // Cloudflare D1 Database binding
  STORAGE?: any;         // Cloudflare R2 Bucket binding
  GEMINI_API_KEY?: string;
  APP_PASSCODE?: string;
}

type PagesFunction<T = any> = (context: { request: Request; env: T }) => Promise<Response> | Response;

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 1. Cloudflare Zero Trust / Passcode Auth Check
  const cfUserEmail = request.headers.get('Cf-Access-Authenticated-User-Email');
  const clientPasscode = request.headers.get('x-app-passcode');
  const serverPasscode = env.APP_PASSCODE || 'fashion2025';

  // Health check endpoint
  if (path === '/api/health') {
    return new Response(JSON.stringify({
      status: 'ok',
      service: 'Fashion Dresses AI Studio API',
      cloudflareZeroTrust: !!cfUserEmail,
      hasDatabase: !!env.DB,
      hasStorage: !!env.STORAGE
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Auth verify endpoint
  if (path === '/api/auth/verify' && request.method === 'POST') {
    let isValid = false;
    let userEmail = cfUserEmail || 'guest@fashionstudio.internal';

    try {
      const body: any = await request.json();
      if (body.passcode === serverPasscode || cfUserEmail) {
        isValid = true;
      }
    } catch {
      if (cfUserEmail) isValid = true;
    }

    return new Response(JSON.stringify({
      authenticated: isValid,
      email: userEmail,
      authType: cfUserEmail ? 'cloudflare_zero_trust' : 'passcode'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Gemini API Proxy (Runs securely on Cloudflare Edge with server-side API Key)
  if (path === '/api/gemini/analyze' && request.method === 'POST') {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'GEMINI_API_KEY is not configured in Cloudflare environment variables.'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    try {
      const body: any = await request.json();
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const geminiData = await geminiRes.text();
      return new Response(geminiData, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Default response for unmatched API routes
  return new Response(JSON.stringify({ error: 'Endpoint not found', path }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
};
