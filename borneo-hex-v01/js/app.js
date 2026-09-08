import { firebaseConfig, businessConfig } from './firebase-config.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const menuToggle = $('.menu-toggle');
const nav = $('#primary-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
$$('#primary-nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
$('#year').textContent = new Date().getFullYear();

function whatsapp(text = 'Hi BORNEO HEX, saya ingin mendapatkan maklumat lanjut.') {
  if (!businessConfig.whatsappNumber) {
    alert('Nombor WhatsApp BORNEO HEX belum dikonfigurasi. Masukkan nombor dalam js/firebase-config.js.');
    return;
  }
  const url = `https://wa.me/${businessConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener');
}

['heroWhatsApp','urgentWhatsApp','footerWhatsApp','mobileWhatsApp'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', () => whatsapp());
});

const builder = $('#packageBuilder');
let latestRecommendation = null;

function buildRecommendation({location, project, workers, duration, extras}) {
  const n = Number(workers) || 30;
  let code = 'BH-01';
  let name = 'Worker Welfare Station';
  if (project === 'Shutdown') { code = 'BH-03'; name = 'Shutdown Support Station'; }
  else if (project === 'Temporary Site' || project === 'Construction') { code = 'BH-02'; name = 'Contractor Field Office'; }
  else if (project === 'Event') { code = 'EVENT'; name = 'Event & Canopy Setup'; }

  const shelters = Math.max(1, Math.ceil(n / 20));
  const tables = Math.max(2, Math.ceil(n / 8));
  const fans = Math.max(1, Math.ceil(n / 20));
  const items = [
    `${shelters} × temporary shelter${shelters > 1 ? 's' : ''}`,
    `${n} × chairs`,
    `${tables} × tables`,
  ];
  if (extras.includes('Industrial fan')) items.push(`${fans} × industrial fans`);
  extras.filter(x => x !== 'Industrial fan').forEach(x => items.push(x));
  if (code === 'BH-01' || code === 'BH-03') items.push('Water & waste station');

  return { code, name, location, project, workers: n, duration, items };
}

function renderRecommendation(rec) {
  latestRecommendation = rec;
  const box = $('#recommendation');
  $('h3', box).textContent = `${rec.code} ${rec.name}`;
  $('.recommend-meta', box).textContent = `${rec.workers} pekerja • ${rec.duration} • ${rec.location}`;
  $('.recommend-list', box).innerHTML = rec.items.map(i => `<span>${i}</span>`).join('');
}

builder?.addEventListener('submit', e => {
  e.preventDefault();
  const extras = $$('#packageBuilder input[type="checkbox"]:checked').map(i => i.value);
  renderRecommendation(buildRecommendation({
    location: $('#builderLocation').value,
    project: $('#builderProject').value,
    workers: $('#builderWorkers').value,
    duration: $('#builderDuration').value,
    extras
  }));
  $('#recommendation').scrollIntoView({behavior:'smooth', block:'center'});
});

$('#useRecommendation')?.addEventListener('click', () => {
  if (!latestRecommendation) return;
  $('#serviceType').value = latestRecommendation.project === 'Event' ? 'Event & Canopy' : 'Site Support';
  const option = [...$('#packageType').options].find(o => o.textContent.startsWith(latestRecommendation.code));
  $('#packageType').value = option ? option.value : 'Custom';
  $('#projectLocation').value = latestRecommendation.location;
  $('#message').value = `${latestRecommendation.project} | ${latestRecommendation.workers} pekerja | ${latestRecommendation.duration}\nCadangan awal: ${latestRecommendation.items.join(', ')}`;
  $('#rfq').scrollIntoView({behavior:'smooth'});
});

$$('.package-select').forEach(btn => btn.addEventListener('click', () => {
  $('#serviceType').value = 'Site Support';
  $('#packageType').value = btn.dataset.package;
  $('#rfq').scrollIntoView({behavior:'smooth'});
}));

$$('[data-service-link]').forEach(btn => btn.addEventListener('click', () => {
  $('#serviceType').value = btn.dataset.serviceLink;
  $('#rfq').scrollIntoView({behavior:'smooth'});
}));

function formToLead(form) {
  return {
    company_name: form.companyName.value.trim(),
    contact_name: form.contactName.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    location: form.projectLocation.value.trim(),
    required_date: form.requiredDate.value || null,
    service_type: form.serviceType.value,
    package: form.packageType.value || null,
    message: form.message.value.trim(),
    source: 'borneohex.my',
    status: 'new',
    created_at_client: new Date().toISOString()
  };
}

async function saveLead(lead) {
  const configured = firebaseConfig.apiKey !== 'REPLACE_ME' && firebaseConfig.projectId !== 'REPLACE_ME';
  if (businessConfig.demoMode || !configured) {
    const saved = JSON.parse(localStorage.getItem('borneoHexDemoLeads') || '[]');
    saved.push({...lead, id: crypto.randomUUID()});
    localStorage.setItem('borneoHexDemoLeads', JSON.stringify(saved));
    return {demo:true};
  }

  const [{ initializeApp }, { getFirestore, collection, addDoc, serverTimestamp }] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js')
  ]);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  await addDoc(collection(db, 'leads'), {...lead, created_at: serverTimestamp()});
  return {demo:false};
}

const rfqForm = $('#rfqForm');
rfqForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const status = $('#formStatus');
  status.textContent = '';
  if ($('#website').value) return;
  if (!rfqForm.checkValidity()) {
    rfqForm.reportValidity();
    return;
  }

  const submit = $('button[type="submit"]', rfqForm);
  submit.disabled = true;
  submit.textContent = 'Menghantar…';
  try {
    const lead = formToLead(rfqForm);
    const result = await saveLead(lead);
    status.textContent = result.demo ? 'Disimpan dalam demo browser.' : 'RFQ berjaya dihantar.';
    status.style.color = '#18864b';

    const waText = `Hi BORNEO HEX, saya baru submit RFQ.\nCompany: ${lead.company_name}\nService: ${lead.service_type}\nPackage: ${lead.package || '-'}\nLocation: ${lead.location}\nRequirement: ${lead.message}`;
    if (businessConfig.whatsappNumber) whatsapp(waText);
    rfqForm.reset();
  } catch (err) {
    console.error(err);
    status.textContent = 'RFQ belum dapat dihantar. Sila cuba semula atau WhatsApp kami.';
    status.style.color = '#b42318';
  } finally {
    submit.disabled = false;
    submit.textContent = 'Hantar RFQ';
  }
});
