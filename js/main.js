/* ──────────────────────────────────────────
   STRIPE CONFIGURATION
   ──────────────────────────────────────────
   HOW TO SET UP:
   1. Log in to your Stripe Dashboard → https://dashboard.stripe.com
   2. Go to Developers → API Keys
   3. Copy your Publishable key (starts with pk_live_ or pk_test_)
   4. Paste it below as STRIPE_PK
   5. Set up your n8n workflow with Stripe nodes (see setup guide)
   6. Paste the n8n webhook URL as STRIPE_SETUP_ENDPOINT

   The frontend uses Stripe Elements for secure card input.
   The n8n endpoint creates a Stripe Customer + SetupIntent
   and returns { clientSecret, customerId }.

   When STRIPE_PK is empty, customers see a fallback message.
   When populated, they get the real Stripe card form.
   ────────────────────────────────────────── */
const STRIPE_PK = 'pk_live_F9lKTLJaVfsKk8ePmjxR2JsN';
const STRIPE_SETUP_ENDPOINT = 'https://bizzybee.app.n8n.cloud/webhook/mac-stripe-setup';

/* ──────────────────────────────────────────
   GOCARDLESS CONFIGURATION
   ──────────────────────────────────────────
   For Direct Debit payments as an alternative to card.
   Set up a GoCardless account and create an n8n workflow
   that creates a billing request and returns the redirect URL.

   When empty, only card payment is shown.
   When populated, customers can choose Card or Direct Debit.
   ────────────────────────────────────────── */
const GOCARDLESS_SETUP_ENDPOINT = 'https://bizzybee.app.n8n.cloud/webhook/mac-gocardless-setup';

/* ──────────────────────────────────────────
   GOOGLE PLACES CONFIGURATION
   ──────────────────────────────────────────
   HOW TO SET UP:
   1. Go to Google Cloud Console → https://console.cloud.google.com
   2. Create a project (or select existing)
   3. Enable "Places API" and "Maps JavaScript API"
   4. Go to Credentials → Create API Key
   5. Restrict the key to your domain and the APIs above
   6. Paste the key below

   When this is empty, the address field works as a plain text input.
   When populated, it becomes a Google-powered address search.
   ────────────────────────────────────────── */
const GOOGLE_PLACES_KEY = 'AIzaSyAApbgPqrc-IXXu2mcKrM2fAcdS7mUUGpk';

/* ──────────────────────────────────────────
   N8N WEBHOOK CONFIGURATION
   ──────────────────────────────────────────
   HOW TO SET UP:
   1. Create a workflow in n8n with a Webhook trigger node
   2. Set the HTTP Method to POST
   3. Copy the Production webhook URL
   4. Paste it below

   When this is empty, form submissions are logged to console only.
   When populated, leads are POSTed to your n8n workflow.
   ────────────────────────────────────────── */
const N8N_WEBHOOK = 'https://bizzybee.app.n8n.cloud/webhook/mac-cleaning-lead';

/* ──────────────────────────────────────────
   LEAD PIPELINE CONFIGURATION
   ──────────────────────────────────────────
   Separate endpoints for partial (soft gate) and
   full (quote accepted) lead capture.
   When empty, falls back to N8N_WEBHOOK above.
   ────────────────────────────────────────── */
const LEAD_PARTIAL_URL = ''; // e.g. 'https://bizzybee.app.n8n.cloud/webhook/mac-lead-partial'
const LEAD_COMPLETE_URL = ''; // e.g. 'https://bizzybee.app.n8n.cloud/webhook/mac-lead-complete'

/* ──────────────────────────────────────────
   SUPABASE CONFIGURATION
   ──────────────────────────────────────────
   Used for photo uploads and future direct access.
   All lead writes go through n8n (service_role key).
   ────────────────────────────────────────── */
const SUPABASE_URL = 'https://atukvssploxwyqpwjmrc.supabase.co';
const SUPABASE_ANON_KEY = ''; // Not used for writes — n8n handles DB via service_role

/* ──────────────────────────────────────────
   GOOGLE ANALYTICS CONFIGURATION
   ──────────────────────────────────────────
   Paste your GA4 Measurement ID below (format: G-XXXXXXXXXX)
   ────────────────────────────────────────── */
const GA_ID = 'G-FN4DKHCLME';

/* ──────────────────────────────────────────
   DATA
   ────────────────────────────────────────── */
const PRICING = {
  "4-weekly": {
    house:     { semi: {"1":19,"2":19,"3":19,"4":25,"5+":30}, detached: {"1":22,"2":22,"3":22,"4":30,"5+":35} },
    flat:      { semi: {"1":19,"2":19} },
    bungalow:  { semi: {"1":19,"2":19,"3":19,"4":25}, detached: {"1":22,"2":22,"3":22,"4":30,"5+":35} },
    townhouse: { semi: {"1":19,"2":19,"3":19,"4":25} },
    commercial: { semi:[] },
  terraced:  { semi: {"1":19,"2":19,"3":19,"4":25} }
  },
  "8-weekly": {
    house:     { semi: {"1":24,"2":24,"3":24,"4":30,"5+":35}, detached: {"1":28,"2":28,"3":28,"4":35,"5+":42} },
    flat:      { semi: {"1":24,"2":24} },
    bungalow:  { semi: {"1":24,"2":24,"3":24,"4":30}, detached: {"1":28,"2":28,"3":28,"4":35,"5+":42} },
    townhouse: { semi: {"1":24,"2":24,"3":24,"4":30} },
    commercial: { semi:[] },
  terraced:  { semi: {"1":24,"2":24,"3":24,"4":30} }
  }
};

const UPLIFTS = { conservatory:9, extension:7, porch:3, garage:5, skylights:2 };

const PROPERTY_TYPES = [
  {id:"house",label:"House",note:""},
  {id:"flat",label:"Flat",note:""},
  {id:"bungalow",label:"Bungalow",note:""},
  {id:"townhouse",label:"Townhouse",note:""},
  {id:"terraced",label:"Terraced",note:""},
  {id:"commercial",label:"Commercial",note:"Custom quote"}
];

const BUILD_TYPES = [{id:"semi",label:"Semi-detached"},{id:"detached",label:"Detached"}];

const EXTRAS = [
  {id:"conservatory",label:"Conservatory windows",note:"Windows only, not roof"},
  {id:"extension",label:"Extension",note:""},
  {id:"porch",label:"Porch",note:""},
  {id:"garage",label:"Garage door",note:"+£5/clean"},
  {id:"skylights",label:"Skylights",note:"+£2 each"}
];

const BEDS_MAP = {
  house:     { semi:["1","2","3","4","5+"], detached:["1","2","3","4","5+"] },
  flat:      { semi:["1","2"] },
  bungalow:  { semi:["1","2","3","4"], detached:["1","2","3","4","5+"] },
  townhouse: { semi:["1","2","3","4"] },
  commercial: { semi:[] },
  terraced:  { semi:["1","2","3","4"] }
};

const STANDALONE = {
  gutter: {
    label:"Gutter Clearing", desc:"Internal gutter clearing with downpipe check.",
    plans:[{id:"single",label:"One-off"},{id:"annual",label:"Annual"}],
    prices:{bungalow:80,flat:80,"semi_1-2":95,semi_3:105,semi_4:115,detached_3:125,detached_4:140,"detached_5+":160}
  },
  fascia: {
    label:"Fascia & Soffit Cleaning", desc:"External uPVC fascia, soffit and gutter wash.",
    plans:[{id:"single",label:"One-off"},{id:"annual",label:"Annual"}],
    prices:{bungalow:80,flat:80,"semi_1-2":95,semi_3:110,semi_4:120,detached_3:130,detached_4:150,"detached_5+":170}
  },
  conservatory_roof: {
    label:"Conservatory Roof Clean", desc:"Standalone conservatory roof clean with schedule discounts.",
    plans:[{id:"single",label:"One-off"},{id:"annual",label:"Annual"},{id:"six_monthly",label:"Every 6 months"},{id:"quarterly",label:"Quarterly"}],
    prices:{"1":70,"2":70,"3":90,"4":110,"5+":130}
  }
};

const HIW_STEPS = [
  { num:"01", nav:"Your Price", title:"Get Your Price",
    summary:"Tell us your property type and postcode. You'll see your exact price instantly — both 4-weekly and 8-weekly, side by side.",
    detail:"The whole thing takes about 30 seconds. No sign-up required to see your price.",
    visual:'pills' },
  { num:"02", nav:"Your Schedule", title:"Choose Your Schedule",
    summary:"Pick the frequency that suits you, confirm your details, and add any extras like gutters or fascias. That's it — you're booked.",
    detail:"Once you've chosen, we'll send you a confirmation with your first clean date and a secure link to register your card.",
    visual:'schedule' },
  { num:"03", nav:"The Easy Part", title:"We Handle the Rest",
    summary:"You'll get a text the night before each clean. We turn up, we clean, your card is charged automatically. Simple, every time.",
    detail:"Most new customers are on the round within a week.",
    visual:'gate' }
];

/* ──────────────────────────────────────────
   STATE
   ────────────────────────────────────────── */
const Q = {
  mode:'', step:1, property:'', build:'', beds:'',
  extras:{conservatory:false,extension:false,porch:false,garage:false,skylights:false},
  skylightCount:1, commercialType:'', commercialDesc:'', postcode:'', email:'', leadCaptured:false,
  name:'', phone:'', address:'', frequency:'4-weekly',
  addons:{ gutter:{selected:false,plan:'single'}, fascia:{selected:false,plan:'single'}, conservatory_roof:{selected:false,plan:'single'} },
  oneoffServices:{ gutter:false, fascia:false, conservatory_roof:false },
  termsAccepted:false, submitted:false, cardRegistered:false, feedback:null
};

let activeHiw = 0;

/* Mobile-only: simpler 4-step version with reveal animation */
const HIW_STEPS_MOBILE = [
  { num:"01", title:"Instant online quote",
    summary:"Using our instant quote tool, you'll receive the cost for your clean online immediately. 4-weekly or 8-weekly, the price is the same." },
  { num:"02", title:"Sign up online",
    summary:"Easily register your payment details online to complete your signup. No payments are taken until we clean your property." },
  { num:"03", title:"Confirmation",
    summary:"Once you've signed up, within 24 hours, we'll email over the details of what you've signed up to, including when your first clean will be." },
  { num:"04", title:"Cleaning day",
    summary:"We send a reminder the night before your scheduled clean, then on the day of the clean we arrive to dirty windows, and leave with them looking immaculate." }
];

