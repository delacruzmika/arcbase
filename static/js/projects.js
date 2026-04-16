/* projects.js — My Projects (active, pending, completed, view files, chat) */

const projectsData = [
    {
        id: 'ARC-2023-881', name: 'Modern Villa — Tagaytay', type: 'Residential',
        status: 'active', statusLabel: 'In Progress',
        statusColor: 'text-amber-600 bg-amber-50 border-amber-200',
        startDate: 'Oct 12', dueDate: '00/00/0000',
        thumbnail: '/static/photos/nimbus.png', assignedArchitect: 'arcbase',
        milestones: ['Consultation','Design Dev','Working Drawings','3D Modeling','Rendering','Handover'],
        currentMilestone: 1, completedMilestones: 1,
        currentDeliverable: { name: 'Floor_Plan_A1_v2.pdf', type: 'pdf', thumb: '/static/photos/wd.jpg', note: 'Floor plan revision 2 ready for your review. Please check the layout of the master bedroom wing.' },
        actions: [
            { label: 'View Files',     icon: 'solar:folder-open-linear',  fn: "openFilesModal('ARC-2023-881')" },
            { label: 'Chat w/ Architect', icon: 'solar:chat-line-linear', fn: "chatWithArchitect('arcbase')" },
        ],
        primaryAction: 'Approve Milestone',
        files: {
            renders: ['/static/photos/nimbus.png','/static/photos/resort.png'],
            blueprints: ['/static/photos/wd.jpg'],
            pdfs: [],
            vr: 'https://momento360.com/e/uc/1c498b5d6a534cd4b1e4e78e2ff37d41'
        }
    },
    {
        id: 'ARC-2023-902', name: 'Nimbus Bungalow — Batangas', type: 'Residential',
        status: 'active', statusLabel: 'Review Needed',
        statusColor: 'text-[#00A3B4] bg-[#e6f7f9] border-[#b2e8ed]',
        startDate: 'Nov 05', dueDate: 'Dec 20, 2023',
        thumbnail: '/static/photos/bungalow.png', assignedArchitect: 'design',
        milestones: ['Consultation','Design Dev','Working Drawings','3D Modeling','Rendering','Handover'],
        currentMilestone: 2, completedMilestones: 2,
        currentDeliverable: { name: 'Bungalow_Render_v1.jpg', type: 'render', thumb: '/static/photos/bungalow.png', note: 'Exterior render v1 is ready. Please review the roof pitch and east facade. Awaiting your approval or revision notes.' },
        actions: [
            { label: 'View Files',     icon: 'solar:folder-open-linear',  fn: "openFilesModal('ARC-2023-902')" },
            { label: 'Chat w/ Architect', icon: 'solar:chat-line-linear', fn: "chatWithArchitect('design')" },
        ],
        primaryAction: 'Review & Approve',
        files: {
            renders: ['/static/photos/bungalow.png'],
            blueprints: ['/static/photos/wd.jpg'],
            pdfs: [],
            vr: ''
        }
    },
    {
        id: 'ARC-2022-540', name: 'Velisara Resort — Palawan', type: 'Commercial',
        status: 'completed', statusLabel: 'Completed',
        statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        startDate: 'Jan 10', dueDate: 'Aug 30, 2022',
        thumbnail: '/static/photos/velisara.png', assignedArchitect: 'arcbase',
        milestones: ['Consultation','Design Dev','Working Drawings','3D Modeling','Rendering','Handover'],
        currentMilestone: 6, completedMilestones: 6,
        actions: [
            { label: 'View Files',      icon: 'solar:folder-open-linear',  fn: "openFilesModal('ARC-2022-540')" },
            { label: 'Download Report', icon: 'solar:download-linear',     fn: "downloadReport('ARC-2022-540')" },
        ],
        primaryAction: 'View Summary',
        files: {
            renders: ['/static/photos/velisara.png','/static/photos/resort.png'],
            blueprints: ['/static/photos/wd.jpg'],
            pdfs: [],
            vr: 'https://momento360.com/e/uc/1c498b5d6a534cd4b1e4e78e2ff37d41'
        }
    },
    {
        id: 'ARC-2022-411', name: 'Astra Tower — BGC', type: 'Commercial',
        status: 'completed', statusLabel: 'Completed',
        statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        startDate: 'Mar 01', dueDate: 'Sep 15, 2022',
        thumbnail: '/static/photos/astra.png', assignedArchitect: 'arcbase',
        milestones: ['Consultation','Design Dev','Working Drawings','3D Modeling','Rendering','Handover'],
        currentMilestone: 6, completedMilestones: 6,
        actions: [
            { label: 'View Files',      icon: 'solar:folder-open-linear',  fn: "openFilesModal('ARC-2022-411')" },
            { label: 'Download Report', icon: 'solar:download-linear',     fn: "downloadReport('ARC-2022-411')" },
        ],
        primaryAction: 'View Summary',
        files: {
            renders: ['/static/photos/astra.png'],
            blueprints: ['/static/photos/wd.jpg'],
            pdfs: [],
            vr: ''
        }
    },
];

