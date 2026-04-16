/* projects.js — Admin Project Management */

let adminProjTab = 'active';

function renderProjects() {
    const el = document.getElementById('page-projects');
    if (!el) return;

    const counts = {
        active:    adminProjects.filter(p => p.status==='active'||p.status==='review').length,
        new:       adminProjects.filter(p => p.status==='new').length,
        completed: adminProjects.filter(p => p.status==='completed').length,
    };

    el.innerHTML = `
    <div class="p-8 space-y-6 fade-in">
        <div class="flex items-start justify-between gap-4 flex-wrap">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Project Management</h1>
                <p class="text-sm text-slate-400 mt-1">Oversee all client projects, assign teams and advance milestones.</p>
            </div>
            <button onclick="openNewProjectModal()" class="flex items-center gap-2 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">
                <iconify-icon icon="solar:add-circle-linear" width="16"></iconify-icon> New Project
            </button>
        </div>

        <div class="flex items-center gap-1 border-b border-slate-200">
            ${['active','new','completed'].map(t => `
            <button onclick="adminProjTab='${t}';renderProjList()" id="aptab-${t}"
                class="px-5 py-2.5 text-sm font-bold -mb-px transition-all border-b-2 ${adminProjTab===t?'border-[#00A3B4] text-[#00A3B4]':'border-transparent text-slate-400 hover:text-slate-600'}">
                ${t==='active'?'Active':t==='new'?'New Orders':'Completed'}
                <span class="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${adminProjTab===t?'bg-[#e6f7f9] text-[#00A3B4]':'bg-slate-100 text-slate-500'}">${counts[t]}</span>
            </button>`).join('')}
        </div>

        <div id="admin-proj-list" class="space-y-4"></div>
    </div>

    <!-- Project Detail Modal -->
    <div id="admin-proj-modal" class="hidden fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div id="admin-proj-modal-content" class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl fade-in overflow-y-auto" style="max-height:92vh"></div>
    </div>

    <!-- New Project Modal -->
    <div id="new-proj-modal" class="hidden fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl fade-in">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <p class="text-sm font-bold text-slate-800">Create New Project</p>
                <button onclick="document.getElementById('new-proj-modal').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon></button>
            </div>
            <div class="p-6 space-y-4">
                <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Project Name</label><input type="text" id="np-name" placeholder="e.g. Modern Villa — Tagaytay"></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Client</label>
                        <select id="np-client">${clientsData.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select>
                    </div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Type</label>
                        <select id="np-type"><option>Residential</option><option>Commercial</option><option>Renovation</option></select>
                    </div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Lead</label>
                        <select id="np-lead">${usersData.filter(u=>u.status==='active').map(u=>`<option>${u.name}</option>`).join('')}</select>
                    </div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Due Date</label><input type="text" id="np-due" placeholder="e.g. Dec 31, 2026"></div>
                </div>
                <button onclick="saveNewProject()" class="w-full text-white font-bold py-3 rounded-xl text-sm transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">Create Project</button>
            </div>
        </div>
    </div>`;

    renderProjList();
}

