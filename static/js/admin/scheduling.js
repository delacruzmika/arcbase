/* scheduling.js — Admin Scheduling & Calendar */

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
let schedCalYear  = 2026;
let schedCalMonth = 2; // 0-indexed, March

function renderScheduling() {
    const el = document.getElementById('page-scheduling');
    if (!el) return;

    const upcoming = schedulingEvents.filter(e => e.status === 'upcoming').sort((a,b) => a.date.localeCompare(b.date));
    const past     = schedulingEvents.filter(e => e.status === 'done');

    const typeCfg = {
        consultation: { color:'bg-[#003049]',  icon:'solar:users-group-rounded-bold', label:'Consultation' },
        meeting:      { color:'bg-[#00A3B4]',  icon:'solar:video-frame-bold',         label:'Meeting' },
        deadline:     { color:'bg-[#F77F00]',  icon:'solar:flag-bold',                label:'Deadline' },
    };

    // Build calendar grid
    const firstDay = new Date(schedCalYear, schedCalMonth, 1).getDay();
    const daysInMonth = new Date(schedCalYear, schedCalMonth + 1, 0).getDate();
    const todayStr = `${schedCalYear}-${String(schedCalMonth+1).padStart(2,'0')}-${String(new Date().getDate()).padStart(2,'0')}`;

    let calCells = '';
    for (let i = 0; i < firstDay; i++) calCells += `<div></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${schedCalYear}-${String(schedCalMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const dayEvents = schedulingEvents.filter(e => e.date === dateStr);
        const isToday   = dateStr === `2026-03-22`;
        calCells += `
        <div class="min-h-[72px] p-1.5 rounded-xl border ${isToday ? 'border-[#00A3B4] bg-[#f0fbfc]' : 'border-transparent hover:bg-slate-50'} transition-all">
            <p class="text-[11px] font-bold ${isToday ? 'text-[#00A3B4]' : 'text-slate-500'} mb-1">${d}</p>
            ${dayEvents.map(ev => {
                const t = typeCfg[ev.type] || typeCfg.meeting;
                return `<div class="text-[9px] font-bold text-white px-1.5 py-0.5 rounded mb-0.5 truncate ${t.color}" title="${ev.title}">${ev.title}</div>`;
            }).join('')}
        </div>`;
    }

    el.innerHTML = `
    <div class="p-8 space-y-6 fade-in">
        <div class="flex items-start justify-between gap-4 flex-wrap">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Scheduling</h1>
                <p class="text-sm text-slate-400 mt-1">Manage consultations, meetings and project deadlines.</p>
            </div>
            <button onclick="openNewEventModal()" class="flex items-center gap-2 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">
                <iconify-icon icon="solar:add-circle-linear" width="16"></iconify-icon> Add Event
            </button>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <!-- Calendar -->
            <div class="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
                <div class="flex items-center justify-between mb-5">
                    <p class="text-base font-bold text-slate-800">${monthNames[schedCalMonth]} ${schedCalYear}</p>
                    <div class="flex gap-2">
                        <button onclick="changeSchedMonth(-1)" class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all"><iconify-icon icon="solar:alt-arrow-left-linear" width="14"></iconify-icon></button>
                        <button onclick="changeSchedMonth(1)"  class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all"><iconify-icon icon="solar:alt-arrow-right-linear" width="14"></iconify-icon></button>
                    </div>
                </div>
                <div class="grid grid-cols-7 gap-1 mb-2">
                    ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="text-center text-[10px] font-bold text-slate-400 uppercase py-1">${d}</div>`).join('')}
                </div>
                <div class="grid grid-cols-7 gap-1">${calCells}</div>
            </div>

            <!-- Upcoming events sidebar -->
            <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
                <div class="px-5 py-4 border-b border-slate-100">
                    <p class="text-sm font-bold text-slate-800">Upcoming Events</p>
                </div>
                <div class="flex-1 overflow-y-auto divide-y divide-slate-50">
                    ${upcoming.length ? upcoming.map(ev => {
                        const t = typeCfg[ev.type] || typeCfg.meeting;
                        return `
                        <div class="px-5 py-4 hover:bg-slate-50 transition-all cursor-pointer">
                            <div class="flex items-start gap-3">
                                <div class="w-8 h-8 rounded-xl ${t.color} flex items-center justify-center shrink-0 mt-0.5">
                                    <iconify-icon icon="${t.icon}" class="text-white" width="14"></iconify-icon>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs font-bold text-slate-800 leading-snug">${ev.title}</p>
                                    <p class="text-[10px] text-slate-400 mt-0.5">${ev.client} · ${ev.date}</p>
                                    <p class="text-[10px] text-slate-400">${ev.time}${ev.duration ? ` · ${ev.duration} min` : ''} · ${ev.location}</p>
                                </div>
                            </div>
                        </div>`;
                    }).join('') : `<div class="px-5 py-10 text-center text-slate-400"><p class="text-sm">No upcoming events.</p></div>`}
                </div>
            </div>
        </div>

        <!-- Past events -->
        ${past.length ? `
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-slate-100"><p class="text-sm font-bold text-slate-700">Past Events</p></div>
            <div class="divide-y divide-slate-50">
                ${past.map(ev => {
                    const t = typeCfg[ev.type] || typeCfg.meeting;
                    return `
                    <div class="flex items-center gap-4 px-5 py-3.5 opacity-60">
                        <div class="w-7 h-7 rounded-lg ${t.color} flex items-center justify-center shrink-0">
                            <iconify-icon icon="${t.icon}" class="text-white" width="12"></iconify-icon>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-xs font-semibold text-slate-700 truncate">${ev.title}</p>
                            <p class="text-[10px] text-slate-400">${ev.date} · ${ev.time} · ${ev.client}</p>
                        </div>
                        <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Done</span>
                    </div>`;
                }).join('')}
            </div>
        </div>` : ''}
    </div>

    <!-- New Event Modal -->
    <div id="new-event-modal" class="hidden fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl fade-in">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <p class="text-sm font-bold text-slate-800">Add Event</p>
                <button onclick="document.getElementById('new-event-modal').classList.add('hidden')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon></button>
            </div>
            <div class="p-6 space-y-4">
                <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Event Title</label><input type="text" id="ne-title" placeholder="e.g. Initial Consultation — K-Cafe"></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Type</label>
                        <select id="ne-type"><option value="consultation">Consultation</option><option value="meeting">Meeting</option><option value="deadline">Deadline</option></select>
                    </div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Client</label>
                        <select id="ne-client">${clientsData.map(c=>`<option>${c.name}</option>`).join('')}</select>
                    </div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Date (YYYY-MM-DD)</label><input type="text" id="ne-date" placeholder="2026-03-25"></div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Time</label><input type="text" id="ne-time" placeholder="10:00 AM"></div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Duration (min)</label><input type="number" id="ne-duration" placeholder="60"></div>
                    <div><label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Location</label><input type="text" id="ne-location" placeholder="ArcVis Office"></div>
                </div>
                <button onclick="saveNewEvent()" class="w-full text-white font-bold py-3 rounded-xl text-sm transition-all" style="background:#003049" onmouseover="this.style.background='#00A3B4'" onmouseout="this.style.background='#003049'">Add Event</button>
            </div>
        </div>
    </div>`;
}

function changeSchedMonth(dir) {
    schedCalMonth += dir;
    if (schedCalMonth < 0)  { schedCalMonth = 11; schedCalYear--; }
    if (schedCalMonth > 11) { schedCalMonth = 0;  schedCalYear++; }
    renderScheduling();
}

function openNewEventModal() { document.getElementById('new-event-modal')?.classList.remove('hidden'); }

function saveNewEvent() {
    const title = document.getElementById('ne-title')?.value.trim();
    const date  = document.getElementById('ne-date')?.value.trim();
    if (!title || !date) { showToast('Title and date are required.'); return; }
    schedulingEvents.push({
        id:'EVT-' + String(schedulingEvents.length+1).padStart(3,'0'),
        type:     document.getElementById('ne-type')?.value || 'meeting',
        title,
        client:   document.getElementById('ne-client')?.value || '—',
        project:  null, date,
        time:     document.getElementById('ne-time')?.value || '—',
        duration: parseInt(document.getElementById('ne-duration')?.value) || 0,
        status:   'upcoming',
        location: document.getElementById('ne-location')?.value || '—',
    });
    document.getElementById('new-event-modal')?.classList.add('hidden');
    renderScheduling();
    showToast(`Event "${title}" added.`);
}
