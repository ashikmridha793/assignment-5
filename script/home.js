const container = document.getElementById('container')
const issueCount = document.getElementById('issue-count')


const allTab = document.getElementById('all-issues')
const openTab = document.getElementById('open-issues')
const closedTab = document.getElementById('closed-issues')


const getPriorityColor = (priority) => {
    if (priority === 'high') return 'badge-error';
    if (priority === 'medium') return 'badge-warning';
    if (priority === 'low') return 'badge-success';
    return 'badge-neutral';
}


const getLabelColor = (label) => {
    label = label.toLowerCase();
    if (label === 'bug') return 'badge-error';
    if (label === 'feature') return 'badge-secondery';
    if (label === 'enhancement') return 'badge-primary';
    if (label === 'documentation') return 'badge-secondary';
    if (label === 'question') return 'badge-primary';
    return 'badge-info';
}


const modalTitle = document.getElementById('modal-title')
const modalDescription = document.getElementById('modal-description')
const modalStatus = document.getElementById('modal-status')
const modalAuthor = document.getElementById('modal-author')
const modalPriority = document.getElementById('modal-priority')
const modalLabel = document.getElementById('modal-label')
const modalCreated = document.getElementById('modal-created')

let allIssues = [];


const loadData = () => {
    container.innerHTML = `
    <div class="col-span-full flex justify-center ">
    <span class="loading loading-spinner loding-lg"></span>
    </div>`

    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            allIssues = data.data || [];
            renderIssues(allIssues);
        })
        .catch(err => {
            container.innerHTML = `<p class="text-red-500 col-span-full"> Failed to load issues. Please try again later.</p>`
            console.error(err);
        })
}



const renderIssues = (issues) => {
    container.innerHTML = '';
    issueCount.textContent = issues.length;

    issues.forEach(issue => {
        const labelsHTML = Array.isArray(issue.labels) ? issue.labels.map(label => {
            const colorClass = getLabelColor(label);
            return `<span class="budge budge-outline ${colorClass} bg-yellow-50 border-yellow-100 rounded-full gap-1 py-1 px-3 text-[9px] font-extrabold uppercase border-2">
            <i class="fa-solid fa-bug text-[5px] md:text-[6px]"></i> ${label}
            </span>
            `
        })
            .join('') : '';

        const card = document.createElement('div');
        card.className = `
        bg-white p-4 md:p-5 rounded-xl shadow-sm border-t-[6px] cursor-pointer hover:shadow-md transition flex flex-col justify-betweenh-full
        ${issue.status === 'open' ? 'border-green-500' : 'border-purple-500'}
        `;

        card.innerHTML = `
        <div>
            <div class="flex justify-between items-start mb-3 md:mb-4">

            <div class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-green-100 flex items-center justify-center">
            <i class="fa-solid fa-spinner text-gray-400 text-xs md:text-sm"></i>
            </div>

            <span class="badge ${getPriorityColor(issue.priority)} border-none h-6 md:h-7 px-3  md:px-4 text-[9px] md:text-[10px] font-bold uppercase text-white tracking-wider">
                ${issue.priority}
                </span>

            </div>

            <h3 class="text-base md:text-lg font-bold mb-2 leading-snug text-gray-800">
                <span class="line-clamp-2">${issue.title}</span>
            </h3>

            <p class="text-xs md:text-sm text-gray-500 mb-4 md:mb-5 line-clamp-3 leading-relaxed">
            ${issue.description}
            </p>
        </div>


        <div class="mt-auto">
            <div class="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-5">
            ${labelsHTML}
            </div>
                
            <div class="flex justify-between items-center pt-3 md:pt-4 border-t border-gray-100">
            <span class="text-[12px] md:text-sm font-semibold text-gray-400">#${issue.author}</span>
            <span class="text-[10px] md:text-sm font-medium text-gray-400">${new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
        </div>

         `;
        card.addEventListener('click', () => openModal(issue));
        container.appendChild(card);
    });
}



const openModal = (issue) => {
    modalTitle.textContent = issue.title;
    modalDescription.textContent = issue.description;

    const statusBadge = document.getElementById('modal-status-badge');
    statusBadge.textContent = issue.status.charAt(0).toUpperCase() + issue.status.slice(1);
    statusBadge.className = `badge ${issue.status === 'open' ? 'badge-success' : 'badge-secondary'} text-white`;
    modalAuthor.textContent = issue.author;


    modalPriority.textContent = issue.priority.toUpperCase()
    modalPriority.className = `badge ${getPriorityColor(issue.priority)} text-white font-bold h-8 px-4`;

    modalLabel.textContent = issue.labels || "BUG";


    modalCreated.textContent = new Date(issue.createdAt).toLocaleDateString();


    document.getElementById('modal-assignee').textContent = issue.author;
    document.getElementById('issue-modal').checked = true;
}

allTab.addEventListener('click', () => renderIssues(allIssues));
openTab.addEventListener('click', () => renderIssues(allIssues.filter(i => i.status === 'open')));
closedTab.addEventListener('click', () => renderIssues(allIssues.filter(i => i.status === 'closed')));


document.getElementById('search-input').addEventListener('input', (e) => {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return loadData();

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`)
        .then(res => res.json())
        .then(data => renderIssues(data.data || []))
        .catch(err => console.error(err))

})


document.addEventListener('DOMContentLoaded', loadData);