function renderProjList() {
    const list = document.getElementById('admin-proj-list');
    if (!list) return;
    const items = adminProjTab === 'active'
        ? adminProjects.filter(p => p.status==='active'||p.status==='review')
        : adminProjects.filter(p => p.status === adminProjTab);

    if (!items.length) {
        list.innerHTML = `<div class="text-center py-16 text-slate-400"><iconify-icon icon="solar:folder-with-files-linear" width="40" class="mb-2"></iconify-icon><p class="text-sm">No ${adminProjTab} projects.</p></div>`;
        return;
    }

    const statusCls = { active:'text-emerald-700 bg-emerald-50 border-emerald-200', review:'text-[#003049] bg-[#e6f7f9] border-[#b2e8ed]', new:'text-amber-700 bg-amber-50 border-amber-200', completed:'text-slate-600 bg-slate-100 border-slate-200' };

    list.innerHTML = items.map(p => `
    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all">
        <div class="flex items-start gap-5 p-5 pb-4">
            <div class="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                <img src="${p.thumbnail}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<div class=\'w-full h-full bg-slate-200 flex items-center justify-center\'><iconify-icon icon=\'solar:buildings-3-bold\' class=\'text-slate-400\' width=\'24\'></iconify-icon></div>'">
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <h3 class="text-sm font-bold text-slate-800">${p.name}</h3>
                        <p class="text-[10px] text-slate-400 mt-0.5">${p.id} · ${p.clientName} · ${p.type}</p>
                        <p class="text-[10px] text-slate-400">Lead: <span class="font-semibold">${p.lead}</span> · Due: <span class="font-semibold">${p.dueDate}</span></p>
                    </div>
                    <span class="text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${statusCls[p.status]||statusCls.active}">${p.statusLabel}</span>
                </div>
                <div class="mt-3">
                    <div class="flex gap-0.5 mb-1.5">
                        ${p.milestones.map((_,i) => {
                            const done = i < p.completedMilestones;
                            const active = i === p.completedMilestones && p.status !== 'completed';
                            return `<div class="flex-1 h-1.5 rounded-full ${done?'bg-[#00A3B4]':active?'bg-[#F4A820]':'bg-slate-200'}"></div>`;
                        }).join('')}
                    </div>
                    <div class="flex justify-between text-[9px] text-slate-400">
                        <span>${p.milestones[p.completedMilestones]||'Handover'}</span>
                        <span>${p.progress}%</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex items-center gap-2 px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex-wrap">
            ${p.status === 'new' ? `
            <button onclick="acceptNewProject('${p.id}')" class="flex items-center gap-1.5 text-[11px] font-bold text-white px-3 py-2 rounded-xl transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">
                <iconify-icon icon="solar:check-circle-linear" width="13"></iconify-icon> Accept Order
            </button>` : ''}
            ${(p.status === 'active'||p.status==='review') ? `
            <button onclick="advanceMilestone('${p.id}')" class="flex items-center gap-1.5 text-[11px] font-bold text-[#00A3B4] border border-[#b2e8ed] px-3 py-2 rounded-xl hover:bg-[#e6f7f9] transition-all">
                <iconify-icon icon="solar:alt-arrow-right-linear" width="13"></iconify-icon> Advance Milestone
            </button>` : ''}
            <button onclick="openAdminProjDetail('${p.id}')" class="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-all ml-auto">
                <iconify-icon icon="solar:eye-linear" width="13"></iconify-icon> Details
            </button>
        </div>
    </div>`).join('');
}

function openNewProjectModal() {
    document.getElementById('new-proj-modal')?.classList.remove('hidden');
}

function saveNewProject() {
    const name = document.getElementById('np-name')?.value.trim();
    if (!name) { showToast('Project name is required.'); return; }
    const clientId = document.getElementById('np-client')?.value;
    const client   = clientsData.find(c => c.id === clientId);
    const newId    = 'ARC-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random()*900)+100);
    const newProj = {
        id:newId, name, clientId, clientName: client?.name || '—',
        type: document.getElementById('np-type')?.value || 'Residential',
        status:'new', statusLabel:'New Order',
        startDate:'—', dueDate: document.getElementById('np-due')?.value || '—',
        lead: document.getElementById('np-lead')?.value || '—', team:[],
        milestones:['Consultation','Design Dev','Working Drawings','3D Modeling','Rendering','Handover'],
        completedMilestones:0, progress:0, services:[], thumbnail:'',
        downpaymentPaid:false, finalPaymentPaid:false, notes:'',
    };
    adminProjects.push(newProj);
    if (client) client.projects.push(newId);
    document.getElementById('new-proj-modal')?.classList.add('hidden');
    adminProjTab = 'new'; renderProjects();
    showToast(`✅ Project "${name}" created.`);
}

function acceptNewProject(id) {
    const p = adminProjects.find(x => x.id === id);
    if (!p) return;
    p.status = 'active'; p.statusLabel = 'In Progress';
    p.startDate = new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    renderProjList();
    showToast(`Project "${p.name}" accepted and set to Active.`);
}

function advanceMilestone(id) {
    const p = adminProjects.find(x => x.id === id);
    if (!p) return;
    if (p.completedMilestones >= p.milestones.length) { showToast('All milestones already complete.'); return; }
    p.completedMilestones++;
    p.progress = Math.round((p.completedMilestones / p.milestones.length) * 100);
    if (p.completedMilestones === p.milestones.length) { p.status='completed'; p.statusLabel='Completed'; }
    else { p.status='active'; p.statusLabel='In Progress'; }
    renderProjList();
    showToast(`✅ Milestone advanced to "${p.milestones[p.completedMilestones]||'Handover'}".`);
}

