const API_BASE = '/api';

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
        
        e.target.classList.add('active');
        document.getElementById(e.target.dataset.target).classList.add('active');
        
        if(e.target.dataset.target === 'books-view') loadBooks();
        if(e.target.dataset.target === 'members-view') loadMembers();
        if(e.target.dataset.target === 'issues-view') fetchIssues();
    });
});

// Modals
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// --- BOOKS ---
async function loadBooks() {
    try {
        const res = await fetch(`${API_BASE}/books`);
        const books = await res.json();
        const tbody = document.querySelector('#booksTable tbody');
        tbody.innerHTML = books.map(b => `
            <tr>
                <td>${b.id}</td>
                <td>${b.title}</td>
                <td>${b.author}</td>
                <td>${b.isbn}</td>
                <td>${b.availableCopies}</td>
                <td>${b.totalCopies}</td>
            </tr>
        `).join('');
    } catch (err) { console.error("Failed to load books", err); }
}

async function addBook(e) {
    e.preventDefault();
    const book = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        isbn: document.getElementById('bookIsbn').value,
        availableCopies: parseInt(document.getElementById('bookAvailable').value),
        totalCopies: parseInt(document.getElementById('bookTotal').value)
    };
    
    try {
        const res = await fetch(`${API_BASE}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book)
        });
        if(res.ok) {
            closeModal('bookModal');
            e.target.reset();
            loadBooks();
        } else {
            alert('Failed to add book. ISBN might be duplicate.');
        }
    } catch (err) { console.error(err); }
}

// --- MEMBERS ---
async function loadMembers() {
    try {
        const res = await fetch(`${API_BASE}/members`);
        const members = await res.json();
        const tbody = document.querySelector('#membersTable tbody');
        tbody.innerHTML = members.map(m => `
            <tr>
                <td>${m.id}</td>
                <td>${m.name}</td>
                <td>${m.email}</td>
                <td>${m.phone}</td>
            </tr>
        `).join('');
    } catch (err) { console.error("Failed to load members", err); }
}

async function addMember(e) {
    e.preventDefault();
    const member = {
        name: document.getElementById('memberName').value,
        email: document.getElementById('memberEmail').value,
        phone: document.getElementById('memberPhone').value
    };
    
    try {
        const res = await fetch(`${API_BASE}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(member)
        });
        if(res.ok) {
            closeModal('memberModal');
            e.target.reset();
            loadMembers();
        } else {
            alert('Failed to add member. Email might be duplicate.');
        }
    } catch (err) { console.error(err); }
}

// --- ISSUES & RETURNS ---
async function issueBook(e) {
    e.preventDefault();
    const bId = document.getElementById('issueBookId').value;
    const mId = document.getElementById('issueMemberId').value;
    
    try {
        const res = await fetch(`${API_BASE}/library/issue?bookId=${bId}&memberId=${mId}`, { method: 'POST' });
        if(res.ok) {
            closeModal('issueModal');
            e.target.reset();
            alert('Book Issued Successfully!');
            if(document.getElementById('searchMemberId').value === mId) {
                fetchIssues();
            }
        } else {
            alert('Failed to issue book. Check IDs or copy availability.');
        }
    } catch(err) { console.error(err); }
}

async function fetchIssues() {
    const mId = document.getElementById('searchMemberId').value;
    
    try {
        const url = mId ? `${API_BASE}/library/member/${mId}` : `${API_BASE}/library/all`;
        const res = await fetch(url);
        const issues = await res.json();
        const tbody = document.querySelector('#issuesTable tbody');
        
        if (issues.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center">No records found ${mId ? 'for member ID ' + mId : 'yet'}</td></tr>`;
            return;
        }

        tbody.innerHTML = issues.map(i => `
            <tr>
                <td>${i.id}</td>
                <td>${i.book.title} (ID: ${i.book.id})</td>
                <td>${i.issueDate}</td>
                <td>${i.dueDate}</td>
                <td>${i.returnDate || '-'}</td>
                <td><span class="status-badge status-${i.status}">${i.status}</span></td>
                <td>
                    ${i.status === 'ISSUED' ? `<button class="return-btn" onclick="returnBook(${i.book.id}, ${i.member.id})">Return Book</button>` : 'COMPLETED'}
                </td>
            </tr>
        `).join('');
    } catch (err) { console.error(err); }
}

async function returnBook(bookId, memberId) {
    try {
        const res = await fetch(`${API_BASE}/library/return?bookId=${bookId}&memberId=${memberId}`, { method: 'POST' });
        if(res.ok) {
            fetchIssues(); // Refresh the table
        } else {
            alert('Error returning book. It may already be returned.');
        }
    } catch(err) { console.error(err); }
}

// Initialize data loading on page load
window.onload = () => {
    loadBooks();
};
