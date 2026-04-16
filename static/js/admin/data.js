/* data.js — Shared admin data store */

/* ── CLIENTS ─────────────────────────────────────────────── */
const clientsData = [
    {
        id:'CLI-001', name:'Juan dela Cruz', type:'Returning',
        email:'juan@email.com', phone:'0917-123-4567',
        address:'456 Rizal Ave, Quezon City',
        avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
        projects:['ARC-2023-881','ARC-2023-902'],
        status:'active', joinDate:'Oct 2023',
        notes:'Prefers modern Scandinavian style. Responsive via email.'
    },
    {
        id:'CLI-002', name:'Maria Santos', type:'New',
        email:'maria@email.com', phone:'0918-234-5678',
        address:'789 Mabini St, Makati City',
        avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        projects:['NEW-PENDING-001'],
        status:'pending', joinDate:'Mar 2026',
        notes:'New client. Awaiting downpayment and initial consultation.'
    },
    {
        id:'CLI-003', name:'Resort Co.', type:'Returning',
        email:'resort@email.com', phone:'0919-345-6789',
        address:'Palawan, Philippines',
        avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Resort',
        projects:['ARC-2022-540'],
        status:'completed', joinDate:'Jun 2022',
        notes:'Commercial client. Multiple past projects. Reliable payment record.'
    },
    {
        id:'CLI-004', name:'Astra Inc.', type:'Returning',
        email:'astra@email.com', phone:'0920-456-7890',
        address:'BGC, Taguig City',
        avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Astra',
        projects:['ARC-2022-411'],
        status:'completed', joinDate:'Mar 2022',
        notes:'High-rise commercial client. All deliverables completed and archived.'
    },
];

/* ── PROJECTS ────────────────────────────────────────────── */
const adminProjects = [
    {
        id:'ARC-2023-881', name:'Modern Villa — Tagaytay', clientId:'CLI-001', clientName:'Juan dela Cruz',
        type:'Residential', status:'active', statusLabel:'In Progress',
        startDate:'Oct 12, 2023', dueDate:'Jun 30, 2026',
        lead:'Sarah L.', team:['SL','JR'],
        milestones:['Consultation','Design Dev','Working Drawings','3D Modeling','Rendering','Handover'],
        completedMilestones:2, progress:38,
        services:['Working Drawing','3D Model','Render'],
        thumbnail:'../static/photos/nimbus.png',
        downpaymentPaid:true, finalPaymentPaid:false,
        notes:'Client prefers modern Scandinavian style. Balcony glass clear (not tinted).',
    },
    {
        id:'ARC-2023-902', name:'Nimbus Bungalow — Batangas', clientId:'CLI-001', clientName:'Juan dela Cruz',
        type:'Residential', status:'review', statusLabel:'Review Needed',
        startDate:'Nov 5, 2023', dueDate:'Apr 15, 2026',
        lead:'Jose R.', team:['JR','SL'],
        milestones:['Consultation','Design Dev','Working Drawings','3D Modeling','Rendering','Handover'],
        completedMilestones:1, progress:22,
        services:['Working Drawing','3D Model'],
        thumbnail:'../static/photos/bungalow.png',
        downpaymentPaid:true, finalPaymentPaid:false,
        notes:'Review needed on east facade. Client pending approval on floor plan revision.',
    },
    {
        id:'NEW-PENDING-001', name:'K-Cafe Renovation', clientId:'CLI-002', clientName:'Maria Santos',
        type:'Renovation', status:'new', statusLabel:'New Order',
        startDate:'—', dueDate:'—',
        lead:'—', team:[],
        milestones:['Consultation','Design Dev','Working Drawings','3D Modeling','Rendering','Handover'],
        completedMilestones:0, progress:0,
        services:['Working Drawing','3D Model'],
        thumbnail:'../static/photos/render.png',
        downpaymentPaid:false, finalPaymentPaid:false,
        notes:'New order. Awaiting initial consultation and downpayment.',
    },
    {
        id:'ARC-2022-540', name:'Velisara Resort — Palawan', clientId:'CLI-003', clientName:'Resort Co.',
        type:'Commercial', status:'completed', statusLabel:'Completed',
        startDate:'Jun 1, 2022', dueDate:'Oct 5, 2022',
        lead:'Sarah L.', team:['SL'],
        milestones:['Consultation','Design Dev','Working Drawings','3D Modeling','Rendering','Handover'],
        completedMilestones:6, progress:100,
        services:['Working Drawing','3D Model','Render','360° VR'],
        thumbnail:'../static/photos/velisara.png',
        downpaymentPaid:true, finalPaymentPaid:true,
        notes:'Completed. All deliverables archived.',
    },
    {
        id:'ARC-2022-411', name:'Astra Tower — BGC', clientId:'CLI-004', clientName:'Astra Inc.',
        type:'Commercial', status:'completed', statusLabel:'Completed',
        startDate:'Mar 1, 2022', dueDate:'Sep 15, 2022',
        lead:'Sarah L.', team:['SL','JR'],
        milestones:['Consultation','Design Dev','Working Drawings','3D Modeling','Rendering','Handover'],
        completedMilestones:6, progress:100,
        services:['Working Drawing','3D Model','Render'],
        thumbnail:'../static/photos/astra.png',
        downpaymentPaid:true, finalPaymentPaid:true,
        notes:'Completed. All deliverables archived.',
    },
];

