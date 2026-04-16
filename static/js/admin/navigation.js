/* navigation.js — Admin sidebar routing */

const adminPages = [
    'dashboard','clients','projects','deliverables','revisions',
    'invoices','users','scheduling','bom','filevault','messages','notifications','settings'
];

function navigateTo(page) {
    adminPages.forEach(p => {
        const el = document.getElementById(`page-${p}`);
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(`page-${page}`);
    if (target) target.classList.remove('hidden');

    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(el => {
        const isActive = el.id === `nav-${page}`;
        el.className = 'nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ' +
            (isActive ? 'text-[#00A3B4] bg-[#e6f7f9]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50');
    });

    closeSidebar();

    // Render functions
    const renders = {
        dashboard:     renderDashboard,
        clients:       renderClients,
        projects:      renderProjects,
        deliverables:  renderDeliverables,
        revisions:     renderRevisions,
        invoices:      renderInvoices,
        users:         renderUsers,
        scheduling:    renderScheduling,
        bom:           renderBOM,
        filevault:     renderFileVault,
        messages:      () => renderMessages(Object.keys(adminConversations)[0]),
        notifications: renderAdminNotifications,
        settings:      renderSettings,
    };
    if (renders[page]) renders[page]();
}

function handleSearch(q) {
    if (!q.trim()) return;
    showToast(`Searching for "${q}"…`);
}