const HIW_VISUALS = {
  pills: `<div class="hiw-visual"><div class="hiw-pills"><div class="hiw-pill">House</div><div class="hiw-pill">Semi-detached</div><div class="hiw-pill">3 bedrooms</div></div><div class="hiw-split"><div class="hiw-vcard"><div class="hiw-vlabel">Extra</div><div class="hiw-vval">+£9</div><div class="hiw-vdesc">Conservatory</div></div><div class="hiw-vcard"><div class="hiw-vlabel">Extra</div><div class="hiw-vval">+£4</div><div class="hiw-vdesc">2 skylights</div></div></div></div>`,
  gate: `<div class="hiw-visual"><div class="hiw-split"><div class="hiw-vcard"><div class="hiw-vlabel">Check coverage</div><div class="hiw-vval" style="font-size:1.3rem">LU3 2AB</div></div><div class="hiw-vcard"><div class="hiw-vlabel">Send your quote</div><div class="hiw-vval" style="font-size:1.1rem">hello@email.com</div></div></div><div class="hiw-split" style="margin-top:0.6rem"><div class="hiw-vcard featured"><div class="hiw-vlabel">Every 4 weeks</div><div class="hiw-vval">£19</div><div class="hiw-vdesc">Best value</div></div><div class="hiw-vcard"><div class="hiw-vlabel">Every 8 weeks</div><div class="hiw-vval">£24</div><div class="hiw-vdesc">Same full service</div></div></div></div>`,
  schedule: `<div class="hiw-visual"><div class="hiw-split"><div class="hiw-vcard"><div class="hiw-vlabel">Customer</div><div class="hiw-vval" style="font-size:1.3rem">Michael C</div><div class="hiw-vdesc">Booked and confirmed</div></div><div class="hiw-vcard featured"><div class="hiw-vlabel">Schedule</div><div class="hiw-vval">4-weekly</div><div class="hiw-vdesc">£19/clean</div></div></div><div class="hiw-pills" style="margin-top:0.8rem"><div class="hiw-pill">Night-before reminders</div><div class="hiw-pill">Secure card link by email</div></div></div>`,
  addons: `<div class="hiw-visual"><div class="hiw-split"><div class="hiw-vcard"><div class="hiw-vlabel">Add-on</div><div class="hiw-vval">£105</div><div class="hiw-vdesc">Gutter clearing</div></div><div class="hiw-vcard featured"><div class="hiw-vlabel">Bundle 3</div><div class="hiw-vval">20% off</div><div class="hiw-vdesc">All add-ons together</div></div></div><div class="hiw-pills" style="margin-top:0.8rem"><div class="hiw-pill">First clean within 24hrs</div><div class="hiw-pill">Secure Stripe link</div><div class="hiw-pill">No payment until after clean</div></div></div>`
};

/* ──────────────────────────────────────────
   INIT
   ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveals();
  initFaq();
  initCounters();
  initHiw();
  initDiffStrip();
  initReviewCards();
  initFooterAccordion();
  initFaqShowAll();
  initServicesAutoScroll();
  loadGooglePlaces();
  loadStripe();
  loadGA();
  handleStripeReturn();
  /* Auto-init quote mode from data attributes (for embedded service pages) */
  const _autoWidget = document.getElementById('quoteWidget');
  if (_autoWidget && _autoWidget.dataset.quoteMode) {
    Q.mode = _autoWidget.dataset.quoteMode;
    Q.step = 1;
    if (_autoWidget.dataset.quoteService) {
      _autoWidget.dataset.quoteService.split(',').forEach(s => {
        if (Q.oneoffServices.hasOwnProperty(s)) Q.oneoffServices[s] = true;
      });
    }
    Q._embedded = true;
  }
  renderQuote();
  initQuoteDeepLinks();
  initQuoteModal();
});

/* ── CTA DEEP LINKS ──────────────────────
   All #quote links skip the service chooser and go
   straight into the window cleaning quote (step 1).
   ────────────────────────────────────────── */
function initQuoteDeepLinks() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href="#quote"]');
    if (!link) return;
    /* Don't interfere if the user has already started a quote or submitted */
    if (Q.submitted) return;
    /* Auto-select regular window cleaning and go to step 1 */
    if (!Q.mode) {
      Q.mode = 'regular';
      Q.step = 1;
      Q.feedback = null;
      renderQuote();
    }
    /* Scroll to the quote widget smoothly */
    e.preventDefault();
    const target = document.getElementById('quoteWidget');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/* ─── QUOTE MODAL (MOBILE FULL-SCREEN SHEET) ────────── */
function initQuoteModal() {
  const modal = document.getElementById('quoteModal');
  if (!modal) return;
  const closeBtn = document.getElementById('quoteModalClose');
  const modalBody = modal.querySelector('.quote-modal-body');
  const widget = document.getElementById('quoteWidget');
  const widgetParent = widget ? widget.parentElement : null;
  const mq = window.matchMedia('(max-width: 768px)');
  let movedToModal = false;

  function moveToModal() {
    if (!widget || movedToModal) return;
    modalBody.appendChild(widget);
    movedToModal = true;
  }

  function moveBack() {
    if (!widget || !movedToModal || !widgetParent) return;
    widgetParent.appendChild(widget);
    movedToModal = false;
  }

  function openModal() {
    if (!mq.matches) return;
    moveToModal();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Always show service selector first — never skip to regular mode
    if (!Q.mode) {
      renderQuote(); // Shows entry screen with service type selector
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Close button
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Intercept #quote links on mobile to open modal instead of scrolling
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href="#quote"], a[href="/#quote"]');
    if (!link || !mq.matches) return;
    e.preventDefault();
    e.stopPropagation();
    openModal();
  }, true); // capture phase to beat initQuoteDeepLinks

  // On resize back to desktop, move widget back and close modal
  mq.addEventListener('change', (e) => {
    if (!e.matches) {
      closeModal();
      moveBack();
    }
  });
}