/* ── DELIVERABLES (files awaiting admin review) ──────────── */
const deliverablesQueue = [
    {
        id:'DEL-001', file:'Nimbus_Floor_Plan_v3.dwg', project:'ARC-2023-881', projectName:'Modern Villa — Tagaytay',
        employee:'Jose R.', uploadDate:'Mar 14, 2026', type:'blueprints',
        status:'pending', notes:'Floor plan revision 3 — client requested wider hallway.',
        thumb:'../static/photos/nimbus.png'
    },
    {
        id:'DEL-002', file:'Bungalow_East_Facade_v2.jpg', project:'ARC-2023-902', projectName:'Nimbus Bungalow',
        employee:'Sarah L.', uploadDate:'Mar 13, 2026', type:'renders',
        status:'pending', notes:'East facade render revised after client annotation.',
        thumb:'../static/photos/bungalow.png'
    },
    {
        id:'DEL-003', file:'KCafe_Blueprint_A1.dwg', project:'NEW-PENDING-001', projectName:'K-Cafe Renovation',
        employee:'Jose R.', uploadDate:'Mar 12, 2026', type:'blueprints',
        status:'approved', notes:'Initial floor plan for client review.',
        thumb:'../static/photos/render.png'
    },
    {
        id:'DEL-004', file:'Panasahan_Render_Set.zip', project:'ARC-2023-881', projectName:'Modern Villa',
        employee:'Sarah L.', uploadDate:'Mar 10, 2026', type:'renders',
        status:'returned', notes:'Render set — lighting needs adjustment per client feedback.',
        returnNote:'Please darken the ambient light on the east wing renders.',
        thumb:'../static/photos/nimbus.png'
    },
];

/* ── REVISION REQUESTS ───────────────────────────────────── */
const revisionsQueue = [
    {
        id:'REV-001', project:'ARC-2023-902', projectName:'Nimbus Bungalow',
        client:'Juan dela Cruz', file:'Bungalow_Render_v1.jpg',
        note:'Roof pitch looks too steep compared to the approved plan. Please check with structural team.',
        priority:'High', status:'assigned', assignedTo:'Jose R.', date:'Mar 13, 2026',
    },
    {
        id:'REV-002', project:'ARC-2023-881', projectName:'Modern Villa — Tagaytay',
        client:'Juan dela Cruz', file:'Interior_Kitchen.jpg',
        note:'Countertop color should be dark marble, not white quartz.',
        priority:'Medium', status:'pending', assignedTo:null, date:'Jan 18, 2026',
    },
    {
        id:'REV-003', project:'ARC-2023-881', projectName:'Modern Villa — Tagaytay',
        client:'Juan dela Cruz', file:'Exterior_Render_v2.jpg',
        note:'Please change the balcony glass from tinted to clear glass.',
        priority:'High', status:'resolved', assignedTo:'Sarah L.', date:'Jan 14, 2026',
    },
];

