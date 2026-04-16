/* clients.js — Client Management */

let clientFilter = 'all';

function renderClients() {
    const el = document.getElementById('page-clients');
    if (!el) return;
    const filtered = clientFilter === 'all' ? clientsData : clientsData.filter(c => c.status === clientFilter);

    el.innerHTML = `
    <div class="p-8 space-y-6 fade-in">
        <div class="flex items-start justify-between gap-4 flex-wrap">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Client Management</h1>
                <p class="text-sm text-slate-400 mt-1">View and manage all ArcVis clients.</p>
            </div>
            <button onclick="openNewClientModal()" class="flex items-center gap-2 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">
                <iconify-icon icon="solar:add-circle-linear" width="16"></iconify-icon> New Client
            </button>
        </div>

        <!-- Filter tabs -->
        <div class="flex items-center gap-2">
            ${['all','active','pending','completed'].map(f => `
            <button onclick="clientFilter='${f}';renderClients()" class="text-xs font-bold px-4 py-2 rounded-xl transition-all ${clientFilter===f?'bg-[#003049] text-white':'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}">
                ${f.charAt(0).toUpperCase()+f.slice(1)} ${f==='all'?'('+clientsData.length+')':'('+clientsData.filter(c=>c.status===f).length+')'}
            </button>`).join('')}
        </div>

        <!-- Client cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            ${filtered.map(c => {
                const statusCls = c.status==='active'?'bg-emerald-100 text-emerald-700':c.status==='pending'?'bg-amber-100 text-amber-700':'bg-slate-100 text-slate-500';
                const projectCount = c.projects.length;
                return `
                <div class="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all">
                    <div class="flex items-start gap-4 mb-4">
                        <img src="${c.avatar}" class="w-12 h-12 rounded-xl bg-slate-100 shrink-0 object-cover border border-slate-100">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between gap-2">
                                <p class="text-sm font-bold text-slate-800 truncate">${c.name}</p>
                                <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${statusCls} shrink-0">${c.status.toUpperCase()}</span>
                            </div>
                            <p class="text-[10px] text-slate-400 mt-0.5">${c.type} Client · Since ${c.joinDate}</p>
                            <p class="text-[10px] text-slate-400">${c.email}</p>
                        </div>
                    </div>
                    <p class="text-[11px] text-slate-500 italic mb-4 line-clamp-2">"${c.notes}"</p>
                    <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                        <p class="text-[10px] text-slate-400"><iconify-icon icon="solar:folder-with-files-linear" width="12" class="mr-1"></iconify-icon>${projectCount} project${projectCount!==1?'s':''}</p>
                        <div class="flex gap-2">
                            <button onclick="openClientDetail('${c.id}')" class="text-[11px] font-bold text-[#00A3B4] border border-[#b2e8ed] px-3 py-1.5 rounded-lg hover:bg-[#e6f7f9] transition-all">View</button>
                            <button onclick="messageClient('${c.id}')" class="text-[11px] font-bold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all">Message</button>
                        </div>
                    </div>
                </div>`;
            }).join('')}
        </div>
    </div>

    <!-- New Client Modal -->
    <div id="new-client-modal" class="hidden fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl fade-in">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <p class="text-sm font-bold text-slate-800">New Client</p>
                <button onclick="document.getElementById('new-client-modal').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon></button>
            </div>
            <div class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2"><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Full Name / Company</label><input type="text" id="nc-name" placeholder="Juan dela Cruz"></div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Email</label><input type="email" id="nc-email" placeholder="client@email.com"></div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Phone</label><input type="text" id="nc-phone" placeholder="0917-XXX-XXXX"></div>
                    <div class="col-span-2"><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Address</label><input type="text" id="nc-addr" placeholder="Street, City"></div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Client Type</label>
                        <select id="nc-type"><option>New</option><option>Returning</option></select>
                    </div>
                </div>
                <button onclick="saveNewClient()" class="w-full text-white font-bold py-3 rounded-xl text-sm transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">Create Client</button>
            </div>
        </div>
    </div>

    <!-- Client Detail Modal -->
    <div id="client-detail-modal" class="hidden fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div id="client-detail-content" class="bg-white w-full max-w-lg rounded-2xl shadow-2xl fade-in overflow-y-auto" style="max-height:90vh"></div>
    </div>`;
}