// Pending projects come from submitted service orders
let pendingProjects = [];

let activeProjectTab = 'active';

function switchProjectTab(tab) {
    activeProjectTab = tab;
    ['active','pending','completed'].forEach(t => {
        const el = document.getElementById(`proj-tab-${t}`);
        if (!el) return;
        el.className = t === tab
            ? 'proj-tab px-5 py-2.5 text-sm font-bold -mb-px transition-all'
            : 'proj-tab px-5 py-2.5 text-sm font-bold text-slate-400 border-b-2 border-transparent -mb-px hover:text-slate-600 transition-all';
        if (t === tab) {
            el.style.color = '#00A3B4';
            el.style.borderBottom = '2px solid #00A3B4';
        } else {
            el.style.color = '';
            el.style.borderBottom = '';
        }
    });
    renderProjects(tab);
}

function renderProjects(tab) {
    const list = document.getElementById('projects-list');

    let items;
    if (tab === 'pending') {
        items = pendingProjects;
    } else {
        items = projectsData.filter(p => p.status === tab);
    }

    document.getElementById('proj-count-label').textContent =
        `Showing ${items.length} ${tab} project${items.length !== 1 ? 's' : ''}`;
    document.getElementById('active-count').textContent =
        projectsData.filter(p => p.status === 'active').length;
    const pendingEl = document.getElementById('pending-count');
    if (pendingEl) pendingEl.textContent = pendingProjects.length;

    if (items.length === 0) {
        const msgs = {
            active: 'No active projects yet.',
            pending: 'No pending projects. Submit a service order to get started.',
            completed: 'No completed projects yet.'
        };
        list.innerHTML = `<div class="text-center py-20 text-slate-300">
            <iconify-icon icon="solar:folder-with-files-linear" width="48" class="mb-3"></iconify-icon>
            <p class="text-sm font-semibold text-slate-400">${msgs[tab]}</p>
        </div>`;
        return;
    }

    list.innerHTML = items.map(p => renderProjectCard(p)).join('');
}

