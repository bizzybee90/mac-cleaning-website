import assert from 'node:assert/strict';

import { onRequest } from '../functions/_middleware.js';

const env = {
  ADMIN_USERNAME: 'owner',
  ADMIN_PASSWORD: 'correct-horse-battery-staple'
};

function basicAuth(username, password) {
  return `Basic ${Buffer.from(`${username}:${password}`, 'utf8').toString('base64')}`;
}

async function runMiddleware(pathname, options = {}) {
  let nextCalled = false;
  const request = new Request(`https://maccleaning.uk${pathname}`, {
    headers: options.authorization ? { Authorization: options.authorization } : {}
  });

  const response = await onRequest({
    request,
    env: options.env || env,
    next: async () => {
      nextCalled = true;
      return new Response('admin ok', { status: 200 });
    }
  });

  return { response, nextCalled };
}

async function test(name, fn) {
  try {
    await fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

await test('passes non-admin routes through without credentials', async () => {
  const { response, nextCalled } = await runMiddleware('/');
  assert.equal(nextCalled, true);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'admin ok');
});

await test('blocks admin routes when no credentials are sent', async () => {
  const { response, nextCalled } = await runMiddleware('/admin/');
  assert.equal(nextCalled, false);
  assert.equal(response.status, 401);
  assert.match(response.headers.get('WWW-Authenticate') || '', /Basic/);
});

await test('blocks admin asset routes with the wrong credentials', async () => {
  const { response, nextCalled } = await runMiddleware('/admin/lib/chart.min.js', {
    authorization: basicAuth('owner', 'wrong-password')
  });
  assert.equal(nextCalled, false);
  assert.equal(response.status, 401);
});

await test('allows admin routes with the configured credentials', async () => {
  const { response, nextCalled } = await runMiddleware('/admin/', {
    authorization: basicAuth('owner', 'correct-horse-battery-staple')
  });
  assert.equal(nextCalled, true);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(await response.text(), 'admin ok');
});

await test('fails closed when admin secrets are missing', async () => {
  const { response, nextCalled } = await runMiddleware('/admin/', {
    env: {},
    authorization: basicAuth('owner', 'correct-horse-battery-staple')
  });
  assert.equal(nextCalled, false);
  assert.equal(response.status, 503);
});