/* ── INVOICES ────────────────────────────────────────────── */
const adminInvoices = [
    {
        id:'INV-001', project:'ARC-2023-881', projectName:'Modern Villa — Tagaytay',
        clientId:'CLI-001', clientName:'Juan dela Cruz',
        paymentType:'downpayment', amount:50000, status:'paid',
        date:'Oct 12, 2023', due:'Oct 26, 2023',
        paidDate:'Oct 20, 2023', method:'GCash', refNo:'GC-8821003',
        items:[
            { service:'Working Drawing (Architectural)', qty:1, rate:25000 },
            { service:'3D Exterior Model', qty:1, rate:15000 },
            { service:'Realistic Render (5 views)', qty:1, rate:10000 },
        ],
    },
    {
        id:'INV-002', project:'ARC-2023-881', projectName:'Modern Villa — Tagaytay',
        clientId:'CLI-001', clientName:'Juan dela Cruz',
        paymentType:'progress', amount:75000, status:'pending',
        date:'Nov 5, 2023', due:'Nov 19, 2023',
        paidDate:null, method:null, refNo:null, dueWarning:'Overdue',
        items:[
            { service:'Full Working Drawing Set (Structural)', qty:1, rate:40000 },
            { service:'Interior 3D Model', qty:2, rate:12500 },
            { service:'Landscape Rendering', qty:1, rate:10000 },
        ],
    },
    {
        id:'INV-003', project:'ARC-2023-902', projectName:'Nimbus Bungalow',
        clientId:'CLI-001', clientName:'Juan dela Cruz',
        paymentType:'final', amount:24000, status:'submitted',
        date:'Dec 1, 2023', due:'Dec 15, 2023',
        paidDate:null, method:'BDO', refNo:'BDO-554433', receiptUploaded:true,
        items:[
            { service:'Consultation Package (4 sessions)', qty:4, rate:5000 },
            { service:'Permit Assistance', qty:1, rate:4000 },
        ],
    },
    {
        id:'INV-004', project:'ARC-2022-540', projectName:'Velisara Resort',
        clientId:'CLI-003', clientName:'Resort Co.',
        paymentType:'final', amount:180000, status:'paid',
        date:'Sep 1, 2022', due:'Sep 15, 2022',
        paidDate:'Sep 12, 2022', method:'BPI', refNo:'BPI-998877',
        items:[
            { service:'Full Project Package — Commercial', qty:1, rate:180000 },
        ],
    },
];

/* ── USERS (employees) ───────────────────────────────────── */
const usersData = [
    {
        id:'EMP-001', name:'Sarah Lim', role:'Senior Architect', dept:'Design',
        email:'sarah@arcbase.ph', phone:'0917-001-0001',
        avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        status:'active', joinDate:'Jan 2020',
        assignedProjects:['ARC-2023-881','ARC-2022-540','ARC-2022-411'],
        skills:['AutoCAD','3ds Max','SketchUp','Revit'],
    },
    {
        id:'EMP-002', name:'Jose Reyes', role:'Draftsman', dept:'CAD',
        email:'jose@arcbase.ph', phone:'0917-002-0002',
        avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Jose',
        status:'active', joinDate:'Mar 2021',
        assignedProjects:['ARC-2023-881','ARC-2023-902','NEW-PENDING-001'],
        skills:['AutoCAD','Revit','Working Drawings'],
    },
    {
        id:'EMP-003', name:'Ana Reyes', role:'Interior Designer', dept:'Design',
        email:'ana@arcbase.ph', phone:'0917-003-0003',
        avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
        status:'active', joinDate:'Jun 2022',
        assignedProjects:['ARC-2023-881'],
        skills:['SketchUp','Lumion','Interior Layouts'],
    },
    {
        id:'EMP-004', name:'Carlo Bautista', role:'3D Artist', dept:'Visualization',
        email:'carlo@arcbase.ph', phone:'0917-004-0004',
        avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlo',
        status:'inactive', joinDate:'Aug 2021',
        assignedProjects:[],
        skills:['3ds Max','Vray','Lumion'],
    },
];

/* ── SCHEDULING ──────────────────────────────────────────── */
const schedulingEvents = [
    { id:'EVT-001', type:'consultation', title:'Initial Consultation — K-Cafe', client:'Maria Santos', project:'NEW-PENDING-001', date:'2026-03-22', time:'10:00 AM', duration:60, status:'upcoming', location:'ArcVis Office' },
    { id:'EVT-002', type:'meeting',      title:'Design Review — Modern Villa', client:'Juan dela Cruz', project:'ARC-2023-881',    date:'2026-03-24', time:'2:00 PM',  duration:90, status:'upcoming', location:'Video Call' },
    { id:'EVT-003', type:'deadline',     title:'Working Drawings Due — Nimbus Bungalow', client:'Juan dela Cruz', project:'ARC-2023-902', date:'2026-03-25', time:'5:00 PM', duration:0, status:'upcoming', location:'—' },
    { id:'EVT-004', type:'consultation', title:'Progress Update — Modern Villa', client:'Juan dela Cruz', project:'ARC-2023-881',  date:'2026-03-18', time:'3:00 PM',  duration:60, status:'done', location:'Video Call' },
    { id:'EVT-005', type:'meeting',      title:'Final Presentation — Velisara', client:'Resort Co.',    project:'ARC-2022-540',    date:'2026-03-10', time:'10:00 AM', duration:120,status:'done', location:'ArcVis Office' },
];