function renderProjectCard(p) {
    if (p.pending) {
        return `
        <div class="bg-white border-2 border-dashed border-amber-200 rounded-2xl p-6 flex items-center gap-5">
            <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <iconify-icon icon="solar:clock-circle-bold" class="text-amber-500" width="24"></iconify-icon>
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="text-sm font-bold text-slate-800">${p.name}</h3>
                <p class="text-xs text-slate-400 mt-0.5">Submitted ${p.submittedDate} · Awaiting initial consultation & downpayment</p>
            </div>
            <span class="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 shrink-0">Pending</span>
        </div>`;
    }

    const segmentsHtml = p.milestones.map((_, idx) => {
        const done   = idx < p.completedMilestones;
        const active = idx === p.completedMilestones && p.status === 'active';
        return `<div class="flex-1 h-1.5 rounded-full ${done ? 'bg-[#00A3B4]' : active ? 'bg-[#F4A820]' : 'bg-slate-200'} transition-all"></div>`;
    }).join('');

    const milestonesHtml = p.milestones.map((m, idx) => {
        const done   = idx < p.completedMilestones;
        const active = idx === p.completedMilestones && p.status === 'active';
        return `<div class="flex flex-col items-center gap-1 flex-1">
            <span class="text-[9px] font-bold whitespace-nowrap ${done ? 'text-[#00A3B4]' : active ? 'text-slate-700' : 'text-slate-300'}">${m}</span>
        </div>`;
    }).join('');

    const actionsHtml = p.actions.map(a => {
        const disabled = !a.fn;
        return `<button ${a.fn ? `onclick="${a.fn}"` : 'disabled'} class="flex items-center gap-1.5 text-[11px] font-semibold ${disabled ? 'text-slate-300 border-slate-100 cursor-not-allowed' : 'text-slate-500 hover:text-slate-800 border-slate-200 hover:bg-slate-50'} border bg-white px-3 py-2 rounded-xl transition-all">
            <iconify-icon icon="${a.icon}" width="14"></iconify-icon> ${a.label}
        </button>`;
    }).join('');

    // Annotate button only for active projects
    const annotateBtn = p.status === 'active'
        ? `<button onclick="openAnnotationModal('${p.id}','${p.name}')" class="flex items-center gap-1.5 text-[11px] font-semibold border px-3 py-2 rounded-xl transition-all" style="color:#00A3B4;border-color:#b2e8ed;background:rgba(0,163,180,.08)" onmouseenter="this.style.background='rgba(0,163,180,.15)'" onmouseleave="this.style.background='rgba(0,163,180,.08)'">
            <iconify-icon icon="solar:pen-2-linear" width="14"></iconify-icon> Annotate
           </button>`
        : '';

    const primaryBtnColor = p.statusLabel === 'Review Needed'
        ? 'bg-[#F77F00] hover:bg-[#e07000]'
        : p.status === 'completed'
        ? 'bg-[#003049] hover:bg-[#00A3B4]'
        : 'bg-[#003049] hover:bg-[#00A3B4]';

    const primaryFn = p.status === 'completed'
        ? `openViewSummary('${p.id}')`
        : (p.primaryAction === 'Approve Milestone' || p.primaryAction === 'Review & Approve')
        ? `openMilestoneApproval('${p.id}')`
        : '';

    return `
    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all">
        <div class="flex items-start gap-5 p-5 pb-4 cursor-pointer hover:bg-slate-50/50 transition-all" onclick="openProjectDetail('${p.id}')"  title="View project details">
            <div class="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                <img src="${p.thumbnail}" class="w-full h-full object-cover"
                     onerror="this.parentElement.innerHTML='<div class=\'w-full h-full bg-slate-200 flex items-center justify-center\'><iconify-icon icon=\'solar:buildings-3-bold\' class=\'text-slate-400\' width=\'24\'></iconify-icon></div>'">
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <h3 class="text-base font-bold text-slate-800">${p.name}</h3>
                        <p class="text-[11px] text-slate-400 mt-0.5">ID: #${p.id} · Started ${p.startDate}</p>
                        <p class="text-[11px] text-slate-400">Due Date: <span class="font-semibold text-slate-600">${p.dueDate}</span></p>
                    </div>
                    <span class="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full border ${p.statusColor}">${p.statusLabel}</span>
                </div>
            </div>
        </div>
        <div class="px-5 pb-3">
            <div class="flex gap-1 mb-2">${segmentsHtml}</div>
            <div class="flex justify-between">${milestonesHtml}</div>
        </div>
        <div class="flex items-center gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex-wrap">
            ${actionsHtml}
            ${annotateBtn}
            <button onclick="${primaryFn}" class="ml-auto flex items-center gap-2 ${primaryBtnColor} text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                <iconify-icon icon="solar:check-circle-linear" width="14"></iconify-icon>
                ${p.primaryAction}
            </button>
        </div>
    </div>`;
}

function chatWithArchitect(convId) {
    navigateTo('messages');
    setTimeout(() => selectConversation(convId), 150);
}

function downloadReport(projectId) {
    showToastMsg(`Preparing report for ${projectId}...`);
    setTimeout(() => showToastMsg('Report downloaded successfully!'), 1500);
}