/* ─── GOOGLE PLACES AUTOCOMPLETE ────────── */
let _placesReady = false;
function loadGooglePlaces() {
  if (!GOOGLE_PLACES_KEY) return;
  const s = document.createElement('script');
  s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_KEY}&libraries=places&callback=_onPlacesReady`;
  s.async = true; s.defer = true;
  document.head.appendChild(s);
}
window._onPlacesReady = function() { _placesReady = true; attachAddressAutocomplete(); };

function attachAddressAutocomplete() {
  if (!_placesReady) return;
  const el = document.querySelector('[data-field="address"]');
  if (!el || el._gac) return; // already attached
  const ac = new google.maps.places.Autocomplete(el, {
    types: ['address'],
    componentRestrictions: { country: 'gb' },
    fields: ['formatted_address', 'address_components']
  });
  el._gac = ac;
  ac.addListener('place_changed', () => {
    const place = ac.getPlace();
    if (!place || !place.address_components) return;
    /* Build a clean address string (without postcode — we already have that) */
    let street = '', city = '';
    place.address_components.forEach(c => {
      if (c.types.includes('street_number')) street = c.long_name + ' ';
      if (c.types.includes('route')) street += c.long_name;
      if (c.types.includes('postal_town') || c.types.includes('locality')) city = c.long_name;
      if (c.types.includes('postal_code')) Q.postcode = c.long_name;
    });
    Q.address = (street + (city ? ', ' + city : '')).trim();
    el.value = Q.address;
    /* Trigger re-render to update postcode if changed */
    renderQuote();
  });
}

/* ─── STRIPE ELEMENTS ───────────────────── */
let _stripe = null;
let _stripeElements = null;
let _stripePaymentElement = null;
let _stripeReady = false;

function loadStripe() {
  if (!STRIPE_PK) return;
  if (window.Stripe) { _stripeReady = true; return; }
  const s = document.createElement('script');
  s.src = 'https://js.stripe.com/v3/';
  s.async = true;
  s.onload = () => { _stripeReady = true; };
  document.head.appendChild(s);
}

/**
 * Create a Stripe SetupIntent via the n8n endpoint.
 * Returns { clientSecret, customerId } or null on failure.
 */
async function createStripeSetup() {
  if (!STRIPE_SETUP_ENDPOINT) return null;
  try {
    const res = await fetch(STRIPE_SETUP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: Q.name,
        email: Q.email,
        phone: Q.phone,
        address: Q.address,
        postcode: Q.postcode
      })
    });
    if (!res.ok) throw new Error('Setup endpoint returned ' + res.status);
    return await res.json();
  } catch (err) {
    console.error('[MAC] Stripe setup failed:', err);
    return null;
  }
}

/**
 * Mount Stripe Payment Element into the #stripe-element container.
 * Called after the confirmation screen renders.
 */
async function mountStripeElement() {
  if (!_stripeReady || !STRIPE_PK || !STRIPE_SETUP_ENDPOINT) return;
  const container = document.getElementById('stripe-element');
  if (!container) return;
  // Show loading state
  container.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--ink-faint)"><span class="btn-spinner" style="display:inline-block;vertical-align:middle;margin-right:0.5rem"></span>Loading secure payment form…</div>';

  const setup = await createStripeSetup();
  if (!setup || !setup.clientSecret) {
    container.innerHTML = '<p style="text-align:center;color:var(--ink-faint);font-size:0.88rem;padding:1rem">Unable to load payment form. We\'ll email you a secure link instead.</p>';
    return;
  }

  Q._stripeCustomerId = setup.customerId;
  _stripe = window.Stripe(STRIPE_PK);
  _stripeElements = _stripe.elements({
    clientSecret: setup.clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#b8860b',
        colorBackground: '#fafaf7',
        colorText: '#1c2434',
        colorDanger: '#c0392b',
        fontFamily: '"DM Sans", system-ui, sans-serif',
        borderRadius: '10px',
        spacingUnit: '4px'
      },
      rules: {
        '.Input': { border: '1.5px solid #d9d5cc', padding: '12px 14px' },
        '.Input:focus': { borderColor: '#b8860b', boxShadow: '0 0 0 2px rgba(184,134,11,0.15)' }
      }
    }
  });

  _stripePaymentElement = _stripeElements.create('payment', {
    layout: 'tabs',
    defaultValues: {
      billingDetails: {
        name: Q.name,
        email: Q.email,
        phone: Q.phone,
        address: { line1: Q.address, postal_code: Q.postcode, country: 'GB' }
      }
    }
  });

  container.innerHTML = '';
  _stripePaymentElement.mount(container);
}

/**
 * Confirm the Stripe SetupIntent (save card).
 * Returns { success: true } or { success: false, error: string }.
 */
async function confirmStripeSetup() {
  if (!_stripe || !_stripeElements) return { success: false, error: 'Stripe not ready.' };
  /* Save quote state before potential 3D Secure redirect */
  try { sessionStorage.setItem('mac_quote', JSON.stringify(Q)); } catch(e) {}
  const { error } = await _stripe.confirmSetup({
    elements: _stripeElements,
    confirmParams: {
      return_url: window.location.origin + '/?setup=complete',
    },
    redirect: 'if_required'
  });
  if (error) {
    console.error('[MAC] Stripe confirm error:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

/**
 * Handle return from 3D Secure / SCA redirect.
 * Stripe appends ?setup_intent=...&setup_intent_client_secret=...&redirect_status=succeeded
 */
function handleStripeReturn() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('setup_intent') && !params.has('setup')) return false;
  /* Restore quote state from sessionStorage */
  try {
    const saved = sessionStorage.getItem('mac_quote');
    if (saved) {
      const restored = JSON.parse(saved);
      Object.assign(Q, restored);
      sessionStorage.removeItem('mac_quote');
    }
  } catch(e) {}
  const status = params.get('redirect_status');
  if (status === 'succeeded' || params.get('setup') === 'complete') {
    Q.submitted = true;
    Q.cardRegistered = true;
    Q.paymentMethod = 'card';
  }
  /* Clean up URL without reload */
  window.history.replaceState({}, '', window.location.pathname);
  return true;
}

/* ─── GOCARDLESS DIRECT DEBIT ────────────── */

/**
 * Create a GoCardless billing request via n8n endpoint.
 * Returns { redirectUrl } or null on failure.
 */
async function createGoCardlessSetup() {
  if (!GOCARDLESS_SETUP_ENDPOINT) return null;
  try {
    const res = await fetch(GOCARDLESS_SETUP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: Q.name,
        email: Q.email,
        phone: Q.phone,
        address: Q.address,
        postcode: Q.postcode
      })
    });
    if (!res.ok) throw new Error('GoCardless endpoint returned ' + res.status);
    return await res.json();
  } catch (err) {
    console.error('[MAC] GoCardless setup failed:', err);
    return null;
  }
}

/* ─── LEAD SUBMISSION ────────────────────── */
/* ─── SOURCE TRACKING ──────────────────── */
function getSourceData() {
  const params = new URLSearchParams(window.location.search);
  return {
    source_page: window.location.pathname,
    referrer: document.referrer || null,
    utm_source: params.get('utm_source') || null,
    utm_medium: params.get('utm_medium') || null,
    utm_campaign: params.get('utm_campaign') || null
  };
}

/* ─── PARTIAL LEAD CAPTURE (soft gate) ── */
/* ─── PARTIAL LEAD CAPTURE ─────────────── */
function capturePartialLead() {
  const payload = {
    status: 'partial',
    timestamp: new Date().toISOString(),
    email: Q.email,
    postcode: Q.postcode,
    property_type: Q.property,
    build_type: getBuild(),
    bedrooms: Q.beds,
    extras: Q.extras || {},
    ...getSourceData()
  };
  console.log('[MAC] Partial lead captured');
  if (typeof gtag === 'function') {
    gtag('event', 'soft_gate_passed', { property: Q.property });
  }
  /* Send to n8n — n8n writes to Supabase via service_role */
  const url = LEAD_PARTIAL_URL || N8N_WEBHOOK;
  if (!url) { console.warn('[MAC] No webhook configured for partial lead.'); return; }
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(r => {
    if (!r.ok) console.error('[MAC] Partial lead webhook error:', r.status);
    else console.log('[MAC] Partial lead sent to n8n');
  }).catch(err => console.error('[MAC] Partial lead webhook failed:', err));
}

/* ─── FULL LEAD PAYLOAD ─────────────────── */
function buildLeadPayload() {
  const isRegular = Q.mode === 'regular';
  const payload = {
    status: 'quoted',
    timestamp: new Date().toISOString(),
    type: isRegular ? 'regular' : 'oneoff',
    /* Customer */
    name: Q.name,
    email: Q.email,
    phone: Q.phone,
    address: Q.address,
    postcode: Q.postcode,
    /* Property */
    property_type: Q.property,
    build_type: getBuild(),
    bedrooms: Q.beds,
    /* Source tracking */
    ...getSourceData()
  };
  if (isRegular) {
    payload.frequency = Q.frequency;
    payload.price_per_clean = getPrice(Q.frequency);
    /* Extras */
    payload.extras_detail = Q.extras;
    const extras = Object.entries(Q.extras).filter(([,v])=>v).map(([k])=>k==='skylights'?Q.skylightCount+' skylight'+(Q.skylightCount>1?'s':''):k);
    if (extras.length) payload.extras = extras.join(', ');
    /* Add-ons */
    const disc = getBundleDiscount();
    const addonData = {};
    const addonLabels = [];
    Object.entries(Q.addons).filter(([,a])=>a.selected).forEach(([k,a])=>{
      const price = Math.round(getStandalonePrice(k) * (1 - disc));
      addonData[k] = { selected: true, plan: a.plan, price };
      addonLabels.push(STANDALONE[k].label + ' (£' + price + ')');
    });
    if (addonLabels.length) {
      payload.addons = addonData;
      payload.addons_display = addonLabels.join(', ');
      payload.addons_total = getAddonTotal();
    }
    payload.total = payload.price_per_clean + (payload.addons_total || 0);
    /* Legacy field names for existing n8n workflow */
    payload.property = Q.property;
    payload.build = getBuild();
    payload.beds = Q.beds;
    payload.pricePerClean = payload.price_per_clean;
  } else {
    const services = Object.entries(Q.oneoffServices).filter(([,v])=>v).map(([k])=>STANDALONE[k].label+' (£'+getStandalonePrice(k)+')');
    payload.services = services.join(', ');
    payload.total = getOneoffTotal();
    payload.property = Q.property;
    payload.build = getBuild();
    payload.beds = Q.beds;
  }
  return payload;
}

function submitLead() {
  const payload = buildLeadPayload();
  console.log('[MAC] Lead captured');
  /* Track in GA if available */
  if (typeof gtag === 'function') {
    gtag('event', 'quote_accepted', {
      value: payload.total,
      currency: 'GBP',
      quote_type: payload.type
    });
  }
  /* Send to n8n — n8n writes to Supabase via service_role */
  const url = LEAD_COMPLETE_URL || N8N_WEBHOOK;
  if (!url) return;
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(r => {
    if (!r.ok) console.error('[MAC] Webhook error:', r.status);
    else console.log('[MAC] Lead sent to n8n');
  }).catch(err => console.error('[MAC] Webhook failed:', err));
}

/* ─── GOOGLE ANALYTICS ──────────────────── */
function loadGA() {
  if (!GA_ID) return;
  const s = document.createElement('script');
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  s.async = true;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID);
}

/* ──────────────────────────────────────────
   NAV
   ────────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = scrollY;
    const down = y > lastY;
    nav.classList.toggle('scrolled', y > 80);
    if (y > 200 && down) nav.classList.add('hidden');
    else nav.classList.remove('hidden');
    lastY = y;
  }, {passive:true});
  if (toggle && menu) {
    toggle.addEventListener('click', () => { toggle.classList.toggle('open'); menu.classList.toggle('open'); });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { toggle.classList.remove('open'); menu.classList.remove('open'); }));
  }
}

function initReveals() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e,i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, {threshold:0.08, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ──────────────────────────────────────────
   FAQ
   ────────────────────────────────────────── */
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ──────────────────────────────────────────
   TRUST COUNTERS
   ────────────────────────────────────────── */
function initCounters() {
  const strip = document.getElementById('trust');
  if (!strip) return;
  const isMobile = window.innerWidth <= 768;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      strip.querySelectorAll('[data-count]').forEach(el => {
        const target = parseFloat(el.dataset.count);
        const dec = el.hasAttribute('data-decimal');
        /* On mobile, show final value immediately — no animation to prevent "0.2" flash */
        if (isMobile) {
          el.textContent = dec ? target.toFixed(1) : target.toLocaleString('en-GB');
          return;
        }
        const dur = 2000;
        const start = performance.now();
        (function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = dec ? (target * ease).toFixed(1) : Math.round(target * ease).toLocaleString('en-GB');
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = dec ? target.toFixed(1) : target.toLocaleString('en-GB');
        })(start);
      });
      obs.disconnect();
    }
  }, {threshold:0.5});
  obs.observe(strip);
}

/* ──────────────────────────────────────────
   STICKY CTA BAR
   ────────────────────────────────────────── */
/* Sticky bar removed — nav CTA always visible */

/* ──────────────────────────────────────────
   DIFF CAROUSEL — proper sliding
   ────────────────────────────────────────── */
function initDiffStrip() {
  const track = document.getElementById('diffTrack');
  const pipsEl = document.getElementById('diffPips');
  if (!track || !pipsEl) return;
  const cards = track.querySelectorAll('.diff-card');
  const total = cards.length;

  /* Mobile: use native scrollLeft auto-scroll (CSS scroll-snap handles snapping) */
  if (window.innerWidth < 768) {
    let mIdx = 0;
    const visibleCards = [...cards].filter(c => getComputedStyle(c).display !== 'none');
    const mTotal = visibleCards.length;
    function mobileNext() {
      mIdx = (mIdx + 1) % mTotal;
      const cardWidth = visibleCards[0]?.offsetWidth + 13 || 300; /* 13 ≈ gap */
      track.scrollTo({ left: mIdx * cardWidth, behavior: 'smooth' });
    }
    let mTimer = setInterval(mobileNext, 4000);
    track.addEventListener('touchstart', () => { clearInterval(mTimer); }, { passive: true });
    track.addEventListener('touchend', () => { clearInterval(mTimer); mTimer = setInterval(mobileNext, 4000); }, { passive: true });
    return;
  }

  /* Desktop/Tablet: translateX-based carousel */
  let perView = 3;
  let current = 0;

  function getPerView() {
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function update() {
    perView = getPerView();
    const maxSlide = Math.max(0, total - perView);
    if (current > maxSlide) current = maxSlide;
    track.style.transform = `translateX(-${current * (100 / perView)}%)`;
    const pipCount = maxSlide + 1;
    pipsEl.innerHTML = '';
    for (let i = 0; i < pipCount; i++) {
      const p = document.createElement('div');
      p.className = 'diff-pip' + (i === current ? ' active' : '');
      p.addEventListener('click', () => { current = i; update(); resetAuto(); });
      pipsEl.appendChild(p);
    }
  }

  function next() { const max = Math.max(0, total - getPerView()); current = current < max ? current + 1 : 0; update(); }
  function prev() { const max = Math.max(0, total - getPerView()); current = current > 0 ? current - 1 : max; update(); }

  let autoTimer = setInterval(next, 4000);
  function resetAuto() { clearInterval(autoTimer); autoTimer = setInterval(next, 4000); }

  document.getElementById('diffPrev')?.addEventListener('click', () => { prev(); resetAuto(); });
  document.getElementById('diffNext')?.addEventListener('click', () => { next(); resetAuto(); });
  window.addEventListener('resize', () => update());
  update();

  let sx = 0, dx = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchmove', e => { dx = e.touches[0].clientX - sx; }, {passive:true});
  track.addEventListener('touchend', () => { if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); resetAuto(); } dx = 0; });
}

/* ──────────────────────────────────────────
   REVIEW DECK — draggable cards with throw
   ────────────────────────────────────────── */
function initReviewCards() {
  const track = document.getElementById('reviewTrack');
  const dotsEl = document.getElementById('reviewDots');
  if (!track) return;
  const cards = [...track.querySelectorAll('.review-card')];
  const total = cards.length;
  let current = 0, startX = 0, dx = 0, dragging = false;

  // Build dots
  if (dotsEl) {
    for (let i = 0; i < total; i++) {
      const d = document.createElement('div');
      d.className = 'review-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => { current = i; layout(); resetTimer(); });
      dotsEl.appendChild(d);
    }
  }

  function layout() {
    cards.forEach((card, i) => {
      const off = ((i - current) % total + total) % total;
      let pos = off === 0 ? 0 : off === 1 ? 1 : off === total - 1 ? -1 : off <= total/2 ? 2 : -2;
      if (pos === 0) { card.style.cssText = 'transform:translateX(0) scale(1) rotateY(0);opacity:1;z-index:3;filter:none;pointer-events:auto;box-shadow:var(--shadow-lg);'; }
      else if (pos === 1) { card.style.cssText = 'transform:translateX(62%) scale(0.82) rotateY(-6deg);opacity:0.5;z-index:2;filter:blur(1.5px);pointer-events:none;'; }
      else if (pos === -1) { card.style.cssText = 'transform:translateX(-62%) scale(0.82) rotateY(6deg);opacity:0.5;z-index:2;filter:blur(1.5px);pointer-events:none;'; }
      else { card.style.cssText = 'transform:translateX('+(pos>0?'120':'-120')+'%) scale(0.7);opacity:0;z-index:1;pointer-events:none;'; }
    });
    if (dotsEl) dotsEl.querySelectorAll('.review-dot').forEach((d,i) => d.classList.toggle('active', i === current));
  }

  function next() { current = (current + 1) % total; layout(); }
  function prev() { current = (current - 1 + total) % total; layout(); }
  let timer = setInterval(next, 5000);
  function resetTimer() { clearInterval(timer); timer = setInterval(next, 5000); }

  function onStart(x) { startX = x; dx = 0; dragging = true; cards[current]?.classList.add('dragging'); }
  function onMove(x) { if (!dragging) return; dx = x - startX; const cc = cards[current]; if (cc) cc.style.transform = 'translateX('+dx+'px) scale(1) rotateY('+(-dx*0.02)+'deg)'; }
  function onEnd() { if (!dragging) return; dragging = false; cards.forEach(c => c.classList.remove('dragging')); if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); resetTimer(); } else layout(); }

  track.addEventListener('mousedown', e => { e.preventDefault(); onStart(e.clientX); });
  window.addEventListener('mousemove', e => { if (dragging) onMove(e.clientX); });
  window.addEventListener('mouseup', onEnd);
  track.addEventListener('touchstart', e => onStart(e.touches[0].clientX), {passive:true});
  track.addEventListener('touchmove', e => onMove(e.touches[0].clientX), {passive:true});
  track.addEventListener('touchend', onEnd);
  layout();
}

/* ──────────────────────────────────────────
   HOW IT WORKS — SCROLL PINNED
   ────────────────────────────────────────── */
function initHiw() {
  const display = document.getElementById('hiwDisplay');
  const stepsEl = document.getElementById('hiwSteps');
  if (!display || !stepsEl) return;

  const isMobile = window.innerWidth <= 1024;

  if (isMobile) {
    /* Mobile: Apptics-style sticky stacking cards (pure CSS position:sticky) */
    const steps = HIW_STEPS_MOBILE;
    stepsEl.innerHTML = steps.map((s,i) => `
      <article class="hiw-step" data-hiw="${i}">
        <div class="hiw-step-num">${s.num}</div>
        <div class="hiw-step-body">
          <h3>${s.title}</h3>
          <p>${s.summary}</p>
        </div>
      </article>
    `).join('');
    /* No JS needed — CSS position:sticky with staggered top values handles everything */
    return;
  }

  /* Desktop: 3-step scroll-driven with visuals */
  stepsEl.innerHTML = HIW_STEPS.map((s,i) => `
    <div class="hiw-step ${i===0?'active':''}" data-hiw="${i}">
      <div class="hiw-step-num">${s.num}</div>
      <h3>${s.title}</h3>
      <p>${s.summary}</p>
    </div>
  `).join('') + '<div class="hiw-dots">' + HIW_STEPS.map((_,i) => `<div class="hiw-dot ${i===0?'active':''}"></div>`).join('') + '</div>';

  renderHiwDisplay(0);

  {
    // Desktop: scroll-driven
    const spacer = document.querySelector('.hiw-spacer');
    if (!spacer) return;
    window.addEventListener('scroll', () => {
      const rect = spacer.getBoundingClientRect();
      const total = spacer.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / total));
      const step = Math.min(Math.floor(progress * HIW_STEPS.length), HIW_STEPS.length - 1);
      if (step !== activeHiw) {
        activeHiw = step;
        stepsEl.querySelectorAll('.hiw-step').forEach((el,i) => el.classList.toggle('active', i===step));
        stepsEl.querySelectorAll('.hiw-dot').forEach((el,i) => el.classList.toggle('active', i===step));
        renderHiwDisplay(step);
      }
    }, {passive:true});
  }
}

function renderHiwDisplay(idx) {
  const d = document.getElementById('hiwDisplay');
  if (!d) return;
  const s = HIW_STEPS[idx];
  d.innerHTML = `
    <div class="tag hiw-display-step" style="margin-bottom:0.8rem"><strong style="display:inline-grid;place-items:center;width:1.6rem;height:1.6rem;border-radius:50%;background:var(--charcoal);color:var(--white);font-size:0.78rem;">${s.num}</strong>${s.nav}</div>
    <h3>${s.title}</h3>
    <p style="color:var(--ink)">${s.summary}</p>
    ${HIW_VISUALS[s.visual]}
    <p style="color:var(--ink-faint);font-size:0.88rem;margin-top:0.8rem">${s.detail}</p>
  `;
}

/* ──────────────────────────────────────────
   QUOTE ENGINE
   ────────────────────────────────────────── */
function esc(s) { const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
function fmt(n) { return '£' + (Number.isInteger(n) ? n : n.toFixed(2)); }

function getBuild() { return ['flat','terraced','townhouse'].includes(Q.property) ? 'semi' : (Q.build || 'semi'); }
function getBeds() { return BEDS_MAP[Q.property]?.[getBuild()] || []; }
function getPrice(freq) {
  const b = getBuild();
  const base = PRICING[freq]?.[Q.property]?.[b]?.[Q.beds] || 0;
  let extras = 0;
  Object.entries(Q.extras).forEach(([k,v]) => { if (v) extras += k==='skylights' ? UPLIFTS.skylights * Q.skylightCount : UPLIFTS[k]; });
  return base + extras;
}
function getStandalonePrice(key) {
  const svc = STANDALONE[key]; if (!svc) return 0;
  const b = getBuild();
  if (key === 'conservatory_roof') return svc.prices[Q.beds] || 0;
  const pk = Q.property === 'bungalow' || Q.property === 'flat' ? Q.property : `${b}_${Q.beds}`;
  return svc.prices[pk] || 0;
}
function getBundleDiscount() {
  const count = Object.values(Q.addons).filter(a => a.selected).length;
  if (count >= 3) return 0.20;
  if (count >= 2) return 0.15;
  return 0;
}
function getAddonTotal() {
  const disc = getBundleDiscount();
  let total = 0;
  Object.entries(Q.addons).forEach(([k,a]) => {
    if (a.selected) total += getStandalonePrice(k) * (1 - disc);
  });
  return Math.round(total);
}
function getOneoffTotal() {
  let total = 0;
  Object.entries(Q.oneoffServices).forEach(([k,v]) => {
    if (v) total += getStandalonePrice(k);
  });
  return total;
}

function scrollToQuote() {
  setTimeout(() => {
    const w = document.getElementById('quoteWidget');
    if (!w) return;
    const y = w.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({top: Math.max(0, y), behavior: 'instant'});
  }, 50);
}

let _blurTimer = null;

function renderQuote() {
  const w = document.getElementById('quoteWidget');
  const s = document.getElementById('quoteSummary');
  if (!w || !s) return;
  if (Q.submitted) w.innerHTML = renderConfirm();
  else if (!Q.mode) w.innerHTML = renderEntry();
  else w.innerHTML = renderStep();
  s.innerHTML = renderSummary();
  s.classList.toggle('has-price', !!Q.leadCaptured);
  /* Hide summary panel on entry & confirmation screens */
  const shell = w.closest('.quote-shell');
  if (shell) shell.classList.toggle('entry-mode', !Q.mode || Q.submitted);
  /* Cancel pending blur re-render when user clicks an action (mousedown fires before blur) */
  w.querySelectorAll('[data-act]').forEach(el => {
    el.addEventListener('mousedown', () => { clearTimeout(_blurTimer); });
    el.addEventListener('click', handleQuoteClick);
  });
  w.querySelectorAll('[data-field]').forEach(el => el.addEventListener('input', e => {
    Q[e.target.dataset.field] = e.target.value;
    if (Q.feedback && Q.feedback.field === e.target.dataset.field) {
      Q.feedback = null;
      /* Clear inline error without full re-render (preserves focus) */
      const wrap = e.target.closest('.field') || e.target.closest('.widget-panel');
      const err = wrap?.querySelector('.field-error');
      if (err) err.remove();
      e.target.classList.remove('field-input--error');
      const fld = e.target.closest('.field');
      if (fld) { fld.classList.remove('field--error'); }
    } else {
      Q.feedback = null;
    }
  }));
  w.querySelectorAll('[data-field]').forEach(el => el.addEventListener('blur', () => {
    /* Skip blur re-render for address field when Google Places dropdown is open */
    const delay = (el.dataset.field === 'address' && el._gac) ? 400 : 150;
    _blurTimer = setTimeout(() => {
      /* Guard: skip re-render if focus moved to another field inside the widget (prevents mobile keyboard scroll hijack) */
      const ww = document.getElementById('quoteWidget');
      if (ww && ww.contains(document.activeElement)) return;
      renderQuote();
    }, delay);
  }));
  w.querySelectorAll('[data-check="terms"]').forEach(el => el.addEventListener('change', e => {
    Q.termsAccepted = e.target.checked;
    renderQuote();
  }));
  /* Card input formatting removed — Stripe Elements handles card input in a secure iframe */
  /* Google Places autocomplete on address field */
  attachAddressAutocomplete();
  /* Mount Stripe Elements if on confirmation screen */
  if (Q.submitted && !Q.cardRegistered) mountStripeElement();
  if (Q._scroll) { Q._scroll = false; scrollToQuote(); }
  if (Q._scrollField) {
    const f = Q._scrollField; Q._scrollField = null;
    requestAnimationFrame(() => {
      const el = w.querySelector('.field-error');
      if (el) el.scrollIntoView({behavior:'smooth', block:'center'});
    });
  }
}

/* ─── ENTRY POINT ────────────────────── */
function renderEntry() {
  return `<div class="widget-frame">
    <div class="widget-header" style="text-align:center">
      <h3 class="widget-title">What would you like a price for?</h3>
      <p class="widget-copy">Choose the service that suits you and get an instant price.</p>
    </div>
    <div class="entry-grid">
      <div class="entry-card entry-card--primary" data-act="mode:regular">
        <span class="entry-badge">Most popular</span>
        <div class="entry-icon entry-icon--regular">
          <svg viewBox="0 0 48 48" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <rect x="8" y="6" width="32" height="36" rx="3" stroke-width="1.6"/>
            <line x1="24" y1="6" x2="24" y2="42" stroke-width="1.2"/>
            <line x1="8" y1="24" x2="40" y2="24" stroke-width="1.2"/>
            <path d="M14 14l5 5M29 14l5 5M14 30l5 5M29 30l5 5" stroke-width="1" opacity="0.5"/>
            <path d="M6 18c-2-4 0-9 0-9" stroke-width="1.4" opacity="0.7"/>
            <circle cx="5" cy="8" r="1.5" stroke-width="1" opacity="0.6"/>
            <path d="M3 11c0 0 1.5-1 3 0" stroke-width="1" opacity="0.5"/>
            <path d="M42 14c2-3 0-7 0-7" stroke-width="1.4" opacity="0.7"/>
            <circle cx="43" cy="6" r="1.2" stroke-width="1" opacity="0.5"/>
          </svg>
        </div>
        <h3>Regular Window Cleaning</h3>
        <div class="entry-accent"></div>
        <p>Scheduled cleans every 4 or 8 weeks — consistent, reliable, hassle-free</p>
        <div class="entry-from">From £19/clean</div>
        <span class="btn btn-primary btn-sm" style="margin-top:0.4rem">Get My Price →</span>
      </div>
      <div class="entry-card" data-act="mode:oneoff">
        <div class="entry-icon entry-icon--oneoff">
          <svg viewBox="0 0 48 48" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 20L24 6l18 14" stroke-width="1.6"/>
            <path d="M10 20v18a2 2 0 002 2h24a2 2 0 002-2V20" stroke-width="1.6"/>
            <rect x="18" y="28" width="12" height="12" rx="1.5" stroke-width="1.4"/>
            <line x1="24" y1="28" x2="24" y2="40" stroke-width="1" opacity="0.5"/>
            <line x1="18" y1="34" x2="30" y2="34" stroke-width="1" opacity="0.5"/>
            <path d="M35 12l3-3M38 9l-1 4M38 9l-4 1" stroke-width="1.2" opacity="0.7"/>
            <path d="M40 17l2-2" stroke-width="1" opacity="0.5"/>
            <circle cx="42.5" cy="14.5" r="1" stroke-width="1" opacity="0.5"/>
          </svg>
        </div>
        <h3>One-Off Exterior Services</h3>
        <div class="entry-accent"></div>
        <p>Gutters · Fascias · Conservatory roofs — book as a one-off any time</p>
        <div class="entry-from">From £80</div>
        <span class="btn btn-secondary btn-sm" style="margin-top:0.4rem">Get My Price →</span>
      </div>
    </div>
  </div>`;
}

/* ─── ACTION HANDLER ─────────────────── */
function handleQuoteClick(e) {
  const a = e.currentTarget.dataset.act;
  if (a==='sky+' || a==='sky-') e.stopPropagation();
  /* Dismiss Google Places dropdown on any action (prevents bleed-through between steps) */
  document.querySelectorAll('.pac-container').forEach(el => el.style.display = 'none');

  /* Mode selection */
  if (a==='mode:regular') { Q.mode='regular'; Q.step=1; Q.feedback=null; Q._scroll=true; }
  else if (a==='mode:oneoff') { Q.mode='oneoff'; Q.step=1; Q.feedback=null; Q._scroll=true; }
  else if (a==='backToEntry') { Q.mode=''; Q.step=1; Q.feedback=null; Q.leadCaptured=false; Q._scroll=true; }

  /* Property / build / beds (shared) */
  else if (a.startsWith('prop:')) { Q.property=a.split(':')[1]; Q.build=['flat','terraced','townhouse','commercial'].includes(Q.property)?'semi':''; if(Q.property==='commercial'){Q.beds='custom';} else {Q.beds='';} Q.feedback=null; }
  else if (a.startsWith('build:')) { Q.build=a.split(':')[1]; Q.beds=''; Q.feedback=null; }
  else if (a.startsWith('beds:')) { Q.beds=a.split(':')[1]; Q.feedback=null; }
  else if (a.startsWith('extra:')) { const k=a.split(':')[1]; Q.extras[k]=!Q.extras[k]; if(k==='skylights'&&!Q.extras[k]) Q.skylightCount=1; Q.feedback=null; }
  else if (a==='sky+') { Q.skylightCount=Math.min(Q.skylightCount+1,10); Q.feedback=null; }
  else if (a==='sky-') { Q.skylightCount=Math.max(Q.skylightCount-1,1); Q.feedback=null; }

  /* Price reveal */
  else if (a==='reveal') {
    const err=validateStep1();
    if(err){Q.feedback={t:'error',m:err.msg,field:err.field}; Q._scrollField=err.field;}
    else{Q.leadCaptured=true; capturePartialLead(); Q.feedback={t:'success',m: Q.mode==='oneoff' ? "Here are your prices! Review your selection below." : "Here's your price! Tap a frequency below to start booking."};}
  }

  /* Frequency selection — regular path (directly advances to step 2) */
  else if (a.startsWith('freq:')) { Q.frequency=a.split(':')[1]; Q.step=2; Q.feedback=null; Q._scroll=true; }

  /* One-off service toggle */
  else if (a.startsWith('oneoff:')) { const k=a.split(':')[1]; Q.oneoffServices[k]=!Q.oneoffServices[k]; Q.feedback=null; }

  /* Continue from one-off price reveal */
  else if (a==='continueOneoff') { Q.step=2; Q.feedback=null; Q._scroll=true; }

  /* Navigation */
  else if (a==='to2') { Q.step=2; Q.feedback=null; Q._scroll=true; }
  else if (a==='to3') {
    const err=validateStep2();
    if(err){Q.feedback={t:'error',m:err.msg,field:err.field}; Q._scrollField=err.field;}
    else { Q.step=3; Q.feedback=null; Q._scroll=true; }
  }
  else if (a==='to4') { Q.step=4; Q.feedback=null; Q._scroll=true; }
  else if (a==='back1') { Q.step=1; Q.feedback=null; Q._scroll=true; }
  else if (a==='back2') { Q.step=2; Q.feedback=null; Q._scroll=true; }
  else if (a==='back3') { Q.step=3; Q.feedback=null; Q._scroll=true; }

  /* Add-on toggle (regular path step 3) */
  else if (a.startsWith('addon:')) { const k=a.split(':')[1]; Q.addons[k].selected=!Q.addons[k].selected; Q.feedback=null; }
  else if (a.startsWith('plan:')) { const [,svc,plan]=a.split(':'); Q.addons[svc].plan=plan; Q.addons[svc].selected=true; Q.feedback=null; }

  /* Skip add-ons → review */
  else if (a==='skip') { Q.step=4; Q.feedback=null; Q._scroll=true; }

  /* Accept quote */
  else if (a==='accept') {
    if (!Q.termsAccepted) { Q.feedback={t:'error',m:'Please accept the terms to continue.'}; }
    else { Q.submitted=true; Q.feedback=null; submitLead(); }
  }

  /* Register card — real Stripe or fallback */
  else if (a==='registerCard') {
    const btn = e.currentTarget;
    if (btn.classList.contains('is-loading')) return;
    btn.classList.add('is-loading');
    btn.innerHTML = '<span class="btn-spinner"></span>Completing signup…';
    btn.style.pointerEvents = 'none';

    if (_stripe && _stripeElements) {
      /* Real Stripe SetupIntent confirmation */
      confirmStripeSetup().then(result => {
        if (result.success) {
          Q.cardRegistered = true;
          Q.paymentMethod = 'card';
          renderQuote();
        } else {
          /* Show error, reset button */
          btn.classList.remove('is-loading');
          btn.innerHTML = 'Complete Signup →';
          btn.style.pointerEvents = '';
          Q.feedback = { t: 'error', m: result.error || 'Card registration failed. Please try again.' };
          renderQuote();
        }
      });
    } else {
      /* Fallback — visual only (no Stripe key configured) */
      setTimeout(() => { Q.cardRegistered = true; renderQuote(); }, 1400);
    }
    return;
  }

  /* GoCardless Direct Debit setup */
  else if (a==='setupDirectDebit') {
    const btn = e.currentTarget;
    if (btn.classList.contains('is-loading')) return;
    btn.classList.add('is-loading');
    btn.innerHTML = '<span class="btn-spinner"></span>Setting up Direct Debit…';
    btn.style.pointerEvents = 'none';

    createGoCardlessSetup().then(result => {
      if (result && result.redirectUrl) {
        if (/^https:\/\/(pay\.gocardless\.com|gocardless\.com)\//.test(result.redirectUrl)) {
          window.location.href = result.redirectUrl;
        } else {
          console.error('[MAC] Invalid GoCardless redirect URL blocked:', result.redirectUrl);
          btn.classList.remove('is-loading');
          btn.innerHTML = 'Set Up Direct Debit →';
          btn.style.pointerEvents = '';
          Q.feedback = { t: 'error', m: 'Unable to set up Direct Debit. Please try card payment instead.' };
          renderQuote();
        }
      } else {
        btn.classList.remove('is-loading');
        btn.innerHTML = 'Set Up Direct Debit →';
        btn.style.pointerEvents = '';
        Q.feedback = { t: 'error', m: 'Unable to set up Direct Debit. Please try card payment instead.' };
        renderQuote();
      }
    });
    return;
  }

  /* Payment tab switching (Card / Direct Debit) */
  else if (a.startsWith('payTab:')) {
    const tab = a.split(':')[1];
    const cardPanel = document.getElementById('pay-card');
    const ddPanel = document.getElementById('pay-dd');
    const tabs = document.querySelectorAll('.payment-tab');
    tabs.forEach(t => t.classList.remove('payment-tab--active'));
    e.currentTarget.classList.add('payment-tab--active');
    if (tab === 'card') {
      if (cardPanel) cardPanel.classList.remove('payment-panel--hidden');
      if (ddPanel) ddPanel.classList.add('payment-panel--hidden');
    } else {
      if (cardPanel) cardPanel.classList.add('payment-panel--hidden');
      if (ddPanel) ddPanel.classList.remove('payment-panel--hidden');
    }
    return; /* Don't re-render — just toggle visibility */
  }

  /* Cross-sell from one-off to regular */
  else if (a==='crossSellRegular') {
    Object.assign(Q,{mode:'regular',step:1,property:'',build:'',beds:'',extras:{conservatory:false,extension:false,porch:false,garage:false,skylights:false},skylightCount:1,commercialType:'',commercialDesc:'',postcode:'',email:'',leadCaptured:false,name:'',phone:'',address:'',frequency:'4-weekly',addons:{gutter:{selected:false,plan:'single'},fascia:{selected:false,plan:'single'},conservatory_roof:{selected:false,plan:'single'}},oneoffServices:{gutter:false,fascia:false,conservatory_roof:false},termsAccepted:false,submitted:false,cardRegistered:false,feedback:null});
    Q._scroll=true;
  }

  /* Restart */
  else if (a==='restart') {
    Object.assign(Q,{mode:'',step:1,property:'',build:'',beds:'',extras:{conservatory:false,extension:false,porch:false,garage:false,skylights:false},skylightCount:1,commercialType:'',commercialDesc:'',postcode:'',email:'',leadCaptured:false,name:'',phone:'',address:'',frequency:'4-weekly',addons:{gutter:{selected:false,plan:'single'},fascia:{selected:false,plan:'single'},conservatory_roof:{selected:false,plan:'single'}},oneoffServices:{gutter:false,fascia:false,conservatory_roof:false},termsAccepted:false,submitted:false,cardRegistered:false,feedback:null});
  }

  renderQuote();
}

/* ─── VALIDATION ─────────────────────── */
function validateStep1() {
  if (!Q.property) return {msg:'Choose a property type.', field:'property'};
  if (Q.property==='commercial') {
    if (!Q.commercialType.trim()) return {msg:'Tell us what type of building it is.', field:'commercialType'};
    return null;
  }
  if (Q.property!=='terraced' && !Q.build) return {msg:'Choose semi-detached or detached.', field:'build'};
  if (!Q.beds) return {msg:'Choose number of bedrooms.', field:'beds'};
  if (Q.mode==='oneoff') {
    const anyService = Object.values(Q.oneoffServices).some(v => v);
    if (!anyService) return {msg:'Select at least one service.', field:'services'};
  }
  if (!/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(Q.postcode.trim())) return {msg:'Enter a valid postcode.', field:'postcode'};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Q.email.trim())) return {msg:'Enter a valid email address.', field:'email'};
  return null;
}
function validateStep2() {
  if (!Q.name.trim()) return {msg:'Enter your name.', field:'name'};
  if (Q.phone.replace(/\D/g,'').length < 10) return {msg:'Enter a valid phone number.', field:'phone'};
  if (!Q.address.trim()) return {msg:'Enter your address.', field:'address'};
  return null;
}

/* ─── INLINE ERROR HELPERS ───────────── */
function fieldHasError(f) { return Q.feedback && Q.feedback.t==='error' && Q.feedback.field===f; }
function fieldError(f) {
  if (!fieldHasError(f)) return '';
  return `<div class="field-error"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>${esc(Q.feedback.m)}</div>`;
}

/* ─── SHARED COMPONENTS ──────────────── */
function renderProgress() {
  let steps;
  if (Q.mode === 'regular') steps = [{n:1,l:'Property'},{n:2,l:'Details'},{n:3,l:'Add-ons'},{n:4,l:'Book'}];
  else steps = [{n:1,l:'Property'},{n:2,l:'Details'},{n:3,l:'Book'}];
  return `<div class="progress-bar">${steps.map(s => `<div class="progress-pip ${Q.step===s.n?'active':''} ${Q.step>s.n?'done':''}">${Q.step>s.n?'✓':''}<strong>${s.n}</strong> ${s.l}</div>`).join('')}</div>`;
}

function renderFeedback() {
  if (!Q.feedback) return '';
  if (Q.feedback.field) return ''; /* field-specific errors rendered inline near the field */
  return `<div class="widget-${Q.feedback.t}">${esc(Q.feedback.m)}</div>`;
}

function chip(label, note, act, selected) {
  return `<button class="chip ${selected?'selected':''}" data-act="${act}">${esc(label)}${note?`<span class="chip-note">${esc(note)}</span>`:''}</button>`;
}

function renderStep() {
  let h = '<div class="widget-frame">' + renderProgress() + renderFeedback();
  if (Q.mode === 'regular') {
    if (Q.step === 1) h += renderStep1();
    else if (Q.step === 2) h += renderStep2();
    else if (Q.step === 3) h += renderStep3();
    else h += renderReview();
  } else {
    if (Q.step === 1) h += renderStep1Oneoff();
    else if (Q.step === 2) h += renderStep2Oneoff();
    else h += renderReview();
  }
  return h + '</div>';
}

/* ═══ REGULAR PATH ═══════════════════════ */

function renderStep1() {
  const eb = getBuild();
  const beds = getBeds();
  let h = `
    <div class="widget-header">
      ${Q._embedded ? '' : '<button class="btn-back-entry" data-act="backToEntry">← Change service type</button>'}
      <div class="tag">Step 1 of 4</div>
      <h3 class="widget-title">Your property</h3>
      <p class="widget-copy">Tell us about your home and we'll calculate your exact price.</p>
    </div>
    <div class="widget-panel"><h3>Property type</h3><div class="chip-grid">${PROPERTY_TYPES.map(p => chip(p.label,p.note,'prop:'+p.id,Q.property===p.id)).join('')}</div>${fieldError('property')}</div>`;

  if (Q.property && !['flat','terraced','townhouse','commercial'].includes(Q.property)) {
    h += `<div class="widget-panel"><h3>Build type</h3><div class="chip-grid">${BUILD_TYPES.map(b => chip(b.label,'','build:'+b.id,Q.build===b.id)).join('')}</div>${fieldError('build')}</div>`;
  }
  if (Q.property === 'commercial') {
    h += '<div class="widget-panel"><h3>Commercial property details</h3>';
    h += '<div class="field"><label>Type of building</label><input data-field="commercialType" value="' + esc(Q.commercialType||'') + '" placeholder="e.g. Office, retail unit, school, restaurant">' + fieldError('commercialType') + '</div>';
    h += '<div class="field"><label>What do you need cleaned?</label><textarea data-field="commercialDesc" rows="4" style="width:100%;border-radius:var(--radius-sm);border:1.5px solid var(--line);padding:0.8rem;font:inherit;resize:vertical" placeholder="Tell us about the job — number of windows, floors, access requirements, how often you need us etc.">' + esc(Q.commercialDesc||'') + '</textarea></div>';
    h += '<div class="field" style="margin-top:0.8rem"><label>Photos <span style="color:var(--ink-faint);font-weight:400">(optional)</span></label><input type="file" data-field="commercialPhotos" multiple accept="image/*" style="font-size:0.88rem"></div>';
    h += '<p style="font-size:0.85rem;color:var(--ink-faint);margin-top:0.8rem">We\'ll review your details and get back to you with a custom quote within 24 hours.</p>';
    h += '</div>';
  } else if (Q.property && eb && beds.length) {
    h += `<div class="widget-panel"><h3>Bedrooms</h3><div class="chip-grid">${beds.map(b => chip(b+' bed','','beds:'+b,Q.beds===b)).join('')}</div>${fieldError('beds')}</div>`;
  }
  if (Q.beds) {
    h += `<div class="widget-panel"><h3>Any extras?</h3><div class="extras-grid">${EXTRAS.map(ex => {
      const sel = Q.extras[ex.id];
      let extra = '';
      if (ex.id==='skylights' && sel) extra = `<div style="display:flex;gap:0.4rem;align-items:center;justify-content:center;margin-top:0.3rem"><button class="btn btn-sm btn-ghost" data-act="sky-">−</button><span>${Q.skylightCount}</span><button class="btn btn-sm btn-ghost" data-act="sky+">+</button></div>`;
      return `<div class="extra-card ${sel?'selected':''}" data-act="extra:${ex.id}"><strong>${esc(ex.label)}</strong><span>${esc(ex.note)}</span>${extra}</div>`;
    }).join('')}</div></div>`;

    h += `<div class="widget-panel"><h3>Photos <span style="font-weight:400;font-size:0.85rem;color:var(--ink-faint)">(optional — helps us quote accurately)</span></h3>
        <input type="file" data-field="photos" multiple accept="image/*" style="font-size:0.88rem">
        <p style="font-size:0.82rem;color:var(--ink-faint);margin-top:0.4rem">Upload photos of your property if you'd like a more accurate quote.</p>
      </div>
      <div class="widget-panel"><h3>Check coverage &amp; see your price</h3>
      <div class="field-row">
        <div class="field ${fieldHasError('postcode')?'field--error':''}"><label>Postcode</label><input data-field="postcode" value="${esc(Q.postcode)}" placeholder="e.g. LU3 2AB" autocomplete="postal-code" class="${fieldHasError('postcode')?'field-input--error':''}"><div class="field-hint">Check we cover your area</div>${fieldError('postcode')}</div>
        <div class="field ${fieldHasError('email')?'field--error':''}"><label>Email</label><input data-field="email" type="email" value="${esc(Q.email)}" placeholder="name@email.com" autocomplete="email" class="${fieldHasError('email')?'field-input--error':''}"><div class="field-hint">We'll email you a copy of your quote</div>${fieldError('email')}</div>
      </div>`;

    if (Q.leadCaptured) {
      const p4 = getPrice('4-weekly'), p8 = getPrice('8-weekly');
      h += `<div class="price-reveal">
        <p style="text-align:center;font-weight:600;color:var(--charcoal);margin-bottom:0.8rem">Happy with your price? Tap a frequency to start booking →</p>
        <div class="price-reveal-grid">
          <div class="price-reveal-card featured" data-act="freq:4-weekly" style="cursor:pointer"><div class="price-freq">Every 4 weeks</div><div class="price-val">${fmt(p4)}</div><div class="price-note">Best value · Most popular</div></div>
          <div class="price-reveal-card" data-act="freq:8-weekly" style="cursor:pointer"><div class="price-freq">Every 8 weeks</div><div class="price-val">${fmt(p8)}</div><div class="price-note">Same full service</div></div>
        </div></div>`;
    } else {
      h += `<div class="widget-notice" style="margin-top:0.8rem">Fill in both fields above and click below to see your exact price.</div>
        <div class="widget-actions"><button class="btn btn-primary" data-act="reveal">See My Price</button></div>`;
    }
    h += '</div>';
  }
  return h;
}

function renderStep2() {
  const p = getPrice(Q.frequency);
  const freqLabel = Q.frequency === '4-weekly' ? 'Every 4 weeks' : 'Every 8 weeks';
  return `
    <div class="widget-header"><div class="tag">Step 2 of 4</div><h3 class="widget-title">Your details</h3><p class="widget-copy">Almost there — just your contact details.</p></div>
    <div class="widget-notice" style="display:flex;align-items:center;gap:0.6rem;font-weight:600"><span style="font-size:1.2rem">✓</span> You selected: ${freqLabel} — ${fmt(p)}/clean</div>
    <div class="widget-panel"><h3>Contact details</h3>
      <div class="field-row">
        <div class="field ${fieldHasError('name')?'field--error':''}"><label>Name</label><input data-field="name" value="${esc(Q.name)}" placeholder="Full name" autocomplete="name" class="${fieldHasError('name')?'field-input--error':''}"><div class="field-hint">So we know who to expect</div>${fieldError('name')}</div>
        <div class="field ${fieldHasError('phone')?'field--error':''}"><label>Phone</label><input data-field="phone" type="tel" value="${esc(Q.phone)}" placeholder="07..." autocomplete="tel" class="${fieldHasError('phone')?'field-input--error':''}"><div class="field-hint">For your night-before text reminders</div>${fieldError('phone')}</div>
      </div>
      <div class="field ${fieldHasError('address')?'field--error':''}"><label>Address</label><input data-field="address" value="${esc(Q.address)}" placeholder="House number and street" autocomplete="street-address" class="${fieldHasError('address')?'field-input--error':''}"><div class="field-hint">So we know where to come</div>${fieldError('address')}</div>
    </div>
    <div class="widget-actions"><button class="btn btn-ghost" data-act="back1">Back</button><button class="btn btn-primary" data-act="to3">Continue to Add-ons →</button></div>`;
}

function renderStep3() {
  const addonCount = Object.values(Q.addons).filter(a => a.selected).length;
  const disc = getBundleDiscount();
  let h = `<div class="widget-header"><div class="tag">Step 3 of 4</div><h3 class="widget-title">Before you go — did you know we also offer these?</h3><p class="widget-copy">Add services to your clean and save up to 20%.</p></div>`;
  if (addonCount >= 3) h += '<div class="widget-success">All three services selected — your 20% bundle discount is applied automatically.</div>';
  else if (addonCount === 2) h += '<div class="widget-success">Two services selected — your 15% bundle discount is applied automatically.</div>';
  else h += '<div class="widget-notice">Book multiple services together and save. 15% off when you add two, 20% off when you add all three.</div>';
  h += '<div class="addon-grid">';
  Object.entries(STANDALONE).forEach(([key, svc]) => {
    const a = Q.addons[key];
    const base = getStandalonePrice(key);
    const price = a.selected ? base * (1 - disc) : base;
    h += `<div class="addon-card ${a.selected?'selected':''}">
      <div style="display:flex;justify-content:space-between;align-items:start"><div><h3>${svc.label}</h3><p>${svc.desc}</p></div><button class="btn btn-sm ${a.selected?'btn-primary':'btn-secondary'}" data-act="addon:${key}">${a.selected?'Added':'Add'}</button></div>
      ${a.selected ? `<div class="plan-pills">${svc.plans.map(p => `<button class="plan-pill ${a.plan===p.id?'selected':''}" data-act="plan:${key}:${p.id}">${p.label}</button>`).join('')}</div>
      <div style="font-size:0.92rem;font-weight:700;margin-top:0.5rem">${fmt(Math.round(price))}${disc>0?' <span style="font-size:0.82rem;color:var(--gold);font-weight:600">(-'+Math.round(disc*100)+'%)</span>':''}</div>` : `<div style="font-size:0.92rem;font-weight:700;margin-top:0.5rem;color:var(--ink-faint)">${fmt(base)}</div>`}
    </div>`;
  });
  h += '</div>';
  h += `<div class="widget-actions"><button class="btn btn-ghost" data-act="back2">Back</button><button class="btn btn-primary" data-act="to4">Review My Quote →</button></div>`;
  h += `<div style="text-align:center;margin-top:0.5rem"><button class="btn-link" data-act="skip">Skip — just windows please</button></div>`;
  return h;
}

/* ═══ ONE-OFF PATH ═══════════════════════ */

function renderStep1Oneoff() {
  const eb = getBuild();
  const beds = getBeds();
  let h = `
    <div class="widget-header">
      ${Q._embedded ? '' : '<button class="btn-back-entry" data-act="backToEntry">← Change service type</button>'}
      <div class="tag">Step 1 of 3</div>
      <h3 class="widget-title">Your property &amp; services</h3>
      <p class="widget-copy">Tell us about your property and select the services you need.</p>
    </div>
    <div class="widget-panel"><h3>Property type</h3><div class="chip-grid">${PROPERTY_TYPES.map(p => chip(p.label,p.note,'prop:'+p.id,Q.property===p.id)).join('')}</div>${fieldError('property')}</div>`;

  if (Q.property && !['flat','terraced','townhouse','commercial'].includes(Q.property)) {
    h += `<div class="widget-panel"><h3>Build type</h3><div class="chip-grid">${BUILD_TYPES.map(b => chip(b.label,'','build:'+b.id,Q.build===b.id)).join('')}</div>${fieldError('build')}</div>`;
  }
  if (Q.property === 'commercial') {
    h += '<div class="widget-panel"><h3>Commercial property details</h3>';
    h += '<div class="field"><label>Type of building</label><input data-field="commercialType" value="' + esc(Q.commercialType||'') + '" placeholder="e.g. Office, retail unit, school, restaurant">' + fieldError('commercialType') + '</div>';
    h += '<div class="field"><label>What do you need cleaned?</label><textarea data-field="commercialDesc" rows="4" style="width:100%;border-radius:var(--radius-sm);border:1.5px solid var(--line);padding:0.8rem;font:inherit;resize:vertical" placeholder="Tell us about the job...">' + esc(Q.commercialDesc||'') + '</textarea></div>';
    h += '</div>';
  } else if (Q.property && eb && beds.length) {
    h += `<div class="widget-panel"><h3>Bedrooms</h3><div class="chip-grid">${beds.map(b => chip(b+' bed','','beds:'+b,Q.beds===b)).join('')}</div>${fieldError('beds')}</div>`;
  }

  if (Q.beds) {
    /* Service selection cards with live pricing */
    h += `<div class="widget-panel"><h3>Select the services you need</h3><div class="oneoff-grid">`;
    Object.entries(STANDALONE).forEach(([key, svc]) => {
      const price = getStandalonePrice(key);
      const sel = Q.oneoffServices[key];
      h += `<div class="oneoff-card ${sel?'selected':''}" data-act="oneoff:${key}">
        <div class="oneoff-check">${sel?'✓':''}</div>
        <div class="oneoff-info"><strong>${svc.label}</strong><p>${svc.desc}</p></div>
        <div class="oneoff-price">${fmt(price)}</div>
      </div>`;
    });
    h += `</div>${fieldError('services')}</div>`;

    /* Postcode & email */
    h += `<div class="widget-panel"><h3>Check coverage &amp; see your price</h3>
      <div class="field-row">
        <div class="field ${fieldHasError('postcode')?'field--error':''}"><label>Postcode</label><input data-field="postcode" value="${esc(Q.postcode)}" placeholder="e.g. LU3 2AB" autocomplete="postal-code" class="${fieldHasError('postcode')?'field-input--error':''}"><div class="field-hint">Check we cover your area</div>${fieldError('postcode')}</div>
        <div class="field ${fieldHasError('email')?'field--error':''}"><label>Email</label><input data-field="email" type="email" value="${esc(Q.email)}" placeholder="name@email.com" autocomplete="email" class="${fieldHasError('email')?'field-input--error':''}"><div class="field-hint">We'll email you a copy of your quote</div>${fieldError('email')}</div>
      </div>`;

    if (Q.leadCaptured) {
      const total = getOneoffTotal();
      const selectedNames = Object.entries(Q.oneoffServices).filter(([,v])=>v).map(([k])=>STANDALONE[k].label);
      h += `<div class="price-reveal">
        <div style="text-align:center;margin-bottom:0.6rem">
          <div style="font-size:0.85rem;color:var(--ink)">Your one-off service total</div>
          <div style="font-size:2rem;font-weight:800;color:var(--charcoal)">${fmt(total)}</div>
          <div style="font-size:0.85rem;color:var(--ink-faint)">${selectedNames.join(' + ')}</div>
        </div>
        <div class="widget-actions"><button class="btn btn-primary" data-act="continueOneoff">Continue to book →</button></div>
      </div>`;
    } else {
      h += `<div class="widget-notice" style="margin-top:0.8rem">Fill in both fields above and click below to see your total.</div>
        <div class="widget-actions"><button class="btn btn-primary" data-act="reveal">See My Price</button></div>`;
    }
    h += '</div>';
  }
  return h;
}

function renderStep2Oneoff() {
  const total = getOneoffTotal();
  const selectedNames = Object.entries(Q.oneoffServices).filter(([,v])=>v).map(([k])=>STANDALONE[k].label);
  return `
    <div class="widget-header"><div class="tag">Step 2 of 3</div><h3 class="widget-title">Your details</h3><p class="widget-copy">Almost there — just your contact details.</p></div>
    <div class="widget-notice" style="display:flex;align-items:center;gap:0.6rem;font-weight:600"><span style="font-size:1.2rem">✓</span> One-off: ${selectedNames.join(' + ')} — ${fmt(total)}</div>
    <div class="widget-panel"><h3>Contact details</h3>
      <div class="field-row">
        <div class="field ${fieldHasError('name')?'field--error':''}"><label>Name</label><input data-field="name" value="${esc(Q.name)}" placeholder="Full name" autocomplete="name" class="${fieldHasError('name')?'field-input--error':''}"><div class="field-hint">So we know who to expect</div>${fieldError('name')}</div>
        <div class="field ${fieldHasError('phone')?'field--error':''}"><label>Phone</label><input data-field="phone" type="tel" value="${esc(Q.phone)}" placeholder="07..." autocomplete="tel" class="${fieldHasError('phone')?'field-input--error':''}"><div class="field-hint">We'll text you the day before</div>${fieldError('phone')}</div>
      </div>
      <div class="field ${fieldHasError('address')?'field--error':''}"><label>Address</label><input data-field="address" value="${esc(Q.address)}" placeholder="House number and street" autocomplete="street-address" class="${fieldHasError('address')?'field-input--error':''}"><div class="field-hint">So we know where to come</div>${fieldError('address')}</div>
    </div>
    <div class="widget-actions"><button class="btn btn-ghost" data-act="back1">Back</button><button class="btn btn-primary" data-act="to3">Review My Quote →</button></div>`;
}

/* ═══ SHARED REVIEW & ACCEPT ═════════════ */

function renderReview() {
  const isRegular = Q.mode === 'regular';
  const stepNum = isRegular ? 4 : 3;
  const totalSteps = isRegular ? 4 : 3;
  const backAct = isRegular ? 'back3' : 'back2';

  let h = `<div class="widget-header"><div class="tag">Step ${stepNum} of ${totalSteps}</div><h3 class="widget-title">Review &amp; accept</h3><p class="widget-copy">Check everything looks right, then accept your quote.</p></div>`;

  h += '<div class="quote-review">';
  h += '<div class="quote-review__header"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Your Quote Summary</div>';

  /* Property */
  h += `<div class="quote-review__row"><div class="quote-review__label">Property</div><div class="quote-review__val">${Q.property} (${getBuild()}, ${Q.beds} bed)</div></div>`;

  if (isRegular) {
    const p = getPrice(Q.frequency);
    const freqLabel = Q.frequency === '4-weekly' ? 'Every 4 weeks' : 'Every 8 weeks';
    h += `<div class="quote-review__row"><div class="quote-review__label">Window cleaning</div><div class="quote-review__val">${freqLabel} — <strong>${fmt(p)}/clean</strong></div></div>`;

    const extrasList = Object.entries(Q.extras).filter(([,v])=>v).map(([k])=>k==='skylights'?Q.skylightCount+' skylight'+(Q.skylightCount>1?'s':''):k);
    if (extrasList.length) {
      h += `<div class="quote-review__row"><div class="quote-review__label">Extras</div><div class="quote-review__val">${extrasList.join(', ')}</div></div>`;
    }

    const disc = getBundleDiscount();
    const addonTotal = getAddonTotal();
    const selectedAddons = Object.entries(Q.addons).filter(([,a])=>a.selected);
    if (selectedAddons.length) {
      let addonHtml = selectedAddons.map(([k]) => {
        const base = getStandalonePrice(k);
        const discounted = Math.round(base * (1 - disc));
        return `${STANDALONE[k].label} — ${fmt(discounted)}${disc>0?' <small style="color:var(--gold)">(-'+Math.round(disc*100)+'%)</small>':''}`;
      }).join('<br>');
      h += `<div class="quote-review__row"><div class="quote-review__label">Add-on services</div><div class="quote-review__val">${addonHtml}</div></div>`;
    }

    const grandTotal = p + (addonTotal || 0);
    h += `<div class="quote-review__total"><span>Total (first clean)</span><span>${fmt(grandTotal)}</span></div>`;

  } else {
    const selectedSvcs = Object.entries(Q.oneoffServices).filter(([,v])=>v);
    let svcHtml = selectedSvcs.map(([k]) => `${STANDALONE[k].label} — ${fmt(getStandalonePrice(k))}`).join('<br>');
    h += `<div class="quote-review__row"><div class="quote-review__label">Services</div><div class="quote-review__val">${svcHtml}</div></div>`;
    h += `<div class="quote-review__total"><span>Total</span><span>${fmt(getOneoffTotal())}</span></div>`;
  }

  h += `<div class="quote-review__row"><div class="quote-review__label">Contact</div><div class="quote-review__val">${esc(Q.name)}<br>${esc(Q.address)}${Q.postcode?', '+esc(Q.postcode):''}<br>${esc(Q.email)}<br>${esc(Q.phone)}</div></div>`;
  h += '</div>';

  /* Terms */
  const termsText = isRegular
    ? "I agree to MAC Cleaning's Terms of Service and authorise automatic card payments after each clean."
    : "I agree to MAC Cleaning's Terms of Service and authorise a one-off card payment for the services listed above.";
  h += `<div class="terms-box"><label class="terms-label"><input type="checkbox" data-check="terms" ${Q.termsAccepted?'checked':''}><span>${termsText}</span></label></div>`;

  /* Accept button with clear disabled state */
  if (Q.termsAccepted) {
    h += `<div class="widget-actions"><button class="btn btn-ghost" data-act="${backAct}">Back</button><button class="btn btn-accept" data-act="accept">Accept Quote →</button></div>`;
  } else {
    h += `<div class="widget-actions"><button class="btn btn-ghost" data-act="${backAct}">Back</button><div class="btn-accept-wrap"><button class="btn btn-accept btn-accept--disabled" data-act="accept">Accept Quote →</button><span class="btn-accept-hint">Tick the box above to continue</span></div></div>`;
  }

  return h;
}

/* ═══ CONFIRMATION ═══════════════════════ */

function renderConfirm() {
  const isRegular = Q.mode === 'regular';

  /* Part A — Quote accepted */
  let h = '<div class="widget-frame"><div class="confirm-card">';
  h += '<div class="confirm-check"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>';
  h += '<h3>Quote Accepted!</h3>';

  /* Mini summary */
  if (isRegular) {
    const p = getPrice(Q.frequency);
    const freqLabel = Q.frequency === '4-weekly' ? 'Every 4 weeks' : 'Every 8 weeks';
    h += `<div class="confirm-summary">${Q.property} · ${freqLabel} · <strong>${fmt(p)}/clean</strong></div>`;
  } else {
    h += `<div class="confirm-summary">${Q.property} · One-off services · <strong>${fmt(getOneoffTotal())}</strong></div>`;
  }

  h += `<p class="confirm-email">Confirmation sent to <strong>${esc(Q.email)}</strong></p>`;
  h += '</div>';

  /* Part B — Payment registration */
  const hasStripe = !!STRIPE_PK && !!STRIPE_SETUP_ENDPOINT;
  const hasGoCardless = !!GOCARDLESS_SETUP_ENDPOINT;
  const hasPayment = hasStripe || hasGoCardless;

  h += '<div class="stripe-card">';
  h += '<div class="stripe-card__header"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>Complete Your Registration</div>';
  h += '<div class="stripe-card__body">';
  h += '<ul class="stripe-card__features"><li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Secure payment processing</li>';
  h += '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><strong>No charge today</strong> — payment details saved for future cleans</li>';
  h += '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Cancel or update anytime</li></ul>';

  if (!Q.cardRegistered) {

    if (hasPayment) {
      /* Payment method tabs (Card / Direct Debit) */
      if (hasStripe && hasGoCardless) {
        h += '<div class="payment-tabs">';
        h += '<button class="payment-tab payment-tab--active" data-act="payTab:card"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>Card</button>';
        h += '<button class="payment-tab" data-act="payTab:dd"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 100 4h4v-4h-4z"/></svg>Direct Debit</button>';
        h += '</div>';
      }

      /* Card payment section (Stripe Elements) */
      if (hasStripe) {
        h += '<div class="payment-panel payment-panel--card" id="pay-card">';
        h += '<div class="card-form">';
        h += '<div id="stripe-element" style="min-height:60px"></div>';
        h += '<button class="btn btn-stripe" data-act="registerCard">Complete Signup →</button>';
        h += '</div>';
        h += '</div>';
      }

      /* Direct Debit section (GoCardless) */
      if (hasGoCardless) {
        h += `<div class="payment-panel payment-panel--dd${hasStripe?' payment-panel--hidden':''}" id="pay-dd">`;
        h += '<div class="dd-info">';
        h += '<p style="font-size:0.9rem;color:var(--ink);margin-bottom:0.6rem">Set up a Direct Debit mandate with GoCardless. Your bank account will be debited automatically after each clean.</p>';
        h += '<div class="dd-features"><span>✓ UK bank accounts</span><span>✓ Protected by Direct Debit Guarantee</span><span>✓ Easy to cancel</span></div>';
        h += '</div>';
        h += '<button class="btn btn-stripe" data-act="setupDirectDebit" style="background:var(--charcoal)">Set Up Direct Debit →</button>';
        h += '</div>';
      }

    } else {
      /* Fallback — no payment provider configured */
      h += '<div class="card-form">';
      h += '<p style="text-align:center;color:var(--ink);font-size:0.9rem;padding:1rem 0">We\'ll send you a secure payment registration link by email.</p>';
      h += `<p class="stripe-card__note">Look out for an email to <strong>${esc(Q.email)}</strong></p>`;
      h += '</div>';
    }

    if (hasPayment) {
      h += `<p class="stripe-card__note">We'll also email a secure link to <strong>${esc(Q.email)}</strong></p>`;
    }
  } else {
    /* Success state after card registration */
    h += '<div class="card-form__success">';
    h += '<div class="card-form__success-check"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>';
    h += '<p class="card-form__success-title">Signup complete!</p>';
    h += `<p class="stripe-card__note">Confirmation sent to <strong>${esc(Q.email)}</strong></p>`;
    h += '</div>';
  }

  h += '<div class="stripe-card__badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>Powered by Stripe · 256-bit encryption</div>';
  h += '</div></div>';

  /* Part C — What happens next */
  if (isRegular) {
    h += `<div class="confirm-steps"><p><strong>What happens next</strong></p><ul>
      <li>Your first clean will be booked within 24 hours</li>
      <li>You'll receive a text the night before each visit</li>
      <li>Payments are taken automatically after each clean</li>
    </ul></div>`;
  } else {
    h += `<div class="confirm-steps"><p><strong>What happens next</strong></p><ul>
      <li>We'll arrange your service within 48 hours</li>
      <li>You'll receive a text the day before</li>
      <li>Payment is taken after the job is complete</li>
    </ul></div>`;
    h += `<div class="cross-sell"><p>Did you know we offer regular window cleaning from just <strong>£19/clean</strong>?</p><button class="btn btn-secondary btn-sm" data-act="crossSellRegular">Get a window cleaning quote →</button></div>`;
  }

  h += '<button class="btn btn-ghost" data-act="restart" style="margin-top:1rem">Get another quote</button></div>';
  return h;
}