function openNewClientModal() {
    document.getElementById('new-client-modal')?.classList.remove('hidden');
}

function saveNewClient() {
    const name  = document.getElementById('nc-name')?.value.trim();
    const email = document.getElementById('nc-email')?.value.trim();
    if (!name || !email) { showToast('Name and email are required.'); return; }
    const newId = 'CLI-' + String(clientsData.length + 1).padStart(3,'0');
    clientsData.push({
        id:newId, name, email,
        phone: document.getElementById('nc-phone')?.value.trim() || '—',
        address: document.getElementById('nc-addr')?.value.trim() || '—',
        type: document.getElementById('nc-type')?.value || 'New',
        avatar:`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        projects:[], status:'pending',
        joinDate: new Date().toLocaleDateString('en-US',{month:'short',year:'numeric'}),
        notes:'New client added by admin.',
    });
    document.getElementById('new-client-modal')?.classList.add('hidden');
    renderClients();
    showToast(`✅ Client "${name}" created.`);
}

function openClientDetail(id) {
    const c = clientsData.find(x => x.id === id);
    if (!c) return;
    const projs = adminProjects.filter(p => c.projects.includes(p.id));
    document.getElementById('client-detail-content').innerHTML = `
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <p class="text-sm font-bold text-slate-800">Client Profile</p>
            <button onclick="document.getElementById('client-detail-modal').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon></button>
        </div>
        <div class="p-6 space-y-5">
            <div class="flex items-center gap-4">
                <img src="${c.avatar}" class="w-16 h-16 rounded-2xl bg-slate-100 object-cover border border-slate-100 shrink-0">
                <div>
                    <p class="text-lg font-bold text-slate-800">${c.name}</p>
                    <p class="text-xs text-slate-400">${c.type} Client · ${c.email} · ${c.phone}</p>
                    <p class="text-xs text-slate-400 mt-0.5">${c.address}</p>
                </div>
            </div>
            <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Projects (${projs.length})</p>
                ${projs.length ? projs.map(p => `
                <div class="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                    <div>
                        <p class="text-xs font-bold text-slate-700">${p.name}</p>
                        <p class="text-[10px] text-slate-400">${p.id} · ${p.statusLabel}</p>
                    </div>
                    <div class="text-right">
                        <div class="progress-bar w-20"><div class="progress-fill" style="width:${p.progress}%"></div></div>
                        <p class="text-[9px] text-slate-400 mt-1">${p.progress}%</p>
                    </div>
                </div>`).join('') : '<p class="text-xs text-slate-400 italic">No projects yet.</p>'}
            </div>
            <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</p>
                <p class="text-xs text-slate-600 leading-relaxed italic">"${c.notes}"</p>
            </div>
            <div class="flex gap-3 pt-2">
                <button onclick="messageClient('${c.id}');document.getElementById('client-detail-modal').classList.add('hidden')" class="flex-1 text-white font-bold py-2.5 rounded-xl text-sm transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">
                    <iconify-icon icon="solar:chat-line-linear" width="14"></iconify-icon> Message
                </button>
                <button onclick="document.getElementById('client-detail-modal').classList.add('hidden')" class="flex-1 text-slate-600 font-bold py-2.5 rounded-xl text-sm border border-slate-200 hover:bg-slate-50 transition-all">Close</button>
            </div>
        </div>`;
    document.getElementById('client-detail-modal').classList.remove('hidden');
}

function messageClient(clientId) {
    const c = clientsData.find(x => x.id === clientId);
    if (!c) return;
    navigateTo('messages');
    const key = Object.keys(adminConversations).find(k => adminConversations[k].name === c.name);
    if (key) { adminActiveConv = key; renderMessages(key); }
}
