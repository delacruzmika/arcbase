/* navigation.js — Sidebar routing, collapsible sidebar, mobile */

let sidebarCollapsed = false;

function toggleSidebar() {
    const sidebar  = document.getElementById('main-sidebar');
    const overlay  = document.getElementById('sidebar-overlay');
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('active');
    } else {
        sidebarCollapsed = !sidebarCollapsed;
        sidebar.classList.toggle('collapsed', sidebarCollapsed);
    }
}

function closeSidebar() {
    document.getElementById('main-sidebar').classList.remove('mobile-open');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

function navigateTo(page) {
    ['home','services','messages','notifications','invoices','projects','project-detail','settings','filevault','revisions','help'].forEach(p => {
        const el = document.getElementById(`page-${p}`);
        if (el) el.classList.add('hidden');
    });
    document.getElementById(`page-${page}`).classList.remove('hidden');

    const navIds = {
        home:'nav-home', services:'nav-services', messages:'nav-messages',
        notifications:'nav-notifications', invoices:'nav-invoices',
        projects:'nav-projects', settings:'nav-settings',
        filevault:'nav-filevault', help:'nav-help'
    };
    Object.entries(navIds).forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.className = 'nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ' +
            (key === page ? 'text-[#00A3B4] bg-[#e6f7f9]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50');
    });

    if (typeof updateBottomNav === 'function') updateBottomNav(page);
    closeSidebar();

    if (page === 'messages')      renderMessages('arcbase');
    if (page === 'notifications') renderNotifications('all');
    if (page === 'invoices')      { renderInvoiceTable(); refreshInvoiceSummary(); }
    if (page === 'projects')      renderProjects(typeof activeProjectTab !== 'undefined' ? activeProjectTab : 'active');
    if (page === 'settings')      switchSettingsSection('personal');
    if (page === 'filevault')     { renderVault(); }
    if (page === 'help')          { if (typeof renderHelpPage === 'function') renderHelpPage(); }
}

// Search in header
function handleSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) return;

    // Search projects
    const projectMatch = typeof projectsData !== 'undefined'
        ? projectsData.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
        : [];

    // If matches, navigate to projects and show results
    if (projectMatch.length) {
        navigateTo('projects');
        const list = document.getElementById('projects-list');
        list.innerHTML = projectMatch.map(p => renderProjectCard(p)).join('');
        document.getElementById('proj-count-label').textContent = `${projectMatch.length} result(s) for "${query}"`;
        return;
    }

    showToast(`No results for "${query}"`);
}