/* ═══ SIDEBAR SUMMARY ═══════════════════ */

function renderSummary() {
  if (!Q.mode) return `<h3 class="summary-title">Your quote</h3><div class="summary-empty">Choose a service type to get started.</div>`;
  if (!Q.property || !Q.beds) return `<h3 class="summary-title">Your quote</h3><div class="summary-empty">Select a property type and bedrooms to see your quote.</div>`;

  /* One-off summary */
  if (Q.mode === 'oneoff') {
    if (!Q.leadCaptured) {
      let svcList = Object.entries(Q.oneoffServices).filter(([,v])=>v).map(([k])=>STANDALONE[k].label).join(', ');
      return `<h3 class="summary-title">Your quote</h3><div class="summary-list"><div class="summary-row"><span>${Q.property} (${getBuild()}, ${Q.beds} bed)</span><span>—</span></div></div>${svcList?`<div style="font-size:0.85rem;color:var(--ink);margin-top:0.6rem">${svcList}</div>`:''}<div style="font-size:0.88rem;color:var(--ink-faint);margin-top:0.8rem;text-align:center">Enter your postcode &amp; email to see your price</div>`;
    }
    let rows = '';
    Object.entries(Q.oneoffServices).forEach(([k,v]) => {
      if (v) rows += `<div class="summary-row"><span>${STANDALONE[k].label}</span><span>${fmt(getStandalonePrice(k))}</span></div>`;
    });
    const total = getOneoffTotal();
    return `<h3 class="summary-title">Your quote</h3><div class="summary-list"><div class="summary-row"><span>${Q.property} (${getBuild()}, ${Q.beds} bed)</span></div></div>${rows?`<div style="margin-top:0.8rem;padding-top:0.8rem;border-top:1px solid var(--line)"><div style="font-size:0.82rem;font-weight:600;color:var(--ink);margin-bottom:0.4rem">One-off services</div>${rows}</div>`:''}${total?`<div style="margin-top:0.8rem;padding-top:0.8rem;border-top:2px solid var(--charcoal);display:flex;justify-content:space-between;font-weight:700;font-size:1.05rem"><span>Total</span><span>${fmt(total)}</span></div>`:''}`;
  }

  /* Regular summary */
  if (!Q.leadCaptured) return `<h3 class="summary-title">Your quote</h3><div class="summary-list"><div class="summary-row"><span>${Q.property} (${getBuild()}, ${Q.beds} bed)</span><span>—</span></div></div><div style="font-size:0.88rem;color:var(--ink-faint);margin-top:0.8rem;text-align:center">Enter your postcode &amp; email to reveal your price</div>`;
  const p = getPrice(Q.frequency);
  let rows = `<div class="summary-row"><span>${Q.property} (${getBuild()}, ${Q.beds} bed)</span><span>${fmt(PRICING[Q.frequency]?.[Q.property]?.[getBuild()]?.[Q.beds]||0)}</span></div>`;
  Object.entries(Q.extras).forEach(([k,v]) => { if(v) rows += `<div class="summary-row"><span>${k==='skylights'?Q.skylightCount+' skylight'+(Q.skylightCount>1?'s':''):k}</span><span>+${fmt(k==='skylights'?UPLIFTS.skylights*Q.skylightCount:UPLIFTS[k])}</span></div>`; });
  const disc = getBundleDiscount();
  let addon_rows = '';
  let addonTotal = 0;
  Object.entries(Q.addons).forEach(([k,a]) => {
    if (a.selected) {
      const base = getStandalonePrice(k);
      const discounted = Math.round(base * (1 - disc));
      addonTotal += discounted;
      addon_rows += `<div class="summary-row"><span>${STANDALONE[k].label}${disc>0?' <small style="color:var(--gold)">(-'+Math.round(disc*100)+'%)</small>':''}</span><span>${fmt(discounted)}</span></div>`;
    }
  });
  let html = `<h3 class="summary-title">Your quote</h3><div class="summary-list">${rows}</div><div class="summary-total"><span>${Q.frequency} clean</span><span>${fmt(p)}</span></div>`;
  if (addon_rows) {
    html += `<div style="margin-top:0.8rem;padding-top:0.8rem;border-top:1px solid var(--line)"><div style="font-size:0.82rem;font-weight:600;color:var(--ink);margin-bottom:0.4rem">Add-on services</div>${addon_rows}</div>`;
    const grandTotal = p + addonTotal;
    html += `<div style="margin-top:0.8rem;padding-top:0.8rem;border-top:2px solid var(--charcoal);display:flex;justify-content:space-between;font-weight:700;font-size:1.05rem"><span>Total</span><span>${fmt(grandTotal)}</span></div>`;
  }
  return html;
}