function openViewSummary(projectId) {
    const p = projectsData.find(x => x.id === projectId);
    if (!p) return;
    const modal = document.getElementById('view-summary-modal');
    document.getElementById('vs-title').textContent = p.name;
    document.getElementById('vs-id').textContent    = p.id;
    document.getElementById('vs-type').textContent  = p.type;
    document.getElementById('vs-start').textContent = p.startDate;
    document.getElementById('vs-due').textContent   = p.dueDate;
    modal.classList.remove('hidden');
}

function closeViewSummary() {
    document.getElementById('view-summary-modal').classList.add('hidden');
}

/* ── Files Modal ── */
function openFilesModal(projectId) {
    const p = projectsData.find(x => x.id === projectId);
    if (!p) return;
    document.getElementById('files-modal-title').textContent = p.name;
    switchFileTab('renders', p);
    document.getElementById('files-modal').classList.remove('hidden');
    // store current project for tab switching
    document.getElementById('files-modal').setAttribute('data-project', projectId);
}

function closeFilesModal() {
    document.getElementById('files-modal').classList.add('hidden');
}

function switchFileTab(tab, project) {
    const pid = project || projectsData.find(p => p.id === document.getElementById('files-modal').getAttribute('data-project'));
    const p   = typeof pid === 'string' ? projectsData.find(x => x.id === pid) : pid;

    ['renders','blueprints','pdfs','vr'].forEach(t => {
        const btn = document.getElementById(`ftab-${t}`);
        if (btn) btn.className = `file-tab px-4 py-2 text-xs font-bold rounded-xl transition-all ${t === tab ? 'active' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`;
    });

    const content = document.getElementById('files-content');

    if (tab === 'renders') {
        const imgs = p.files.renders.length
            ? p.files.renders.map(src => `
                <div class="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    <img src="${src}" class="w-full object-cover" style="height:180px">
                    <div class="p-3 flex items-center justify-between">
                        <p class="text-xs font-semibold text-slate-600">Render Image</p>
                        <button class="text-[10px] font-bold text-[#00A3B4]">Download</button>
                    </div>
                </div>`).join('')
            : '<p class="text-sm text-slate-400 col-span-2 text-center py-12">No renders uploaded yet.</p>';
        content.innerHTML = `<div class="grid grid-cols-2 gap-4">${imgs}</div>`;
    }

    if (tab === 'blueprints') {
        const imgs = p.files.blueprints.length
            ? p.files.blueprints.map(src => `
                <div class="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                    <img src="${src}" class="w-full object-cover" style="height:180px; filter:grayscale(80%)">
                    <div class="p-3 flex items-center justify-between">
                        <p class="text-xs font-semibold text-slate-600">Blueprint / Floor Plan</p>
                        <button class="text-[10px] font-bold text-[#00A3B4]">Download</button>
                    </div>
                </div>`).join('')
            : '<p class="text-sm text-slate-400 col-span-2 text-center py-12">No blueprints uploaded yet.</p>';
        content.innerHTML = `<div class="grid grid-cols-2 gap-4">${imgs}</div>`;
    }

    if (tab === 'pdfs') {
        content.innerHTML = p.files.pdfs.length
            ? p.files.pdfs.map(f => `<div class="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl">
                <iconify-icon icon="solar:file-text-bold" class="text-[#00A3B4]" width="24"></iconify-icon>
                <span class="text-sm font-semibold text-slate-700 flex-1">${f}</span>
                <button class="text-[10px] font-bold text-[#00A3B4]">Download</button>
            </div>`).join('')
            : '<p class="text-sm text-slate-400 text-center py-12">No PDF documents uploaded yet.</p>';
    }

    if (tab === 'vr') {
        content.innerHTML = p.files.vr
            ? `<div class="rounded-2xl overflow-hidden border border-slate-100 h-72 bg-slate-900 flex flex-col items-center justify-center gap-4">
                <iconify-icon icon="solar:vr-bold" class="text-white" width="48"></iconify-icon>
                <p class="text-white font-bold">360° Virtual Tour</p>
                <a href="${p.files.vr}" target="_blank" class="bg-[#00A3B4] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#003049] transition-all">
                    Open 360° VR View
                </a>
              </div>`
            : '<p class="text-sm text-slate-400 text-center py-12">No VR tour available for this project yet.</p>';
    }
}

