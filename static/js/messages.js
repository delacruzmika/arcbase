/* ============================================================
   messages.js — Conversations & chat logic
   ============================================================ */

const conversations = {
    arcbase: {
        name: 'ArcBase Team',
        avatarText: 'AB',
        avatarColor: 'bg-blue-600',
        status: '● Online',
        statusColor: 'text-emerald-500',
        messages: [
            { from: 'them', text: 'Hi, regarding the balcony render, can we make the glass clear instead of tinted?', time: 'Today, 10:30 AM' },
            { from: 'me',   text: "Absolutely, Juan. We'll update the texture settings in the 3D model. You should see it in the next revision upload.", time: 'Today, 10:32 AM' },
            { from: 'them', text: 'Great, thanks! Also attaching a reference for the lighting fixture.', time: 'Today, 10:45 AM', attachment: 'Light_Ref.jpg' },
        ]
    },
    accounting: {
        name: 'Accounting',
        avatarText: 'AC',
        avatarColor: 'bg-slate-300',
        status: '● Away',
        statusColor: 'text-amber-500',
        messages: [
            { from: 'them', text: 'Your Invoice #001 has been confirmed. Payment processed successfully.', time: 'Yesterday, 3:00 PM' },
            { from: 'me',   text: 'Thank you! Please send the official receipt when available.', time: 'Yesterday, 3:15 PM' },
        ]
    },
    design: {
        name: 'Design Studio',
        avatarText: 'DS',
        avatarColor: 'bg-emerald-500',
        status: '● Online',
        statusColor: 'text-emerald-500',
        messages: [
            { from: 'them', text: 'Render revision 2 is ready for your review. Please check the shared folder.', time: 'Monday, 2:00 PM' },
            { from: 'me',   text: 'Looks great! Just a few minor changes on the east facade lighting.', time: 'Monday, 2:30 PM' },
            { from: 'them', text: "Noted. We'll have it updated by tomorrow morning.", time: 'Monday, 2:35 PM' },
        ]
    }
};

let activeConv = 'arcbase';

function selectConversation(id) {
    document.querySelectorAll('.conversation-item').forEach(el => el.classList.remove('active', 'bg-[#e6f7f9]'));
    document.getElementById(`conv-${id}`).classList.add('active');
    activeConv = id;
    renderMessages(id);
}

function renderMessages(id) {
    const conv = conversations[id];
    if (!conv) return;

    const avatarEl = document.getElementById('chat-avatar');
    avatarEl.textContent = conv.avatarText;
    avatarEl.className = `w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${conv.avatarColor}`;
    document.getElementById('chat-name').textContent   = conv.name;
    const statusEl = document.getElementById('chat-status');
    statusEl.textContent = conv.status;
    statusEl.className   = `text-[10px] font-medium ${conv.statusColor}`;

    const container = document.getElementById('chat-messages');
    container.innerHTML = '';
    conv.messages.forEach(msg => {
        const isMe   = msg.from === 'me';
        const bubble = document.createElement('div');
        bubble.className = `flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`;
        bubble.innerHTML = `
            ${!isMe ? `<div class="w-8 h-8 rounded-full ${conv.avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0">${conv.avatarText}</div>` : ''}
            <div class="max-w-xs lg:max-w-sm">
                <div class="${isMe ? 'msg-bubble-out text-white' : 'msg-bubble-in text-slate-800'} px-4 py-3 text-sm leading-relaxed">
                    ${msg.text}
                    ${msg.attachment ? `<div class="mt-2 flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 text-[11px]"><iconify-icon icon="solar:file-bold" width="14"></iconify-icon> ${msg.attachment}</div>` : ''}
                </div>
                <p class="text-[10px] text-slate-400 mt-1 ${isMe ? 'text-right' : ''}">${msg.time}</p>
            </div>
            ${isMe ? `<div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" class="w-full h-full object-cover"></div>` : ''}
        `;
        container.appendChild(bubble);
    });
    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('msg-input');
    const text  = input.value.trim();
    if (!text) return;
    const conv    = conversations[activeConv];
    const now     = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    conv.messages.push({ from: 'me', text, time: `Today, ${timeStr}` });
    input.value = '';
    renderMessages(activeConv);
}