/* ── BOM ─────────────────────────────────────────────────── */
const adminBOMData = {
    'ARC-2023-881': {
        status:'draft', submittedDate:null, employeeName:'Jose R.',
        items:[
            { id:'b1', category:'Concrete Works',  material:'Portland Cement (40kg)',  unit:'bags',  qty:320,  unitCost:285,  total:91200  },
            { id:'b2', category:'Concrete Works',  material:'Washed Sand',             unit:'cu.m',  qty:25,   unitCost:1200, total:30000  },
            { id:'b3', category:'Steel Works',     material:'Deformed Bar 16mm x 6m',  unit:'pcs',   qty:150,  unitCost:520,  total:78000  },
            { id:'b4', category:'Masonry Works',   material:'Concrete Hollow Blocks',  unit:'pcs',   qty:2500, unitCost:18,   total:45000  },
            { id:'b5', category:'Roofing Works',   material:'Corrugated G.I. Sheet',   unit:'sheets',qty:85,   unitCost:680,  total:57800  },
            { id:'b6', category:'Finishing Works', material:'Ceramic Floor Tiles',     unit:'sq.m',  qty:180,  unitCost:650,  total:117000 },
        ]
    },
    'ARC-2023-902': {
        status:'submitted', submittedDate:'Mar 10, 2026', employeeName:'Jose R.',
        items:[
            { id:'c1', category:'Concrete Works',  material:'Portland Cement (40kg)',  unit:'bags',  qty:180,  unitCost:285,  total:51300  },
            { id:'c2', category:'Steel Works',     material:'Deformed Bar 12mm x 6m',  unit:'pcs',   qty:80,   unitCost:380,  total:30400  },
            { id:'c3', category:'Masonry Works',   material:'Concrete Hollow Blocks',  unit:'pcs',   qty:1200, unitCost:18,   total:21600  },
        ]
    },
};

/* ── FILE VAULT ──────────────────────────────────────────── */
const adminVaultFiles = [
    { name:'Nimbus_Floor_Plan_v3.dwg',    project:'ARC-2023-881', projectName:'Modern Villa',   type:'blueprints', date:'Mar 5, 2026',  size:'4.2 MB',  version:'v3', employee:'Jose R.',  thumb:'',                      releasedToClient:true  },
    { name:'Exterior_Render_Final.jpg',   project:'ARC-2023-881', projectName:'Modern Villa',   type:'renders',    date:'Mar 1, 2026',  size:'8.1 MB',  version:'v2', employee:'Sarah L.', thumb:'../static/photos/nimbus.png',  releasedToClient:true  },
    { name:'Bungalow_3D_Model.obj',       project:'ARC-2023-902', projectName:'Nimbus Bungalow',type:'3d',         date:'Feb 20, 2026', size:'22.4 MB', version:'v1', employee:'Jose R.',  thumb:'../static/photos/bungalow.png',releasedToClient:false },
    { name:'KCafe_Blueprint_A1.dwg',      project:'NEW-PENDING-001',projectName:'K-Cafe Reno',  type:'blueprints', date:'Feb 18, 2026', size:'3.0 MB',  version:'v1', employee:'Jose R.',  thumb:'',                      releasedToClient:false },
    { name:'Velisara_Resort_Render.jpg',  project:'ARC-2022-540', projectName:'Velisara Resort',type:'renders',    date:'Jan 12, 2026', size:'12.5 MB', version:'v4', employee:'Sarah L.', thumb:'../static/photos/velisara.png',releasedToClient:true  },
    { name:'Astra_Construction_Doc.pdf',  project:'ARC-2022-411', projectName:'Astra Tower',    type:'documents',  date:'Oct 5, 2023',  size:'5.8 MB',  version:'v2', employee:'Sarah L.', thumb:'../static/photos/astra.png',releasedToClient:true  },
    { name:'Nimbus_VR_Tour.url',          project:'ARC-2023-881', projectName:'Modern Villa',   type:'vr',         date:'Mar 3, 2026',  size:'—',       version:'v1', employee:'Jose R.',  thumb:'',                      releasedToClient:false },
    { name:'Panasahan_Render_Set.zip',    project:'ARC-2023-881', projectName:'Modern Villa',   type:'renders',    date:'Mar 8, 2026',  size:'45.0 MB', version:'v1', employee:'Sarah L.', thumb:'',                      releasedToClient:false },
];