/* ── Milestone Approval Modal ── */
function openMilestoneApproval(projectId) {
    const p = projectsData.find(x => x.id === projectId);
    if (!p) return;
    const modal = document.getElementById('milestone-approval-modal');
    document.getElementById('ma-project-name').textContent = p.name;
    document.getElementById('ma-project-id').value = projectId;
    const ms = p.milestones[p.completedMilestones] || p.milestones[p.milestones.length - 1];
    document.getElementById('ma-milestone-name').textContent = ms;
    document.getElementById('ma-milestone-index').textContent = `Milestone ${p.completedMilestones + 1} of ${p.milestones.length}`;
    // Deliverable preview
    const del = p.currentDeliverable;
    const previewEl = document.getElementById('ma-deliverable-preview');
    if (del) {
        document.getElementById('ma-deliverable-name').textContent = del.name;
        document.getElementById('ma-deliverable-note').textContent = del.note;
        if (del.thumb) {
            previewEl.innerHTML = `<img src="${del.thumb}" class="w-full h-full object-cover rounded-xl">`;
        } else {
            previewEl.innerHTML = `<div class="flex flex-col items-center justify-center h-full gap-2 text-slate-400"><iconify-icon icon="solar:file-text-bold" width="40"></iconify-icon><p class="text-xs">${del.name}</p></div>`;
        }
    }
    // Reset state
    document.getElementById('ma-revision-form').classList.add('hidden');
    document.getElementById('ma-action-btns').classList.remove('hidden');
    document.getElementById('ma-revision-note').value = '';
    modal.classList.remove('hidden');
}

function closeMilestoneApproval() {
    document.getElementById('milestone-approval-modal').classList.add('hidden');
}

function confirmMilestoneApproval() {
    const projectId = document.getElementById('ma-project-id').value;
    const p = projectsData.find(x => x.id === projectId);
    if (!p) return;
    p.completedMilestones = Math.min(p.completedMilestones + 1, p.milestones.length);
    if (p.completedMilestones === p.milestones.length) {
        p.status = 'completed';
        p.statusLabel = 'Completed';
        p.statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
        p.primaryAction = 'View Summary';
    } else {
        p.statusLabel = 'In Progress';
        p.statusColor = 'text-amber-600 bg-amber-50 border-amber-200';
        p.primaryAction = 'Approve Milestone';
    }
    closeMilestoneApproval();
    renderProjects(activeProjectTab);
    showToastMsg('✅ Milestone approved! Your architect has been notified.');
}

function showMilestoneRevisionForm() {
    document.getElementById('ma-action-btns').classList.add('hidden');
    document.getElementById('ma-revision-form').classList.remove('hidden');
    document.getElementById('ma-revision-note').focus();
}

function submitMilestoneRevision() {
    const note = document.getElementById('ma-revision-note').value.trim();
    const projectId = document.getElementById('ma-project-id').value;
    if (!note) { showToastMsg('Please describe the changes you need.'); return; }
    const p = projectsData.find(x => x.id === projectId);
    if (p) {
        if (!annotationHistory[projectId]) annotationHistory[projectId] = [];
        const newId = 'ANN-' + String(Object.values(annotationHistory).flat().length + 1).padStart(3,'0');
        annotationHistory[projectId].unshift({
            id: newId,
            file: p.currentDeliverable ? p.currentDeliverable.name : 'Current Deliverable',
            note, priority: 'High', status: 'pending',
            date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
            response: ''
        });
        p.statusLabel = 'Review Needed';
        p.statusColor = 'text-[#00A3B4] bg-[#e6f7f9] border-[#b2e8ed]';
        p.primaryAction = 'Review & Approve';
    }
    closeMilestoneApproval();
    renderProjects(activeProjectTab);
    showToastMsg('📝 Revision request sent to your architect!');
}