/* ──────────────────────────────────────────
   FOOTER ACCORDION (mobile)
   ────────────────────────────────────────── */
function initFooterAccordion() {
  if (window.innerWidth > 768) return;
  document.querySelectorAll('.footer-grid > div:not(:first-child) h4').forEach(h4 => {
    h4.addEventListener('click', () => {
      h4.parentElement.classList.toggle('open');
    });
  });
}


/* ──────────────────────────────────────────
   FAQ SHOW ALL (mobile)
   ────────────────────────────────────────── */
function initFaqShowAll() {
  if (window.innerWidth > 768) return;
  const list = document.querySelector('.faq-list');
  if (!list) return;
  const btn = document.createElement('button');
  btn.className = 'faq-show-all';
  btn.textContent = 'Show all questions ▾';
  btn.addEventListener('click', () => {
    list.classList.add('expanded');
    btn.remove();
  });
  list.parentElement.appendChild(btn);
}

/* ──────────────────────────────────────────
   SERVICES AUTO-SCROLL (mobile)
   ────────────────────────────────────────── */
function initServicesAutoScroll() {
  if (window.innerWidth > 768) return;
  const grid = document.querySelector('.services-grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.service-card');
  if (!cards.length) return;
  let idx = 0;
  const total = cards.length;
  let timer = setInterval(() => {
    idx = (idx + 1) % total;
    const cardWidth = cards[0].offsetWidth + 13;
    grid.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
  }, 5000);
  grid.addEventListener('touchstart', () => clearInterval(timer), { passive: true });
  grid.addEventListener('touchend', () => {
    clearInterval(timer);
    timer = setInterval(() => {
      idx = (idx + 1) % total;
      const cardWidth = cards[0].offsetWidth + 13;
      grid.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
    }, 5000);
  }, { passive: true });
}