function openAdminProjDetail(id) {
    const p = adminProjects.find(x => x.id === id);
    if (!p) return;
    const content = document.getElementById('admin-proj-modal-content');
    content.innerHTML = `
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <p class="text-sm font-bold text-slate-800">Project Details</p>
            <button onclick="document.getElementById('admin-proj-modal').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon></button>
        </div>
        <div class="p-6 space-y-5">
            <div class="flex items-start gap-4">
                <div class="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <img src="${p.thumbnail}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<div class=\'w-full h-full bg-slate-200 flex items-center justify-center\'><iconify-icon icon=\'solar:buildings-3-bold\' class=\'text-slate-400\' width=\'28\'></iconify-icon></div>'">
                </div>
                <div>
                    <p class="text-lg font-bold text-slate-800">${p.name}</p>
                    <p class="text-xs text-slate-400">${p.id} · ${p.clientName} · ${p.type}</p>
                    <p class="text-xs text-slate-400">Lead: ${p.lead} · Due: ${p.dueDate}</p>
                </div>
            </div>
            <!-- Milestones -->
            <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Milestone Progress</p>
                <div class="space-y-2">
                    ${p.milestones.map((m,i) => {
                        const done = i < p.completedMilestones;
                        const active = i === p.completedMilestones;
                        return `<div class="flex items-center gap-3">
                            <iconify-icon icon="${done?'solar:check-circle-bold':active?'solar:clock-circle-bold':'solar:circle-linear'}" style="color:${done?'#00A3B4':active?'#F4A820':'#cbd5e1'}" width="18" class="shrink-0"></iconify-icon>
                            <p class="text-xs font-${done||active?'bold':'normal'} ${done?'text-[#00A3B4]':active?'text-slate-800':'text-slate-400'}">${m}</p>
                            ${active && !done ? '<span class="ml-auto text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Current</span>' : ''}
                            ${done ? '<iconify-icon icon="solar:check-read-linear" class="ml-auto text-[#00A3B4]" width="14"></iconify-icon>' : ''}
                        </div>`;
                    }).join('')}
                </div>
            </div>
            <!-- Payment status -->
            <div class="grid grid-cols-2 gap-3">
                <div class="flex items-center gap-2 p-3 rounded-xl border ${p.downpaymentPaid?'bg-emerald-50 border-emerald-200':'bg-amber-50 border-amber-200'}">
                    <iconify-icon icon="${p.downpaymentPaid?'solar:check-circle-bold':'solar:clock-circle-bold'}" class="${p.downpaymentPaid?'text-emerald-500':'text-amber-500'}" width="16"></iconify-icon>
                    <div><p class="text-[10px] font-bold ${p.downpaymentPaid?'text-emerald-700':'text-amber-700'}">Downpayment</p><p class="text-[9px] ${p.downpaymentPaid?'text-emerald-600':'text-amber-600'}">${p.downpaymentPaid?'Paid':'Pending'}</p></div>
                </div>
                <div class="flex items-center gap-2 p-3 rounded-xl border ${p.finalPaymentPaid?'bg-emerald-50 border-emerald-200':'bg-slate-50 border-slate-200'}">
                    <iconify-icon icon="${p.finalPaymentPaid?'solar:check-circle-bold':'solar:lock-keyhole-linear'}" class="${p.finalPaymentPaid?'text-emerald-500':'text-slate-400'}" width="16"></iconify-icon>
                    <div><p class="text-[10px] font-bold ${p.finalPaymentPaid?'text-emerald-700':'text-slate-500'}">Final Payment</p><p class="text-[9px] ${p.finalPaymentPaid?'text-emerald-600':'text-slate-400'}">${p.finalPaymentPaid?'Paid':'Not yet'}</p></div>
                </div>
            </div>
            ${p.notes ? `<div class="bg-slate-50 rounded-xl px-4 py-3"><p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Notes</p><p class="text-xs text-slate-600 italic">"${p.notes}"</p></div>` : ''}
            <div class="flex gap-3">
                ${(p.status==='active'||p.status==='review') ? `<button onclick="advanceMilestone('${p.id}');document.getElementById('admin-proj-modal').classList.add('hidden')" class="flex-1 text-white font-bold py-2.5 rounded-xl text-sm transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">Advance Milestone</button>` : ''}
                <button onclick="document.getElementById('admin-proj-modal').classList.add('hidden')" class="flex-1 text-slate-600 font-bold py-2.5 rounded-xl text-sm border border-slate-200 hover:bg-slate-50 transition-all">Close</button>
            </div>
        </div>`;
    document.getElementById('admin-proj-modal').classList.remove('hidden');
}