/* ── Project Detail Page ── */
let currentDetailProjectId = null;

function openProjectDetail(projectId) {
    const p = projectsData.find(x => x.id === projectId);
    if (!p) return;
    currentDetailProjectId = projectId;
    const el = document.getElementById('page-project-detail');
    if (!el) return;

    // Hide projects list, show detail page
    document.getElementById('page-projects').classList.add('hidden');
    el.classList.remove('hidden');

    const msHtml = p.milestones.map((m, i) => {
        const done   = i < p.completedMilestones;
        const active = i === p.completedMilestones && p.status === 'active';
        const color  = done ? '#00A3B4' : active ? '#F4A820' : '#cbd5e1';
        const icon   = done ? 'solar:check-circle-bold' : active ? 'solar:clock-circle-bold' : 'solar:circle-linear';
        return `<div class="flex flex-col items-center gap-1 flex-1 min-w-0">
            <iconify-icon icon="${icon}" style="color:${color}" width="20"></iconify-icon>
            <p class="text-[9px] font-bold text-center leading-tight ${done?'text-[#00A3B4]':active?'text-slate-700':'text-slate-300'}">${m}</p>
        </div>` + (i < p.milestones.length - 1
            ? `<div class="flex-1 h-0.5 self-center mb-5 ${done?'bg-[#00A3B4]':'bg-slate-200'}" style="min-width:8px"></div>`
            : '');
    }).join('');

    const del = p.currentDeliverable;
    const delHtml = del ? `
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div class="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-[#00A3B4]">Current Deliverable</p>
                    <p class="text-sm font-bold text-slate-800 mt-0.5">${del.name}</p>
                </div>
                <span class="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700">Awaiting Approval</span>
            </div>
            <div class="p-5 flex gap-5">
                <div class="w-40 h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    ${del.thumb ? `<img src="${del.thumb}" class="w-full h-full object-cover">` : `<div class="w-full h-full flex items-center justify-center"><iconify-icon icon="solar:file-text-bold" class="text-slate-400" width="36"></iconify-icon></div>`}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs text-slate-500 leading-relaxed">${del.note}</p>
                    <div class="flex gap-2 mt-4">
                        <button onclick="openMilestoneApproval('${p.id}')" class="flex items-center gap-2 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">
                            <iconify-icon icon="solar:check-circle-linear" width="14"></iconify-icon> Approve / Request Revision
                        </button>
                        <button onclick="openAnnotationModal('${p.id}','${p.name}')" class="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border transition-all" style="color:#00A3B4;border-color:#b2e8ed;background:rgba(0,163,180,.08)">
                            <iconify-icon icon="solar:pen-2-linear" width="14"></iconify-icon> Annotate
                        </button>
                    </div>
                </div>
            </div>
        </div>` : `<div class="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-sm">No deliverable pending review.</div>`;

    const histHtml = (annotationHistory[p.id] || []).length > 0
        ? renderAnnotationHistoryHTML(p.id)
        : '<p class="text-xs text-slate-400 italic text-center py-4">No revision requests submitted yet.</p>';

    el.innerHTML = `
    <div class="p-8 space-y-6 fade-in">
        <!-- Back nav -->
        <button onclick="closeProjectDetail()" class="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-all">
            <iconify-icon icon="solar:alt-arrow-left-linear" width="16"></iconify-icon> Back to My Projects
        </button>
        <!-- Header -->
        <div class="flex items-start gap-5">
            <div class="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                <img src="${p.thumbnail}" class="w-full h-full object-cover" onerror="this.parentElement.innerHTML='<div class=\'w-full h-full bg-slate-200 flex items-center justify-center\'><iconify-icon icon=\'solar:buildings-3-bold\' class=\'text-slate-400\' width=\'28\'></iconify-icon></div>'">
            </div>
            <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                        <h1 class="text-xl font-bold text-slate-800">${p.name}</h1>
                        <p class="text-xs text-slate-400 mt-0.5">ID: #${p.id} · ${p.type} · Started ${p.startDate}</p>
                    </div>
                    <span class="text-[10px] font-bold px-3 py-1 rounded-full border ${p.statusColor}">${p.statusLabel}</span>
                </div>
                <p class="text-xs text-slate-500 mt-2">Due: <span class="font-semibold text-slate-700">${p.dueDate}</span></p>
            </div>
        </div>
        <!-- Milestone timeline -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5">
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Project Timeline</p>
            <div class="flex items-start gap-0">${msHtml}</div>
        </div>
        <!-- Current deliverable -->
        ${delHtml}
        <!-- Revision history -->
        <div class="bg-white border border-slate-200 rounded-2xl">
            <div class="p-5 border-b border-slate-100">
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Revision History</p>
            </div>
            <div class="p-5 space-y-3">${histHtml}</div>
        </div>
        <!-- Actions row -->
        <div class="flex gap-3 flex-wrap">
            <button onclick="openFilesModal('${p.id}')" class="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                <iconify-icon icon="solar:folder-open-linear" width="14"></iconify-icon> View All Files
            </button>
            <button onclick="chatWithArchitect('${p.assignedArchitect}')" class="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                <iconify-icon icon="solar:chat-line-linear" width="14"></iconify-icon> Message Architect
            </button>
            <button onclick="downloadReport('${p.id}')" class="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                <iconify-icon icon="solar:download-linear" width="14"></iconify-icon> Download Report
            </button>
        </div>
    </div>`;
}