/* ── MESSAGES ────────────────────────────────────────────── */
const adminConversations = {
    juan: {
        name:'Juan dela Cruz', role:'Client', avatarText:'JD',
        avatarColor:'bg-[#003049]', status:'● Online', statusColor:'text-emerald-500',
        project:'ARC-2023-881',
        messages:[
            { from:'them', text:'Hi, can you check the latest render revision? The lighting on the balcony still looks off.', time:'Today, 9:30 AM' },
            { from:'me',   text:'Good morning Juan! I checked the file — Sarah will have the updated render by EOD today.', time:'Today, 9:45 AM' },
            { from:'them', text:'Perfect, thanks! Also, when can we schedule the next design review meeting?', time:'Today, 10:00 AM' },
            { from:'me',   text:'Let me check the calendar and get back to you within the hour.', time:'Today, 10:05 AM' },
        ]
    },
    maria: {
        name:'Maria Santos', role:'Client', avatarText:'MS',
        avatarColor:'bg-emerald-600', status:'● Away', statusColor:'text-amber-500',
        project:'NEW-PENDING-001',
        messages:[
            { from:'them', text:'Hello! Just wanted to confirm — do I bring the site plans to the consultation tomorrow?', time:'Yesterday, 4:00 PM' },
            { from:'me',   text:'Hi Maria! Yes, please bring any existing floor plans or site photos. See you at 10 AM!', time:'Yesterday, 4:15 PM' },
        ]
    },
    sarah: {
        name:'Sarah Lim', role:'Employee', avatarText:'SL',
        avatarColor:'bg-[#00A3B4]', status:'● Online', statusColor:'text-emerald-500',
        project:null,
        messages:[
            { from:'them', text:'The render for ARC-881 is almost done. Should I submit it through the file vault or directly?', time:'Today, 8:00 AM' },
            { from:'me',   text:'Upload via File Vault and mark it for client review. Thanks Sarah!', time:'Today, 8:10 AM' },
        ]
    },
    jose: {
        name:'Jose Reyes', role:'Employee', avatarText:'JR',
        avatarColor:'bg-[#F77F00]', status:'● Online', statusColor:'text-emerald-500',
        project:null,
        messages:[
            { from:'them', text:'Floor plan v3 is uploaded. I addressed all the client\'s hallway width comments.', time:'Today, 7:45 AM' },
            { from:'me',   text:'Great work Jose! I\'ll review it and release to the client once approved.', time:'Today, 7:50 AM' },
        ]
    },
};
let adminActiveConv = 'juan';

/* ── NOTIFICATIONS ───────────────────────────────────────── */
const adminNotifications = [
    { id:'n1', title:'Payment Submitted — INV-003', body:'Juan dela Cruz submitted payment via BDO. Ref: BDO-554433. Please confirm.', time:'Just now', icon:'solar:card-bold', color:'bg-emerald-500', read:false, action:'invoices' },
    { id:'n2', title:'New Revision Request — REV-002', body:'Juan dela Cruz requested a revision on Interior_Kitchen.jpg (Tagaytay Villa).', time:'2 hrs ago', icon:'solar:pen-2-linear', color:'bg-[#F77F00]', read:false, action:'revisions' },
    { id:'n3', title:'File Submitted for Review', body:'Jose Reyes uploaded Nimbus_Floor_Plan_v3.dwg — pending your review.', time:'3 hrs ago', icon:'solar:upload-minimalistic-linear', color:'bg-[#00A3B4]', read:false, action:'deliverables' },
    { id:'n4', title:'BOM Submitted — ARC-2023-902', body:'Jose Reyes submitted the Bill of Materials for Nimbus Bungalow for your approval.', time:'Yesterday', icon:'solar:clipboard-list-bold', color:'bg-[#003049]', read:true, action:'bom' },
    { id:'n5', title:'New Service Order — K-Cafe', body:'Maria Santos submitted a new service order for K-Cafe Renovation.', time:'2 days ago', icon:'solar:add-circle-bold', color:'bg-purple-500', read:true, action:'clients' },
    { id:'n6', title:'Milestone Approved — ARC-881', body:'Juan dela Cruz approved the Working Drawings milestone for Modern Villa.', time:'3 days ago', icon:'solar:check-circle-bold', color:'bg-emerald-600', read:true, action:'projects' },
];
