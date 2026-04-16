/* users.js — User / Employee Account Management */

function renderUsers() {
    const el = document.getElementById('page-users');
    if (!el) return;

    el.innerHTML = `
    <div class="p-8 space-y-6 fade-in">
        <div class="flex items-start justify-between gap-4 flex-wrap">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">User Accounts</h1>
                <p class="text-sm text-slate-400 mt-1">Manage employee and admin accounts.</p>
            </div>
            <button onclick="openNewUserModal()" class="flex items-center gap-2 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">
                <iconify-icon icon="solar:add-circle-linear" width="16"></iconify-icon> Add User
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            ${usersData.map(u => {
                const statusCls = u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500';
                return `
                <div class="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all">
                    <div class="flex items-start gap-4">
                        <img src="${u.avatar}" class="w-12 h-12 rounded-xl bg-slate-100 object-cover border border-slate-100 shrink-0">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between gap-2">
                                <div>
                                    <p class="text-sm font-bold text-slate-800">${u.name}</p>
                                    <p class="text-[10px] text-slate-400 mt-0.5">${u.role} · ${u.dept}</p>
                                    <p class="text-[10px] text-slate-400">${u.email}</p>
                                </div>
                                <span class="text-[9px] font-bold px-2 py-0.5 rounded-full ${statusCls} shrink-0">${u.status.toUpperCase()}</span>
                            </div>
                            <div class="flex flex-wrap gap-1 mt-2">
                                ${u.skills.map(s => `<span class="text-[9px] px-2 py-0.5 rounded-full bg-[#e6f7f9] text-[#003049] font-semibold">${s}</span>`).join('')}
                            </div>
                            <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                <p class="text-[10px] text-slate-400">${u.assignedProjects.length} active project${u.assignedProjects.length!==1?'s':''}</p>
                                <div class="flex gap-2">
                                    <button onclick="toggleUserStatus('${u.id}')" class="text-[11px] font-bold ${u.status==='active'?'text-slate-400 hover:text-red-500':'text-emerald-600 hover:text-emerald-700'} transition-colors">${u.status==='active'?'Deactivate':'Activate'}</button>
                                    <button onclick="openEditUser('${u.id}')" class="text-[11px] font-bold text-[#00A3B4] border border-[#b2e8ed] px-3 py-1.5 rounded-lg hover:bg-[#e6f7f9] transition-all">Edit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
            }).join('')}
        </div>
    </div>

    <!-- New User Modal -->
    <div id="new-user-modal" class="hidden fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl fade-in">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <p class="text-sm font-bold text-slate-800">Add New User</p>
                <button onclick="document.getElementById('new-user-modal').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon></button>
            </div>
            <div class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2"><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Full Name</label><input type="text" id="nu-name" placeholder="Sarah Lim"></div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Email</label><input type="email" id="nu-email" placeholder="sarah@arcbase.ph"></div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Role</label><input type="text" id="nu-role" placeholder="Senior Architect"></div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Department</label>
                        <select id="nu-dept"><option>Design</option><option>CAD</option><option>Visualization</option><option>Admin</option></select>
                    </div>
                </div>
                <button onclick="saveNewUser()" class="w-full text-white font-bold py-3 rounded-xl text-sm transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">Create Account</button>
            </div>
        </div>
    </div>`;
}

function openNewUserModal() { document.getElementById('new-user-modal')?.classList.remove('hidden'); }

function saveNewUser() {
    const name  = document.getElementById('nu-name')?.value.trim();
    const email = document.getElementById('nu-email')?.value.trim();
    if (!name || !email) { showToast('Name and email are required.'); return; }
    usersData.push({
        id:'EMP-' + String(usersData.length+1).padStart(3,'0'),
        name, email, role: document.getElementById('nu-role')?.value||'Staff',
        dept: document.getElementById('nu-dept')?.value||'Design',
        phone:'—', avatar:`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        status:'active', joinDate: new Date().toLocaleDateString('en-US',{month:'short',year:'numeric'}),
        assignedProjects:[], skills:[],
    });
    document.getElementById('new-user-modal')?.classList.add('hidden');
    renderUsers(); showToast(`✅ Account for "${name}" created.`);
}

function toggleUserStatus(id) {
    const u = usersData.find(x => x.id === id);
    if (!u) return;
    u.status = u.status === 'active' ? 'inactive' : 'active';
    renderUsers(); showToast(`User "${u.name}" ${u.status === 'active' ? 'activated' : 'deactivated'}.`);
}

function openEditUser(id) {
    const u = usersData.find(x => x.id === id);
    if (u) showToast(`Edit for ${u.name} — coming soon.`);
}
