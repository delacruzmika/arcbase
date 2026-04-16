/* requisition.js — New Service Order modal (4-step) → adds to Pending Projects */

let currentStep = 1;
const totalSteps = 4;

function openRequisition(preselect) {
    document.getElementById('requisition-modal').classList.remove('hidden');
    if (preselect) {
        const radio = document.querySelector(`input[name="project_cat"][value="${preselect}"]`);
        if (radio) { radio.checked = true; }
    }
    updateSummary();
}

function closeRequisition() {
    document.getElementById('requisition-modal').classList.add('hidden');
}

function changeStep(n) {
    document.getElementById(`req-step-${currentStep}`).classList.add('hidden');
    currentStep += n;

    if (currentStep > totalSteps) {
        closeRequisition();
        currentStep = 1;
        // Add to pending projects
        if (typeof submitServiceOrder === 'function') submitServiceOrder();
        // Switch to pending tab and re-render immediately
        if (typeof switchProjectTab === 'function') switchProjectTab('pending');
        if (typeof activeProjectTab !== 'undefined') activeProjectTab = 'pending';
        showToast();
        document.getElementById(`req-step-1`).classList.remove('hidden');
        document.getElementById('prevBtn').style.visibility = 'hidden';
        document.getElementById('nextBtn').innerText = 'Next Step';
        document.querySelectorAll('.step-pill').forEach((pill, idx) => {
            pill.classList.toggle('active', idx === 0);
        });
        return;
    }

    document.getElementById(`req-step-${currentStep}`).classList.remove('hidden');
    document.getElementById('prevBtn').style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    document.getElementById('nextBtn').innerText = currentStep === totalSteps ? 'Submit Order' : 'Next Step';
    document.querySelectorAll('.step-pill').forEach((pill, idx) => {
        pill.classList.toggle('active', idx + 1 === currentStep);
    });
}

function updateSummary() {
    const catInput = document.querySelector('input[name="project_cat"]:checked');
    if (!catInput) return;
    const baseFee = parseInt(catInput.getAttribute('data-fee'));
    const catName = catInput.value;

    document.getElementById('sum-cat').innerText       = catName;
    document.getElementById('sum-cat-price').innerText = `₱${baseFee.toLocaleString()}`;

    let total = baseFee;
    const servicesList = document.getElementById('selected-services-list');
    servicesList.innerHTML = '';

    document.querySelectorAll('.service-check:checked').forEach(service => {
        const name  = service.value;
        const price = parseInt(service.getAttribute('data-price'));
        total += price;
        servicesList.innerHTML += `
            <div class="flex justify-between items-center text-[11px]">
                <span class="text-slate-500">${name}</span>
                <span class="font-bold text-slate-700">₱${price.toLocaleString()}</span>
            </div>`;
    });

    document.getElementById('total-price').innerText = `₱${total.toLocaleString()}`;
}
