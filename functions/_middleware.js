const ADMIN_REALM = 'MAC Cleaning Admin';
const ADMIN_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow'
};

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);

  if (!isAdminPath(url.pathname)) {
    return next();
  }

  const username = env.ADMIN_USERNAME;
  const password = env.ADMIN_PASSWORD;

  if (!username || !password) {
    return new Response('Admin authentication is not configured.', {
      status: 503,
      headers: ADMIN_HEADERS
    });
  }

  const credentials = parseBasicAuth(request.headers.get('Authorization'));
  const isAllowed = credentials
    && await safeEqual(credentials.username, username)
    && await safeEqual(credentials.password, password);

  if (!isAllowed) {
    return adminAuthChallenge();
  }

  const response = await next();
  return withAdminHeaders(response);
}

function isAdminPath(pathname) {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

function parseBasicAuth(headerValue) {
  if (!headerValue || !headerValue.startsWith('Basic ')) {
    return null;
  }

  try {
    const decoded = atob(headerValue.slice(6).trim());
    const separator = decoded.indexOf(':');
    if (separator < 0) return null;

    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1)
    };
  } catch {
    return null;
  }
}

async function safeEqual(actual, expected) {
  const [actualHash, expectedHash] = await Promise.all([
    sha256(actual || ''),
    sha256(expected || '')
  ]);

  if (actualHash.length !== expectedHash.length) return false;

  let mismatch = 0;
  for (let index = 0; index < actualHash.length; index += 1) {
    mismatch |= actualHash.charCodeAt(index) ^ expectedHash.charCodeAt(index);
  }

  return mismatch === 0;
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

function adminAuthChallenge() {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      ...ADMIN_HEADERS,
      'WWW-Authenticate': `Basic realm="${ADMIN_REALM}", charset="UTF-8"`
    }
  });
}

function withAdminHeaders(response) {
  const headers = new Headers(response.headers);
  Object.entries(ADMIN_HEADERS).forEach(([key, value]) => headers.set(key, value));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
