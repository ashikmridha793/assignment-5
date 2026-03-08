const container = document.getElementById('container')
const issueCount = document.getElementById('issue-count')


// Tabs

const allTab = document.getElementById('all-issues')
const openTab = document.getElementById('open-issues')
const closedTab = document.getElementById('closed-issues')

// priority color helper
const getPriorityColor = (priority) => {
    if (priority === 'high') return 'badge-error';
    if (priority === 'medium') return 'badge-warning';
    if (priority === 'low') return 'badge-success';
    return 'badge-neutral';
}

// label color helper
const getLabelColor = (label) => {
    label = label.toLowerCase();
    if (label === 'bug') return 'badge-error';
    if (label === 'feature') return 'badge-success';
    if (label === 'enhancement') return 'badge-warning';
    return 'badge-info';
}

// modal 
const modalTitle = document.getElementById('modal-title')
const modalDescription = document.getElementById('modal-description')
const modalStatus = document.getElementById('modal-status')
const modalAuthor = document.getElementById('modal-author')
const modalPriority = document.getElementById('modal-priority')
const modalLabel = document.getElementById('modal-label')
const modalCreated = document.getElementById('modal-created')

let allIssues = [];

// load issues from local storage
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

// render issues in grid

const renderIssues = (issues) => {
    container.innerHTML = '';
    issueCount.textContent = issues.length;

    issues.forEach(issue => {
        const card = document.createElement('div');
        card.className = `bg-white p-3 rounded shadow-sm border-t-4 cursor-pointer hover:shadow-md transition
         ${issue.status === 'open' ? 'border-green-500' : 'border-purple-500'}`

        card.innerHTML = `
        
        <div class="flex items-center gap-2 mb-2">

            <div class="flex gap-4 items-center justify-between w-full">
               <span class="p-2 bg-green-100 rounded-full"><i class="fa-solid fa-spinner"></i></span>
               <span class="badge ${getPriorityColor(issue.priority)}">${issue.priority}</span>
            </div>
        </div>

         <h3 class="text-lg font-bold mb-1">
            <span class="line-clamp-2">${issue.title}</span>
         </h3>

         <p class="text-xs md:text-sm text-gray-600 mb-3 line-clamp-3">${issue.description}</p>

         <div class="flex items-start flex-col flex-wrap justify-between gap-2">
            <div class="badge ${getLabelColor}">${issue.labels}</div>
                
            <div>
            <span class="text-[12px] md:text-xs text-gray-400">#${issue.author}</span>
            <span class="text-[10px] md:text-xs text-gray-400">${new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
        </div>

         `;
        card.addEventListener('click', () => openModal(issue));
        container.appendChild(card);
    });
}

// open modal

const openModal = (issue) => {
    modalTitle.textContent = issue.title;
    modalDescription.textContent = issue.description;
    modalStatus.textContent = issue.status;
    modalAuthor.textContent = issue.author;
    modalPriority.textContent = issue.priority;
    modalLabel.textContent = issue.label;
    modalCreated.textContent = new Date(issue.createdAt).toLocaleString();
    document.getElementById('issue-modal').checked = true;
}
// tab filters
allTab.addEventListener('click', () => renderIssues(allIssues));
openTab.addEventListener('click', () => renderIssues(allIssues.filter(i => i.status === 'open')));
closedTab.addEventListener('click', () => renderIssues(allIssues.filter(i => i.status === 'closed')));

// search functionality
document.getElementById('search-input').addEventListener('input', (e) => {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return loadData();

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`)
        .then(res => res.json())
        .then(data => renderIssues(data.data || []))
        .catch(err => console.error(err))

})

// initial load
document.addEventListener('DOMContentLoaded', loadData);