function renderAnnotationHistoryHTML(projectId) {
    const history = annotationHistory[projectId] || [];
    const statusCfg = {
        pending:    { cls:'bg-amber-100 text-amber-700',     icon:'solar:clock-circle-linear',  label:'Pending' },
        'in-review':{ cls:'bg-sky-100 text-sky-700',         icon:'solar:eye-linear',           label:'In Review' },
        resolved:   { cls:'bg-emerald-100 text-emerald-700', icon:'solar:check-circle-linear',  label:'Resolved' },
    };
    const prioColor = { High:'text-[#F77F00]', Medium:'text-amber-500', Low:'text-slate-400' };
    return history.map(a => {
        const s = statusCfg[a.status] || statusCfg.pending;
        return `<div class="border border-slate-100 rounded-xl p-3 space-y-2 bg-slate-50/50">
            <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                    <p class="text-[11px] font-bold text-slate-700 truncate">${a.file}</p>
                    <p class="text-[10px] text-slate-400">${a.id} · ${a.date} · <span class="${prioColor[a.priority]} font-semibold">${a.priority}</span></p>
                </div>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${s.cls} shrink-0 flex items-center gap-1">
                    <iconify-icon icon="${s.icon}" width="9"></iconify-icon> ${s.label}
                </span>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed italic">"${a.note}"</p>
            ${a.response ? `<div class="flex items-start gap-1.5 border-t border-slate-200 pt-2"><iconify-icon icon="solar:reply-linear" class="text-[#00A3B4] shrink-0 mt-0.5" width="12"></iconify-icon><p class="text-[10px] text-slate-500">${a.response}</p></div>` : ''}
        </div>`;
    }).join('');
}

function closeProjectDetail() {
    document.getElementById('page-project-detail').classList.add('hidden');
    document.getElementById('page-projects').classList.remove('hidden');
    navigateTo('projects');
}

function launch360(triggerOrId) {
    const btn = typeof triggerOrId === 'string'
        ? document.querySelector(`[onclick="launch360('${triggerOrId}')"]`)
        : triggerOrId;
    // Find project for this button by walking up to the card
    const card = btn ? btn.closest('.bg-white') : null;
    const projectId = card ? card.querySelector('[onclick*="openFilesModal"]')
        ?.getAttribute('onclick')?.match(/"([^"]+)"/)?.[1] : null;
    if (projectId) {
        const p = projectsData.find(x => x.id === projectId);
        if (p && p.files.vr) { window.open(p.files.vr, '_blank'); return; }
    }
    showToastMsg('No 360° VR tour available for this project yet.');
}

