/* settings.js — Settings page + global toast */

const settingsSections = ['personal','security','notifications-pref','billing','privacy','language'];

function switchSettingsSection(section) {
    settingsSections.forEach(s => {
        document.getElementById(`ssec-${s}`).classList.add('hidden');
        const tab = document.getElementById(`stab-${s}`);
        if (!tab) return;
        tab.className = 'settings-tab w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all text-left';
        tab.style.background=''; tab.style.color='';
        const wrap = tab.querySelector('div');
        if (wrap) {
            wrap.className = 'w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0';
            const ico = wrap.querySelector('iconify-icon');
            if (ico) ico.className = 'text-slate-500';
        }
    });
    document.getElementById(`ssec-${section}`).classList.remove('hidden');
    const active = document.getElementById(`stab-${section}`);
    if (active) {
        active.className = 'settings-tab w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all text-left'; active.style.background='#003049'; active.style.color='white';
        const wrap = active.querySelector('div');
        if (wrap) {
            wrap.className = 'w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0';
            const ico = wrap.querySelector('iconify-icon');
            if (ico) ico.className = '';
        }
    }
}

function toggle2FA(btn) {
    const on = btn.getAttribute('data-on') === 'true';
    btn.setAttribute('data-on', !on);
    btn.className = `relative w-11 h-6 ${!on ? 'bg-emerald-500' : 'bg-slate-200'} rounded-full transition-all`;
    btn.querySelector('span').className = `absolute top-1 ${!on ? 'left-6' : 'left-1'} w-4 h-4 bg-white rounded-full shadow transition-all`;
}

function checkPassStrength() {
    const val   = document.getElementById('s-newpass').value;
    const bars  = [1,2,3,4].map(i => document.getElementById(`ps-bar-${i}`));
    const label = document.getElementById('ps-label');
    let score = 0;
    if (val.length >= 8)          score++;
    if (/[A-Z]/.test(val))        score++;
    if (/[0-9]/.test(val))        score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const colors     = ['bg-[#F77F00]','bg-amber-400','bg-amber-400','bg-emerald-500'];
    const labels     = ['','Weak','Fair','Strong','Very Strong'];
    const textColors = ['','text-[#00A3B4]','text-amber-500','text-amber-500','text-emerald-600'];
    bars.forEach((b, i) => { b.className = `flex-1 h-1 rounded-full transition-all ${i < score ? colors[score-1] : 'bg-slate-100'}`; });
    label.textContent = val.length === 0 ? 'Password strength' : (labels[score] || 'Weak');
    label.className   = `text-[10px] mt-1 ${val.length === 0 ? 'text-slate-400' : (textColors[score] || 'text-[#00A3B4]')}`;
}

function previewAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        // Update settings page avatar
        document.getElementById('settings-avatar-img').src = e.target.result;
        // Update header avatar
        const headerAvatar = document.getElementById('header-avatar-img');
        if (headerAvatar) headerAvatar.src = e.target.result;
        // Update profile dropdown avatar
        const dropAvatar = document.getElementById('profile-dropdown-avatar');
        if (dropAvatar) dropAvatar.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function saveSettingsToast(section) {
    showToastMsg(`${section} saved successfully!`);
}

function savePersonalInfo() {
    const first = document.querySelector('#ssec-personal input[placeholder="Juan"]')?.value || document.querySelectorAll('#ssec-personal input[type=text]')[0]?.value || 'Juan';
    const last  = document.querySelector('#ssec-personal input[placeholder="dela Cruz"]')?.value || document.querySelectorAll('#ssec-personal input[type=text]')[1]?.value || 'dela Cruz';
    const full  = `${first} ${last}`.trim();
    // Update header display name
    const nameEl = document.getElementById('header-profile-name');
    if (nameEl) nameEl.textContent = full;
    // Update profile dropdown name
    const dropName = document.getElementById('profile-dropdown-name');
    if (dropName) dropName.textContent = full;
    showToastMsg('Personal Information saved successfully!');
}

/* ── Global Toast ── */
function showToast() { showToastMsg('Service Order Submitted Successfully!'); }

function showToastMsg(msg) {
    const toast = document.getElementById('toast');
    const span  = toast.querySelector('span');
    span.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3500);
}

