const container = document.getElementById('container')
const issueCount = document.getElementById('issue-count')


// Tabs

const allTab = document.getElementById('all-issues')
const openTab = document.getElementById('open-issues')
const closedTab = document.getElementById('closed-issues')

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
        card.className = `bg-white p-4 rounded shadow-sm border-t-4 cursor-pointer
         ${issue.status === 'open' ? 'border-green-500' : 'border-purple-500'}`

        card.innerHTML = `
         <h3 class="text-lg font-bold mb-1">${issue.title}</h3>
         <p class="text-sm text-gray-600 mb-1">${issue.description}</p>
         <p class="text-sm text-gray-600 mb-1"><strong>Status:</strong> ${issue.status}</p>
         <p class="text-sm text-gray-600 mb-1"><strong>Author:</strong> ${issue.author}</p>
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