// ── Annotation history per project ──────────────────────────────────────────
const annotationHistory = {
    'ARC-2023-881': [
        { id:'ANN-001', file:'Exterior_Render_v2.jpg', note:'Please change the balcony glass from tinted to clear glass — it looks too dark.', priority:'High', status:'resolved', date:'Jan 14, 2024', response:'Updated in Render v3 — clear glass applied to all balcony panels.' },
        { id:'ANN-002', file:'Interior_Kitchen.jpg', note:'Countertop color should be dark marble, not white quartz.', priority:'Medium', status:'pending', date:'Jan 18, 2024', response:'' },
    ],
    'ARC-2023-902': [
        { id:'ANN-003', file:'Bungalow_Render_v1.jpg', note:'The roof pitch looks too steep compared to the approved plan.', priority:'High', status:'in-review', date:'Nov 22, 2023', response:'Checking with structural team — will update by Friday.' },
    ],
};

function openAnnotationModal(projectId, projectName) {
    const modal = document.getElementById('project-annotation-modal');
    if (!modal) return;
    document.getElementById('ann-modal-project-name').textContent = projectName;
    document.getElementById('ann-modal-project-id').value = projectId;
    document.getElementById('ann-modal-file').value = '';
    document.getElementById('ann-modal-note').value = '';
    // Render history
    renderAnnotationHistory(projectId);
    modal.classList.remove('hidden');
}

function renderAnnotationHistory(projectId) {
    const container = document.getElementById('ann-history-list');
    if (!container) return;
    const history = annotationHistory[projectId] || [];
    const statusCfg = {
        pending:   { cls:'bg-amber-100 text-amber-700',   icon:'solar:clock-circle-linear',    label:'Pending' },
        'in-review':{ cls:'bg-sky-100 text-sky-700',      icon:'solar:eye-linear',              label:'In Review' },
        resolved:  { cls:'bg-emerald-100 text-emerald-700', icon:'solar:check-circle-linear',   label:'Resolved' },
    };
    const prioColor = { High:'text-[#00A3B4]', Medium:'text-amber-600', Low:'text-slate-400' };
    if (history.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 italic text-center py-4">No annotations yet for this project.</p>';
        return;
    }
    container.innerHTML = history.map(a => {
        const s = statusCfg[a.status] || statusCfg.pending;
        return `<div class="border border-slate-100 rounded-xl p-3 space-y-2 bg-slate-50/50">
            <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                    <p class="text-[11px] font-bold text-slate-700 truncate">${a.file}</p>
                    <p class="text-[10px] text-slate-400">${a.id} · ${a.date} · <span class="${prioColor[a.priority]} font-semibold">${a.priority}</span></p>
                </div>
                <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${s.cls} shrink-0 flex items-center gap-1">
                    <iconify-icon icon="${s.icon}" width="9"></iconify-icon> ${s.label}
                </span>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed italic">"${a.note}"</p>
            ${a.response ? `<div class="flex items-start gap-1.5 border-t border-slate-200 pt-2">
                <iconify-icon icon="solar:reply-linear" class="text-[#00A3B4] shrink-0 mt-0.5" width="12"></iconify-icon>
                <p class="text-[10px] text-slate-500">${a.response}</p>
            </div>` : ''}
        </div>`;
    }).join('');
}

function closeAnnotationModal() {
    document.getElementById('project-annotation-modal').classList.add('hidden');
}

function submitProjectAnnotation() {
    const file = document.getElementById('ann-modal-file').value.trim();
    const note = document.getElementById('ann-modal-note').value.trim();
    const priority = document.querySelector('input[name="ann-modal-priority"]:checked')?.value || 'Low';
    const projectId = document.getElementById('ann-modal-project-id').value;
    if (!file || !note) { showToastMsg('Please fill in the file name and your annotation.'); return; }
    if (!annotationHistory[projectId]) annotationHistory[projectId] = [];
    const newId = 'ANN-' + String(Object.values(annotationHistory).flat().length + 1).padStart(3,'0');
    annotationHistory[projectId].unshift({ id: newId, file, note, priority, status:'pending',
        date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), response:'' });
    closeAnnotationModal();
    showToastMsg('📝 Revision request submitted! Your architect will review it shortly.');
}