/* ── Portfolio Modal ── */
const portfolioData = {
    'Astra':     { subtitle: 'Astra Tower, BGC', renders: ['/static/photos/astra.png'], blueprints: ['/static/photos/wd.jpg'], vr: '' },
    'Nimbus':    { subtitle: 'Nimbus Bungalow, Batangas', renders: ['/static/photos/nimbus.png'], blueprints: ['/static/photos/wd.jpg'], vr: '' },
    'Bungalow':  { subtitle: 'Modern Bungalow', renders: ['/static/photos/bungalow.png'], blueprints: ['/static/photos/wd.jpg'], vr: '' },
    'Velisara':  { subtitle: 'Velisara Resort, Palawan', renders: ['/static/photos/velisara.png','/static/photos/resort.png'], blueprints: ['/static/photos/wd.jpg'], vr: 'https://momento360.com/e/uc/1c498b5d6a534cd4b1e4e78e2ff37d41' },
    'Resort':    { subtitle: 'Beach Resort Project', renders: ['/static/photos/resort.png'], blueprints: ['/static/photos/wd.jpg'], vr: '' },
    'Panasahan': { subtitle: 'Panasahan Estate', renders: ['/static/photos/panasahan.png'], blueprints: ['/static/photos/wd.jpg'], vr: '' },
};

function openPortfolioModal(name) {
    const data = portfolioData[name];
    if (!data) return;
    document.getElementById('portfolio-modal-title').textContent    = name;
    document.getElementById('portfolio-modal-subtitle').textContent = data.subtitle;
    document.getElementById('portfolio-modal').classList.remove('hidden');
    switchPortfolioTab('renders', data);
    document.getElementById('portfolio-modal').setAttribute('data-project', name);
}

function closePortfolioModal() { document.getElementById('portfolio-modal').classList.add('hidden'); }

function switchPortfolioTab(tab, dataOverride) {
    const name = document.getElementById('portfolio-modal').getAttribute('data-project');
    const data = dataOverride || portfolioData[name];

    ['renders','blueprints','vr'].forEach(t => {
        const btn = document.getElementById(`ptab-${t}`);
        if (btn) btn.className = `file-tab px-4 py-2 text-xs font-bold rounded-xl transition-all ${t === tab ? 'active' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`;
    });

    const content = document.getElementById('portfolio-content');

    if (tab === 'renders') {
        content.innerHTML = `<div class="grid grid-cols-2 gap-4">${data.renders.map(src =>
            `<div class="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <img src="${src}" class="w-full object-cover" style="height:180px">
             </div>`).join('')}</div>`;
    }
    if (tab === 'blueprints') {
        content.innerHTML = `<div class="grid grid-cols-2 gap-4">${data.blueprints.map(src =>
            `<div class="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <img src="${src}" class="w-full object-cover" style="height:180px; filter:grayscale(80%)">
             </div>`).join('')}</div>`;
    }
    if (tab === 'vr') {
        content.innerHTML = data.vr
            ? `<div class="rounded-2xl overflow-hidden border border-slate-100 h-72 bg-slate-900 flex flex-col items-center justify-center gap-4">
                <iconify-icon icon="solar:vr-bold" class="text-white" width="48"></iconify-icon>
                <p class="text-white font-bold">360° Virtual Tour</p>
                <a href="${data.vr}" target="_blank" class="bg-[#00A3B4] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#003049] transition-all">Open 360° VR View</a>
               </div>`
            : '<p class="text-sm text-slate-400 text-center py-12">No VR tour available for this project.</p>';
    }
}

/* ── Service Order → adds to Pending Projects ── */
function submitServiceOrder() {
    const catInput = document.querySelector('input[name="project_cat"]:checked');
    const category = catInput ? catInput.value : 'Residential';
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (typeof pendingProjects !== 'undefined') {
        pendingProjects.push({
            id: `ARC-PENDING-${Date.now()}`,
            name: `New ${category} Project`,
            pending: true,
            submittedDate: dateStr,
        });
        const badge = document.getElementById('pending-count');
        if (badge) badge.textContent = pendingProjects.length;
    }
}
