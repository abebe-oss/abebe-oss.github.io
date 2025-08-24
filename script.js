// App state variables
let db;
let currentNoteId = null;
let activeTag = null;

// Book management state variables
let currentBookId = null;
let currentChapterId = null;
let currentReadingPosition = 0;
let activeView = 'notes'; // 'notes', 'books', 'highlights', 'reading'
let currentBookFilter = 'all'; // 'all', 'reading', 'completed', 'paused'
let selectedHighlightColor = 'yellow'; // Default highlight color
let currentHighlightCategory = 'all';

// Reading state
let isHighlightMode = false;
let selectedText = null;
let selectionRange = null;

// PWA Install Prompt variables
let deferredPrompt = null;
let installPromptShown = false;

// DOM element references
const notesContainer = document.getElementById('notes-container');
const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const saveBtn = document.getElementById('save-note');
const deleteBtn = document.getElementById('delete-note');
const newNoteBtn = document.getElementById('new-note-btn');
const floatingNewNote = document.getElementById('floating-new-note');
const searchInput = document.getElementById('search-notes');
const themeToggle = document.getElementById('theme-toggle');
const noteModal = document.getElementById('note-modal');
const modalOverlay = document.getElementById('modal-overlay');
const closeModalBtn = document.getElementById('close-modal-btn');
const emojiPicker = document.getElementById('emoji-picker');
const emojiPickerBtn = document.getElementById('emoji-picker-btn');

// Book-related DOM element references
const booksContainer = document.getElementById('books-container');
const bookImportModal = document.getElementById('book-import-modal');
const bookReaderModal = document.getElementById('book-reader-modal');
const highlightsContainer = document.getElementById('highlights-container');
const addBookBtn = document.getElementById('add-book-btn');
const saveBookBtn = document.getElementById('save-book-btn');
const searchBooksInput = document.getElementById('search-books');
const searchHighlightsInput = document.getElementById('search-highlights');

// View containers
const notesList = document.getElementById('notes-list');
const booksList = document.getElementById('books-list');
const highlightsList = document.getElementById('highlights-list');

// Navigation buttons
const navNotes = document.getElementById('nav-notes');
const navBooks = document.getElementById('nav-books');
const navHighlights = document.getElementById('nav-highlights');

// PWA Install Prompt DOM references
const installPrompt = document.getElementById('install-prompt');
const installButton = document.getElementById('install-button');
const installDismiss = document.getElementById('install-dismiss');

// Mobile Menu DOM references
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileSidebar = document.getElementById('mobile-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const emojiSearchInput = document.getElementById('emoji-search-input');
const emojiContent = document.getElementById('emoji-content');

const themes = [ { name: 'light', icon: 'fa-sun' }, { name: 'dark', icon: 'fa-moon' }, { name: 'forest', icon: 'fa-tree' }];

// Enhanced Emoji Data for truly emoji-powered experience
const emojiData = {
    recent: JSON.parse(localStorage.getItem('recentEmojis') || '["✨", "💡", "😊", "📝", "🎉", "❤️"]'),
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸'],
    people: ['👋', '🤚', '👏', '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '🤏', '👈', '👉', '👆', '👇', '☝️', '👏', '👐', '🤲', '🤳', '🙏', '✍️', '💅', '🤵'],
    nature: ['🌿', '🌱', '🌲', '🌳', '🌴', '🌵', '🌷', '🌸', '🌹', '🌺', '🌻', '🌼', '🌽', '🌾', '🍀', '🍁', '🍂', '🍃', '🍄', '🌍', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '⭐', '🌟', '✨', '⚡', '🔥', '💥'],
    food: ['🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥕', '🍆', '🥒', '🥑', '🌽', '🌶️', '🥔', '🍠', '🌰', '🥜', '🍞', '🥖', '🥨', '🥯', '🧀', '🍳', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '☕', '🍵', '🥤'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🏓', '🏸', '🏒', '🏑', '🤏', '🎣', '🥊', '🥋', '🎨', '🎭', '🎤', '🎧', '🎵', '🎶', '🎹', '🥁', '🎷', '🎺', '🎸', '🎻', '🎲', '♟️', '🎯', '🎳', '🎮', '🎰'],
    objects: ['📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '⏰', '⏱️', '⏲️', '⏳', '⏸️', '⏯️'],
    symbols: ['✨', '💡', '🔥', '🎯', '💯', '⭐', '🌟', '⚡', '🔋', '✨', '💫', '💥', '💢', '💨', '💬', '🗏️', '💤', '💕', '💖', '💗', '💘', '💙', '💚', '💛', '🧡', '💜', '💝', '💞', '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚', '💙']
};

// Current emoji filter state
let currentEmojiCategory = 'recent';
let currentNoteFilter = 'all';

// --- CORE DATABASE FUNCTIONS (Enhanced for Book Summary Features) ---
function openDatabase() { 
    return new Promise((resolve, reject) => { 
        const request = indexedDB.open('notesDB', 3); // Upgraded to version 3
        
        request.onupgradeneeded = (event) => { 
            const db = event.target.result;
            
            // Original notes store
            if (!db.objectStoreNames.contains('notes')) { 
                const notesStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
                notesStore.createIndex('by_date', 'updatedAt', { unique: false });
                notesStore.createIndex('by_tag', 'tag', { unique: false });
            }
            
            // Books store for book management
            if (!db.objectStoreNames.contains('books')) {
                const booksStore = db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });
                booksStore.createIndex('by_title', 'title', { unique: false });
                booksStore.createIndex('by_author', 'author', { unique: false });
                booksStore.createIndex('by_status', 'status', { unique: false });
                booksStore.createIndex('by_category', 'category', { unique: false });
                booksStore.createIndex('by_date_added', 'dateAdded', { unique: false });
            }
            
            // Highlights store for text highlighting
            if (!db.objectStoreNames.contains('highlights')) {
                const highlightsStore = db.createObjectStore('highlights', { keyPath: 'id', autoIncrement: true });
                highlightsStore.createIndex('by_book', 'bookId', { unique: false });
                highlightsStore.createIndex('by_color', 'color', { unique: false });
                highlightsStore.createIndex('by_category', 'category', { unique: false });
                highlightsStore.createIndex('by_date', 'createdAt', { unique: false });
            }
            
            // Book notes store for book-specific annotations
            if (!db.objectStoreNames.contains('bookNotes')) {
                const bookNotesStore = db.createObjectStore('bookNotes', { keyPath: 'id', autoIncrement: true });
                bookNotesStore.createIndex('by_book', 'bookId', { unique: false });
                bookNotesStore.createIndex('by_highlight', 'highlightId', { unique: false });
                bookNotesStore.createIndex('by_type', 'type', { unique: false });
                bookNotesStore.createIndex('by_date', 'createdAt', { unique: false });
            }
        };
        
        request.onsuccess = (event) => { 
            db = event.target.result;
            resolve(db);
        };
        
        request.onerror = (event) => reject(`Database error: ${event.target.error?.message}`);
    }); 
}
function saveNoteToDB(note) { return new Promise((resolve, reject) => { if (!db) return reject("Database not initialized."); const transaction = db.transaction(['notes'], 'readwrite'); const notesStore = transaction.objectStore('notes'); const request = note.id ? notesStore.put(note) : notesStore.add(note); request.onsuccess = (event) => resolve(event.target.result); request.onerror = (event) => reject(`Error saving note: ${event.target.error?.message}`); }); }
function loadNotesFromDB(tag = null, search = null) { return new Promise((resolve, reject) => { if (!db) return reject("Database not initialized."); const notes = []; const transaction = db.transaction(['notes'], 'readonly'); const notesStore = transaction.objectStore('notes'); const index = tag ? notesStore.index('by_tag') : notesStore.index('by_date'); const request = tag ? index.openCursor(IDBKeyRange.only(tag), 'prev') : index.openCursor(null, 'prev'); request.onsuccess = (event) => { const cursor = event.target.result; if (cursor) { const note = cursor.value; const searchLower = search?.toLowerCase(); if (!search || note.title?.toLowerCase().includes(searchLower) || note.content?.toLowerCase().includes(searchLower)) { notes.push(note); } cursor.continue(); } else { resolve(notes); } }; request.onerror = (event) => reject(`Error loading notes: ${event.target.error?.message}`); }); }
function deleteNoteFromDB(id) { return new Promise((resolve, reject) => { if (!db) return reject("Database not initialized."); const transaction = db.transaction(['notes'], 'readwrite'); const request = transaction.objectStore('notes').delete(id); request.onsuccess = () => resolve(); request.onerror = (event) => reject(`Error deleting note: ${event.target.error?.message}`); }); }

// --- BOOK MANAGEMENT FUNCTIONS ---
function saveBookToDB(book) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Database not initialized.");
        
        const transaction = db.transaction(['books'], 'readwrite');
        const booksStore = transaction.objectStore('books');
        const request = book.id ? booksStore.put(book) : booksStore.add(book);
        
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(`Error saving book: ${event.target.error?.message}`);
    });
}

function loadBooksFromDB(status = null, category = null) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Database not initialized.");
        
        const books = [];
        const transaction = db.transaction(['books'], 'readonly');
        const booksStore = transaction.objectStore('books');
        
        let request;
        if (status) {
            const index = booksStore.index('by_status');
            request = index.openCursor(IDBKeyRange.only(status), 'prev');
        } else if (category) {
            const index = booksStore.index('by_category');
            request = index.openCursor(IDBKeyRange.only(category), 'prev');
        } else {
            const index = booksStore.index('by_date_added');
            request = index.openCursor(null, 'prev');
        }
        
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                books.push(cursor.value);
                cursor.continue();
            } else {
                resolve(books);
            }
        };
        
        request.onerror = (event) => reject(`Error loading books: ${event.target.error?.message}`);
    });
}

function getBookFromDB(id) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Database not initialized.");
        
        const transaction = db.transaction(['books'], 'readonly');
        const request = transaction.objectStore('books').get(id);
        
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(`Error getting book: ${event.target.error?.message}`);
    });
}

function deleteBookFromDB(id) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Database not initialized.");
        
        const transaction = db.transaction(['books', 'highlights', 'bookNotes'], 'readwrite');
        
        // Delete the book
        const booksStore = transaction.objectStore('books');
        booksStore.delete(id);
        
        // Delete associated highlights
        const highlightsStore = transaction.objectStore('highlights');
        const highlightsIndex = highlightsStore.index('by_book');
        const highlightsRequest = highlightsIndex.openCursor(IDBKeyRange.only(id));
        
        highlightsRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            }
        };
        
        // Delete associated book notes
        const bookNotesStore = transaction.objectStore('bookNotes');
        const bookNotesIndex = bookNotesStore.index('by_book');
        const bookNotesRequest = bookNotesIndex.openCursor(IDBKeyRange.only(id));
        
        bookNotesRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            }
        };
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => reject(`Error deleting book: ${event.target.error?.message}`);
    });
}

// --- HIGHLIGHT MANAGEMENT FUNCTIONS ---
function saveHighlightToDB(highlight) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Database not initialized.");
        
        const transaction = db.transaction(['highlights'], 'readwrite');
        const highlightsStore = transaction.objectStore('highlights');
        const request = highlight.id ? highlightsStore.put(highlight) : highlightsStore.add(highlight);
        
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(`Error saving highlight: ${event.target.error?.message}`);
    });
}

function loadHighlightsFromDB(bookId = null, color = null, category = null) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Database not initialized.");
        
        const highlights = [];
        const transaction = db.transaction(['highlights'], 'readonly');
        const highlightsStore = transaction.objectStore('highlights');
        
        let request;
        if (bookId) {
            const index = highlightsStore.index('by_book');
            request = index.openCursor(IDBKeyRange.only(bookId), 'prev');
        } else if (color) {
            const index = highlightsStore.index('by_color');
            request = index.openCursor(IDBKeyRange.only(color), 'prev');
        } else if (category) {
            const index = highlightsStore.index('by_category');
            request = index.openCursor(IDBKeyRange.only(category), 'rev');
        } else {
            const index = highlightsStore.index('by_date');
            request = index.openCursor(null, 'prev');
        }
        
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                highlights.push(cursor.value);
                cursor.continue();
            } else {
                resolve(highlights);
            }
        };
        
        request.onerror = (event) => reject(`Error loading highlights: ${event.target.error?.message}`);
    });
}

function deleteHighlightFromDB(id) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Database not initialized.");
        
        const transaction = db.transaction(['highlights', 'bookNotes'], 'readwrite');
        
        // Delete the highlight
        const highlightsStore = transaction.objectStore('highlights');
        highlightsStore.delete(id);
        
        // Delete associated book notes
        const bookNotesStore = transaction.objectStore('bookNotes');
        const bookNotesIndex = bookNotesStore.index('by_highlight');
        const bookNotesRequest = bookNotesIndex.openCursor(IDBKeyRange.only(id));
        
        bookNotesRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            }
        };
        
        transaction.oncomplete = () => resolve();
        transaction.onerror = (event) => reject(`Error deleting highlight: ${event.target.error?.message}`);
    });
}

// --- BOOK NOTES FUNCTIONS ---
function saveBookNoteToDB(bookNote) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Database not initialized.");
        
        const transaction = db.transaction(['bookNotes'], 'readwrite');
        const bookNotesStore = transaction.objectStore('bookNotes');
        const request = bookNote.id ? bookNotesStore.put(bookNote) : bookNotesStore.add(bookNote);
        
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(`Error saving book note: ${event.target.error?.message}`);
    });
}

function loadBookNotesFromDB(bookId = null, highlightId = null, type = null) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Database not initialized.");
        
        const bookNotes = [];
        const transaction = db.transaction(['bookNotes'], 'readonly');
        const bookNotesStore = transaction.objectStore('bookNotes');
        
        let request;
        if (bookId) {
            const index = bookNotesStore.index('by_book');
            request = index.openCursor(IDBKeyRange.only(bookId), 'prev');
        } else if (highlightId) {
            const index = bookNotesStore.index('by_highlight');
            request = index.openCursor(IDBKeyRange.only(highlightId), 'prev');
        } else if (type) {
            const index = bookNotesStore.index('by_type');
            request = index.openCursor(IDBKeyRange.only(type), 'prev');
        } else {
            const index = bookNotesStore.index('by_date');
            request = index.openCursor(null, 'prev');
        }
        
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                bookNotes.push(cursor.value);
                cursor.continue();
            } else {
                resolve(bookNotes);
            }
        };
        
        request.onerror = (event) => reject(`Error loading book notes: ${event.target.error?.message}`);
    });
}

function deleteBookNoteFromDB(id) {
    return new Promise((resolve, reject) => {
        if (!db) return reject("Database not initialized.");
        
        const transaction = db.transaction(['bookNotes'], 'readwrite');
        const request = transaction.objectStore('bookNotes').delete(id);
        
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(`Error deleting book note: ${event.target.error?.message}`);
    });
}


// --- SWEETALERT NOTIFICATION WRAPPER ---
/**
 * Shows a small, auto-closing toast notification for non-critical feedback.
 * @param {string} title The message to display.
 * @param {string} icon 'success', 'error', 'warning', 'info'.
 */
function showToast(title, icon = 'success') {
    if (typeof swal === 'undefined') { return; } // Don't crash if swal not loaded
    swal({
        title: title,
        icon: icon,
        timer: 2000, // Auto-close after 2 seconds
        buttons: false,
    });
}

// --- MODAL AND UI LOGIC ---
function openNoteModal(note = null) {
    if (note) {
        currentNoteId = note.id;
        noteTitle.value = note.title || '';
        noteContent.innerHTML = note.content || '';
        activeTag = note.tag;
    } else {
        currentNoteId = null;
        noteTitle.value = '';
        noteContent.innerHTML = '';
        activeTag = null;
        // REMOVED: Unimportant "new note" notification
    }
    document.querySelectorAll('.modal-content .tag').forEach(tagEl => {
        tagEl.classList.toggle('active', tagEl.dataset.tag === activeTag);
    });
    noteModal.classList.add('visible');
    noteTitle.focus();
}

function closeNoteModal() {
    noteModal.classList.remove('visible');
    setTimeout(() => { currentNoteId = null; activeTag = null; }, 200);
}

async function saveAndClose() {
    const title = noteTitle.value.trim();
    const content = noteContent.innerHTML.trim();
    if (!content && !title) {
        showToast('Your note needs a title or some content.', 'error');
        return;
    }
    await saveNote();
    closeNoteModal();
}

/**
 * Uses SweetAlert for a confirmation dialog, handling the promise.
 */
async function deleteAndClose() {
    if (!currentNoteId) {
        closeNoteModal();
        return;
    }
    const noteTitleText = noteTitle.value || 'this note';
    
    // SweetAlert returns a promise that resolves on user action
    swal({
        title: "Are you sure?",
        text: `Once deleted, you will not be able to recover "${noteTitleText}"!`,
        icon: "warning",
        buttons: ["Cancel", "Delete It"],
        dangerMode: true,
    })
    .then(async (willDelete) => {
        // This is the AJAX-like behavior: code runs *after* user clicks.
        if (willDelete) {
            await deleteNote();
            closeNoteModal();
        }
    });
}

// --- APPLICATION LOGIC ---
async function saveNote() {
    try {
        const now = new Date().toISOString();
        const note = { title: noteTitle.value.trim(), content: noteContent.innerHTML.trim(), tag: activeTag, updatedAt: now };
        if (currentNoteId) { note.id = currentNoteId; } else { note.createdAt = now; }
        const noteId = await saveNoteToDB(note);
        if (!currentNoteId) currentNoteId = noteId;
        showToast('Note Saved!', 'success');
        await loadNotes();
    } catch (error) {
        showToast('Error Saving Note', 'error');
        console.error('Save note error:', error);
    }
}

async function deleteNote() {
    try {
        await deleteNoteFromDB(currentNoteId);
        showToast('Note Deleted!', 'success');
        await loadNotes();
    } catch (error) {
        showToast('Error Deleting Note', 'error');
        console.error('Delete note error:', error);
    }
}

async function loadNotes() {
    try {
        const searchTerm = searchInput.value.trim();
        let notes = await loadNotesFromDB(null, searchTerm);
        
        // Apply category filter
        if (currentNoteFilter !== 'all') {
            notes = notes.filter(note => note.tag === currentNoteFilter);
        }
        
        renderNotes(notes);
        document.getElementById('notes-count').textContent = `(${notes.length})`;
    } catch (error) {
        showToast('Could not load notes.', 'error');
        console.error('Load notes error:', error);
    }
}

// --- VIEW MANAGEMENT FUNCTIONS ---
function switchView(viewName) {
    // Update active view state
    activeView = viewName;
    
    // Hide all view containers
    if (notesList) notesList.style.display = 'none';
    if (booksList) booksList.style.display = 'none';
    if (highlightsList) highlightsList.style.display = 'none';
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected view and update nav
    switch (viewName) {
        case 'notes':
            if (notesList) {
                notesList.style.display = 'block';
                loadNotes();
            }
            if (navNotes) navNotes.classList.add('active');
            // Show note-related sidebar sections
            document.querySelectorAll('.sidebar-section').forEach((section, index) => {
                if (index === 0 || index === 2 || index === 3) section.style.display = 'block';
                else section.style.display = 'none';
            });
            break;
        case 'books':
            if (booksList) {
                booksList.style.display = 'block';
                loadBooks();
            }
            if (navBooks) navBooks.classList.add('active');
            // Show book-related sidebar sections
            document.querySelectorAll('.sidebar-section').forEach((section, index) => {
                if (index === 0 || index === 2 || index === 4) section.style.display = 'block';
                else section.style.display = 'none';
            });
            break;
        case 'highlights':
            if (highlightsList) {
                highlightsList.style.display = 'block';
                loadHighlights();
            }
            if (navHighlights) navHighlights.classList.add('active');
            // Show highlight-related sidebar sections
            document.querySelectorAll('.sidebar-section').forEach((section, index) => {
                if (index === 0 || index === 2 || index === 5) section.style.display = 'block';
                else section.style.display = 'none';
            });
            break;
    }
}

// --- BOOK MANAGEMENT FUNCTIONS ---
async function saveBook() {
    try {
        const currentMethod = document.querySelector('.import-method.active').dataset.method;
        let bookData = {};
        
        const now = new Date().toISOString();
        
        if (currentMethod === 'text') {
            bookData = {
                title: document.getElementById('book-title-input').value.trim(),
                author: document.getElementById('book-author-input').value.trim() || 'Unknown Author',
                category: document.getElementById('book-category-select').value,
                content: document.getElementById('book-content-input').value.trim(),
                totalPages: Math.ceil(document.getElementById('book-content-input').value.length / 2500), // Estimate pages
                currentPage: 0,
                status: 'reading',
                dateAdded: now
            };
        } else if (currentMethod === 'manual') {
            bookData = {
                title: document.getElementById('manual-book-title').value.trim(),
                author: document.getElementById('manual-book-author').value.trim() || 'Unknown Author',
                isbn: document.getElementById('manual-book-isbn').value.trim(),
                category: document.getElementById('manual-book-category').value,
                totalPages: parseInt(document.getElementById('manual-total-pages').value) || 0,
                content: '', // Will be added later
                currentPage: 0,
                status: 'reading',
                dateAdded: now
            };
        }
        
        if (!bookData.title) {
            showToast('Book title is required!', 'error');
            return;
        }
        
        if (currentBookId) {
            bookData.id = currentBookId;
        }
        
        const bookId = await saveBookToDB(bookData);
        if (!currentBookId) currentBookId = bookId;
        
        showToast('Book saved successfully!', 'success');
        closeBookImportModal();
        
        if (activeView === 'books') {
            await loadBooks();
        }
        
    } catch (error) {
        showToast('Error saving book', 'error');
        console.error('Save book error:', error);
    }
}

async function loadBooks() {
    try {
        const searchTerm = searchBooksInput?.value.trim() || '';
        let books = await loadBooksFromDB();
        
        // Apply search filter
        if (searchTerm) {
            books = books.filter(book => 
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply status filter
        if (currentBookFilter !== 'all') {
            books = books.filter(book => book.status === currentBookFilter);
        }
        
        renderBooks(books);
        const booksCount = document.getElementById('books-count');
        if (booksCount) booksCount.textContent = `(${books.length})`;
    } catch (error) {
        showToast('Could not load books.', 'error');
        console.error('Load books error:', error);
    }
}

async function deleteBook(bookId) {
    try {
        await deleteBookFromDB(bookId);
        showToast('Book deleted successfully!', 'success');
        await loadBooks();
    } catch (error) {
        showToast('Error deleting book', 'error');
        console.error('Delete book error:', error);
    }
}

// --- HIGHLIGHT MANAGEMENT FUNCTIONS ---
async function saveHighlight(bookId, text, color, position, category = null) {
    try {
        const highlight = {
            bookId: bookId,
            text: text,
            color: color,
            category: category || getHighlightCategory(color),
            position: position,
            createdAt: new Date().toISOString()
        };
        
        const highlightId = await saveHighlightToDB(highlight);
        showToast('Text highlighted!', 'success');
        
        if (activeView === 'highlights') {
            await loadHighlights();
        }
        
        return highlightId;
    } catch (error) {
        showToast('Error saving highlight', 'error');
        console.error('Save highlight error:', error);
    }
}

async function loadHighlights() {
    try {
        const searchTerm = searchHighlightsInput?.value.trim() || '';
        let highlights = await loadHighlightsFromDB();
        
        // Apply search filter
        if (searchTerm) {
            highlights = highlights.filter(highlight => 
                highlight.text.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply color filter
        if (currentHighlightCategory !== 'all') {
            highlights = highlights.filter(highlight => highlight.color === currentHighlightCategory);
        }
        
        renderHighlights(highlights);
        const highlightsCount = document.getElementById('highlights-count');
        if (highlightsCount) highlightsCount.textContent = `(${highlights.length})`;
    } catch (error) {
        showToast('Could not load highlights.', 'error');
        console.error('Load highlights error:', error);
    }
}

// --- UTILITY FUNCTIONS ---
function getHighlightCategory(color) {
    const categories = {
        'yellow': 'Key Concepts',
        'green': 'Actionable Insights', 
        'blue': 'Memorable Quotes',
        'orange': 'Questions',
        'red': 'Critical Points'
    };
    return categories[color] || 'General';
}

function openBookImportModal() {
    currentBookId = null;
    // Reset form fields
    document.getElementById('book-title-input').value = '';
    document.getElementById('book-author-input').value = '';
    document.getElementById('book-content-input').value = '';
    
    if (bookImportModal) {
        bookImportModal.classList.add('visible');
    }
}

function closeBookImportModal() {
    if (bookImportModal) {
        bookImportModal.classList.remove('visible');
    }
    currentBookId = null;
}

function openBookReader(bookId) {
    currentBookId = bookId;
    // Implementation for book reader will be added in the next phase
    if (bookReaderModal) {
        bookReaderModal.classList.add('visible');
    }
}

function closeBookReader() {
    if (bookReaderModal) {
        bookReaderModal.classList.remove('visible');
    }
    currentBookId = null;
}

function renderNotes(notes) {
    notesContainer.innerHTML = '';
    if (notes.length === 0) {
        notesContainer.innerHTML = `<div class="empty-state"><i class="far fa-lightbulb"></i><h3>${searchInput.value ? 'No notes match your search.' : 'Your note space is empty!'}</h3><p>${searchInput.value ? 'Try a different keyword.' : 'Click the "+" button to create your first note.'}</p></div>`;
        return;
    }
    notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.dataset.id = note.id;
        
        const cardEmoji = getFirstEmoji(note.title, note.content);
        const previewText = getPreviewText(note.content);
        const tagEmoji = getTagEmoji(note.tag);
        const timeAgo = getTimeAgo(note.updatedAt);
        
        noteCard.innerHTML = `
            <div class="note-card-header">
                <div class="note-emoji">${cardEmoji}</div>
                <div class="note-tag">
                    <span class="tag-emoji">${tagEmoji}</span>
                    <span class="tag-name">${note.tag || 'General'}</span>
                </div>
            </div>
            <div class="note-card-content">
                <h3 class="note-card-title">${note.title || 'Untitled Note'}</h3>
                <p class="note-card-preview">${previewText}</p>
            </div>
            <div class="note-card-footer">
                <span class="note-date">${timeAgo}</span>
                <div class="note-card-actions">
                    <button class="quick-edit-btn" onclick="openNoteModal(${JSON.stringify(note).replace(/"/g, '&quot;')})" title="Edit note">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="quick-details-btn" onclick="openNotePreview(${JSON.stringify(note).replace(/"/g, '&quot;')})" title="Preview Note">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Make entire card clickable for preview (except action buttons)
        noteCard.addEventListener('click', (e) => {
            if (!e.target.closest('.note-card-actions')) {
                openNotePreview(note);
            }
        });
        
        notesContainer.appendChild(noteCard);
        
        // Add animation with staggered timing
        setTimeout(() => {
            noteCard.classList.add('visible');
        }, notes.indexOf(note) * 50);
    });
}

// --- BOOK RENDERING FUNCTIONS ---
function renderBooks(books) {
    if (!booksContainer) return;
    
    booksContainer.innerHTML = '';
    
    if (books.length === 0) {
        booksContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>${searchBooksInput?.value ? 'No books match your search.' : 'Your library is empty!'}</h3>
                <p>${searchBooksInput?.value ? 'Try a different keyword.' : 'Click "Add Book" to start building your library.'}</p>
                <button class="btn primary" onclick="openBookImportModal()">
                    <i class="fas fa-plus"></i> Add Your First Book
                </button>
            </div>
        `;
        return;
    }
    
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.dataset.id = book.id;
        
        const progress = book.totalPages ? Math.round((book.currentPage / book.totalPages) * 100) : 0;
        const statusEmoji = getBookStatusEmoji(book.status);
        const categoryEmoji = getBookCategoryEmoji(book.category);
        
        bookCard.innerHTML = `
            <div class="book-cover">
                <div class="book-cover-placeholder">
                    <i class="fas fa-book"></i>
                    <span class="book-category-emoji">${categoryEmoji}</span>
                </div>
                <div class="book-status">
                    <span class="status-badge ${book.status}">
                        ${statusEmoji} ${book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                    </span>
                </div>
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <div class="book-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="progress-text">${progress}% complete</span>
                </div>
                <div class="book-meta">
                    <span class="book-pages">
                        <i class="fas fa-file-alt"></i> ${book.totalPages || 'Unknown'} pages
                    </span>
                    <span class="book-category">
                        ${categoryEmoji} ${book.category}
                    </span>
                </div>
            </div>
            <div class="book-actions">
                <button class="action-btn read-btn" onclick="openBookReader(${book.id})" title="Read book">
                    <i class="fas fa-book-open"></i> Read
                </button>
                <button class="action-btn edit-btn" onclick="editBook(${book.id})" title="Edit book">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="confirmDeleteBook(${book.id})" title="Delete book">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Make card clickable to open reader
        bookCard.addEventListener('click', (e) => {
            if (!e.target.closest('.book-actions')) {
                openBookReader(book.id);
            }
        });
        
        booksContainer.appendChild(bookCard);
    });
}

// --- HIGHLIGHT RENDERING FUNCTIONS ---
function renderHighlights(highlights) {
    if (!highlightsContainer) return;
    
    highlightsContainer.innerHTML = '';
    
    if (highlights.length === 0) {
        highlightsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-highlighter"></i>
                <h3>${searchHighlightsInput?.value ? 'No highlights match your search.' : 'No highlights yet!'}</h3>
                <p>${searchHighlightsInput?.value ? 'Try a different keyword.' : 'Start reading books and highlight important passages.'}</p>
                <button class="btn primary" onclick="switchView('books')">
                    <i class="fas fa-book"></i> Browse Books
                </button>
            </div>
        `;
        return;
    }
    
    // Group highlights by book for better organization
    const highlightsByBook = highlights.reduce((acc, highlight) => {
        if (!acc[highlight.bookId]) {
            acc[highlight.bookId] = [];
        }
        acc[highlight.bookId].push(highlight);
        return acc;
    }, {});
    
    Object.entries(highlightsByBook).forEach(([bookId, bookHighlights]) => {
        // Create book section header
        const bookSection = document.createElement('div');
        bookSection.className = 'highlights-book-section';
        
        // We'll need to get book info - for now use placeholder
        bookSection.innerHTML = `
            <div class="book-section-header">
                <h4><i class="fas fa-book"></i> Book Highlights</h4>
                <span class="highlight-count">${bookHighlights.length} highlights</span>
            </div>
        `;
        
        const highlightsGrid = document.createElement('div');
        highlightsGrid.className = 'highlights-grid';
        
        bookHighlights.forEach(highlight => {
            const highlightCard = document.createElement('div');
            highlightCard.className = `highlight-card ${highlight.color}`;
            highlightCard.dataset.id = highlight.id;
            
            const timeAgo = getTimeAgo(highlight.createdAt);
            const colorLabel = getHighlightCategory(highlight.color);
            
            highlightCard.innerHTML = `
                <div class="highlight-header">
                    <div class="highlight-color">
                        <span class="color-dot ${highlight.color}"></span>
                        <span class="color-label">${colorLabel}</span>
                    </div>
                    <div class="highlight-actions">
                        <button class="action-btn" onclick="addNoteToHighlight(${highlight.id})" title="Add note">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="confirmDeleteHighlight(${highlight.id})" title="Delete highlight">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="highlight-content">
                    <blockquote>"${highlight.text}"</blockquote>
                </div>
                <div class="highlight-footer">
                    <span class="highlight-date">${timeAgo}</span>
                    ${highlight.note ? `<span class="has-note"><i class="fas fa-sticky-note"></i> Has note</span>` : ''}
                </div>
            `;
            
            highlightsGrid.appendChild(highlightCard);
        });
        
        bookSection.appendChild(highlightsGrid);
        highlightsContainer.appendChild(bookSection);
    });
}

// --- UTILITY FUNCTIONS FOR RENDERING ---
function getBookStatusEmoji(status) {
    const emojis = {
        'reading': '📖',
        'completed': '✅',
        'paused': '⏸️'
    };
    return emojis[status] || '📚';
}

function getBookCategoryEmoji(category) {
    const emojis = {
        'fiction': '📚',
        'non-fiction': '📖',
        'self-help': '💡',
        'technical': '🔧',
        'biography': '👤',
        'business': '💼',
        'other': '📄'
    };
    return emojis[category] || '📚';
}

function confirmDeleteBook(bookId) {
    swal({
        title: "Delete Book?",
        text: "This will also delete all highlights and notes for this book. This action cannot be undone.",
        icon: "warning",
        buttons: ["Cancel", "Delete Book"],
        dangerMode: true,
    }).then(async (willDelete) => {
        if (willDelete) {
            await deleteBook(bookId);
        }
    });
}

function confirmDeleteHighlight(highlightId) {
    swal({
        title: "Delete Highlight?",
        text: "This action cannot be undone.",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
    }).then(async (willDelete) => {
        if (willDelete) {
            await deleteHighlightFromDB(highlightId);
            await loadHighlights();
            showToast('Highlight deleted!', 'success');
        }
    });
}

function editBook(bookId) {
    // Implementation for editing book details
    showToast('Edit book feature coming soon!', 'info');
}

function addNoteToHighlight(highlightId) {
    // Implementation for adding notes to highlights
    showToast('Add note to highlight feature coming soon!', 'info');
}

function getFirstEmoji(title, content) { const fullText = `${title} ${content}`; const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u; const match = fullText.match(emojiRegex); return match ? match[0] : '📝'; }

function getPreviewText(content) {
    if (!content) return 'No content';
    // Strip HTML and get first 120 characters
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text.length > 120 ? text.substring(0, 120) + '...' : text;
}

function getTagEmoji(tag) {
    const tagEmojis = {
        idea: '💡',
        task: '✅',
        meeting: '📹',
        personal: '❤️'
    };
    return tagEmojis[tag] || '📝';
}

function getTimeAgo(dateString) {
    if (!dateString) return 'Unknown';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
}

function openNotePreview(note) {
    // Create preview modal
    const previewModal = document.createElement('div');
    previewModal.className = 'note-preview-modal';
    previewModal.innerHTML = `
        <div class="preview-overlay"></div>
        <div class="preview-content">
            <div class="preview-header">
                <div class="preview-title">
                    <span class="preview-emoji">${getFirstEmoji(note.title, note.content)}</span>
                    <h2>${note.title || 'Untitled Note'}</h2>
                </div>
                <div class="preview-actions">
                    <button class="preview-edit-btn" title="Edit Note">
                        <i class="fas fa-edit"></i>
                        <span class="edit-text">Edit</span>
                    </button>
                    <button class="preview-close-btn" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="preview-meta">
                <div class="meta-left">
                    <span class="preview-tag">${getTagEmoji(note.tag)} ${note.tag || 'No category'}</span>
                    <span class="preview-time">${getTimeAgo(note.updatedAt)}</span>
                </div>
                <div class="meta-hint">
                    <button class="hint-preview-btn" title="Cards open in preview mode">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="preview-body">
                ${note.content || '<em>No content</em>'}
            </div>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(previewModal);
    
    // Add event listeners
    const closeBtn = previewModal.querySelector('.preview-close-btn');
    const editBtn = previewModal.querySelector('.preview-edit-btn');
    const overlay = previewModal.querySelector('.preview-overlay');
    
    const closePreview = () => {
        previewModal.classList.add('closing');
        setTimeout(() => {
            document.body.removeChild(previewModal);
        }, 300);
    };
    
    closeBtn.addEventListener('click', closePreview);
    overlay.addEventListener('click', closePreview);
    editBtn.addEventListener('click', () => {
        closePreview();
        openNoteModal(note);
    });
    
    // Show modal with animation
    setTimeout(() => {
        previewModal.classList.add('visible');
    }, 10);
    
    // ESC key to close
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closePreview();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

function cycleTheme() {
    const currentThemeName = document.documentElement.getAttribute('data-theme') || 'light';
    const currentThemeIndex = themes.findIndex(t => t.name === currentThemeName);
    const nextTheme = themes[(currentThemeIndex + 1) % themes.length];
    document.documentElement.setAttribute('data-theme', nextTheme.name);
    localStorage.setItem('theme', nextTheme.name);
    themeToggle.querySelector('i').className = `fas ${nextTheme.icon}`;
    // REMOVED: Unimportant "theme changed" notification
}

// --- PWA INSTALL PROMPT FUNCTIONS ---

// --- MOBILE MENU FUNCTIONS ---

function openMobileMenu() {
    if (mobileSidebar) {
        mobileSidebar.classList.add('open');
        sidebarOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
}

function closeMobileMenu() {
    if (mobileSidebar) {
        mobileSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('visible');
        document.body.style.overflow = 'auto';
    }
}

// --- ENHANCED EMOJI FUNCTIONS ---

function renderEmojiCategory(category) {
    if (!emojiContent) return;
    
    const emojis = emojiData[category] || [];
    const grid = document.createElement('div');
    grid.className = 'emoji-grid';
    
    emojis.forEach(emoji => {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.className = 'emoji-item';
        span.addEventListener('click', () => insertEmoji(emoji));
        grid.appendChild(span);
    });
    
    emojiContent.innerHTML = '';
    emojiContent.appendChild(grid);
}

function insertEmoji(emoji) {
    if (noteContent) {
        noteContent.focus();
        // Add to recent emojis
        addToRecentEmojis(emoji);
        
        // Insert at cursor position
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const emojiNode = document.createTextNode(emoji);
            range.insertNode(emojiNode);
            range.setStartAfter(emojiNode);
            range.setEndAfter(emojiNode);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            noteContent.innerHTML += emoji;
        }
        
        // Close emoji picker
        emojiPicker.classList.remove('visible');
    }
}

function addToRecentEmojis(emoji) {
    let recent = emojiData.recent;
    // Remove if already exists
    recent = recent.filter(e => e !== emoji);
    // Add to front
    recent.unshift(emoji);
    // Keep only 20 most recent
    recent = recent.slice(0, 20);
    
    emojiData.recent = recent;
    localStorage.setItem('recentEmojis', JSON.stringify(recent));
}

function searchEmojis(query) {
    if (!query.trim()) {
        renderEmojiCategory(currentEmojiCategory);
        return;
    }
    
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    // Search through all categories
    Object.values(emojiData).flat().forEach(emoji => {
        // Simple matching - you could enhance this with emoji names/keywords
        if (emoji.includes(query) || results.length < 50) {
            if (!results.includes(emoji)) {
                results.push(emoji);
            }
        }
    });
    
    // Render search results
    const grid = document.createElement('div');
    grid.className = 'emoji-grid';
    
    results.forEach(emoji => {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.className = 'emoji-item';
        span.addEventListener('click', () => insertEmoji(emoji));
        grid.appendChild(span);
    });
    
    emojiContent.innerHTML = '';
    if (results.length > 0) {
        emojiContent.appendChild(grid);
    } else {
        emojiContent.innerHTML = '<div class="no-results">No emojis found 😢</div>';
    }
}

function filterNotesByCategory(filter) {
    currentNoteFilter = filter;
    loadNotes(); // Reload notes with filter
}

/**
 * Shows the install prompt banner if conditions are met
 */
function showInstallPrompt() {
    console.log('PWA: Checking if install prompt should be shown...');
    console.log('PWA: installPrompt element:', !!installPrompt);
    console.log('PWA: installPromptShown:', installPromptShown);
    console.log('PWA: deferredPrompt available:', !!deferredPrompt);
    
    if (!installPrompt) {
        console.log('PWA: Install prompt element not found');
        return;
    }
    
    if (installPromptShown) {
        console.log('PWA: Install prompt already shown this session');
        return;
    }
    
    if (!deferredPrompt) {
        console.log('PWA: No deferred prompt available. This could mean:');
        console.log('- App is already installed');
        console.log('- PWA criteria not met (missing icons, manifest issues)');
        console.log('- Browser doesn\'t support PWA install prompts');
        return;
    }
    
    // Check if user previously dismissed the prompt
    const dismissedTime = localStorage.getItem('installPromptDismissed');
    if (dismissedTime) {
        const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
        console.log('PWA: Days since dismissed:', daysSinceDismissed);
        if (daysSinceDismissed < 7) { // Don't show again for 7 days
            console.log('PWA: Install prompt dismissed recently, waiting 7 days');
            return;
        }
    }
    
    console.log('PWA: Showing install prompt!');
    installPrompt.classList.remove('hidden');
    installPromptShown = true;
    
    // Auto-hide after 10 seconds if not interacted with
    setTimeout(() => {
        if (installPrompt && !installPrompt.classList.contains('hidden')) {
            console.log('PWA: Auto-hiding install prompt after 10 seconds');
            hideInstallPrompt();
        }
    }, 10000);
}

/**
 * Hides the install prompt banner
 */
function hideInstallPrompt() {
    if (installPrompt) {
        installPrompt.classList.add('hidden');
    }
}

/**
 * Handles the install button click
 */
async function handleInstallClick() {
    if (!deferredPrompt) {
        showToast('Install not available', 'error');
        return;
    }
    
    hideInstallPrompt();
    
    try {
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            showToast('Thanks for installing Yaadannoo! 🎉', 'success');
            localStorage.setItem('appInstalled', 'true');
        } else {
            showToast('Maybe next time! 😊', 'info');
        }
        
        // Reset the deferred prompt
        deferredPrompt = null;
    } catch (error) {
        console.error('Install prompt failed:', error);
        showToast('Install failed. Please try again.', 'error');
    }
}

/**
 * Handles dismissing the install prompt
 */
function handleInstallDismiss() {
    hideInstallPrompt();
    localStorage.setItem('installPromptDismissed', Date.now().toString());
    showToast('You can install later from your browser menu', 'info');
}

/**
 * Checks if the app should show install prompt based on usage
 */
function checkInstallEligibility() {
    console.log('PWA: Checking install eligibility...');
    
    // Don't show if already installed
    if (localStorage.getItem('appInstalled') === 'true') {
        console.log('PWA: App already marked as installed');
        return;
    }
    
    // Don't show if running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('PWA: App running in standalone mode, marking as installed');
        localStorage.setItem('appInstalled', 'true');
        return;
    }
    
    // Track app usage
    let usageCount = parseInt(localStorage.getItem('appUsageCount') || '0');
    usageCount++;
    localStorage.setItem('appUsageCount', usageCount.toString());
    console.log('PWA: Usage count:', usageCount);
    
    // Show install prompt after 2 uses (reduced for testing)
    if (usageCount >= 2) {
        console.log('PWA: Usage threshold met, checking for deferred prompt...');
        if (deferredPrompt) {
            console.log('PWA: Scheduling install prompt to show in 2 seconds');
            setTimeout(showInstallPrompt, 2000); // Show after 2 seconds
        } else {
            console.log('PWA: No deferred prompt available yet');
            // Try again in 3 seconds in case the event hasn\'t fired yet
            setTimeout(() => {
                if (deferredPrompt) {
                    console.log('PWA: Deferred prompt now available, showing install prompt');
                    showInstallPrompt();
                } else {
                    console.log('PWA: Still no deferred prompt. Check PWA requirements.');
                }
            }, 3000);
        }
    } else {
        console.log(`PWA: Need ${2 - usageCount} more visits before showing install prompt`);
    }
}

// --- INITIALIZATION AND EVENT LISTENERS ---
function setupEventListeners() {
    if (!newNoteBtn || !floatingNewNote || !modalOverlay || !closeModalBtn || !saveBtn || !deleteBtn || !themeToggle || !searchInput) { console.error("A critical element is missing. Aborting event listener setup."); return; }
    newNoteBtn.addEventListener('click', () => openNoteModal());
    floatingNewNote.addEventListener('click', () => openNoteModal());
    modalOverlay.addEventListener('click', closeNoteModal);
    closeModalBtn.addEventListener('click', closeNoteModal);
    saveBtn.addEventListener('click', saveAndClose);
    deleteBtn.addEventListener('click', deleteAndClose);
    themeToggle.addEventListener('click', cycleTheme);
    searchInput.addEventListener('input', loadNotes);
    document.querySelectorAll('.modal-content .tag').forEach(tagEl => { tagEl.addEventListener('click', () => { activeTag = (activeTag === tagEl.dataset.tag) ? null : tagEl.dataset.tag; document.querySelectorAll('.modal-content .tag').forEach(el => { el.classList.toggle('active', el.dataset.tag === activeTag); }); }); });
    emojiPickerBtn.addEventListener('click', (e) => { e.stopPropagation(); emojiPicker.classList.toggle('visible'); });
    document.querySelectorAll('.emoji-grid span').forEach(emoji => { emoji.addEventListener('click', () => { noteContent.focus(); document.execCommand('insertText', false, emoji.textContent); emojiPicker.classList.remove('visible'); }); });
    document.addEventListener('click', (e) => { if (emojiPicker && !emojiPicker.parentElement.contains(e.target)) emojiPicker.classList.remove('visible'); });
    document.querySelectorAll('.tool-btn').forEach(btn => { btn.addEventListener('click', () => { noteContent.focus(); document.execCommand(btn.dataset.action, false, null); }); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && noteModal.classList.contains('visible')) closeNoteModal(); if ((e.ctrlKey || e.metaKey) && e.key === 's' && noteModal.classList.contains('visible')) { e.preventDefault(); saveAndClose(); } });
    
    // PWA Install Prompt Event Listeners
    if (installButton) {
        installButton.addEventListener('click', handleInstallClick);
    }
    if (installDismiss) {
        installDismiss.addEventListener('click', handleInstallDismiss);
    }
    
    // PWA Install Events
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('PWA: beforeinstallprompt event triggered! 🎉');
        console.log('PWA: This means the browser recognizes this as a valid PWA');
        e.preventDefault(); // Prevent the mini-infobar from appearing
        deferredPrompt = e; // Store the event for later use
        
        console.log('PWA: Deferred prompt stored, checking eligibility...');
        // Check if we should show the install prompt
        checkInstallEligibility();
    });
    
    // Handle successful app installation
    window.addEventListener('appinstalled', (e) => {
        console.log('PWA was installed successfully');
        hideInstallPrompt();
        localStorage.setItem('appInstalled', 'true');
        showToast('Yaadannoo installed successfully! 🎉', 'success');
        deferredPrompt = null;
    });
    
    // Mobile Menu Event Listeners
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileMenu);
    }
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeMobileMenu);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Sidebar Actions
    const sidebarNewNote = document.getElementById('sidebar-new-note');
    const sidebarSearch = document.getElementById('sidebar-search');
    const sidebarTheme = document.getElementById('sidebar-theme');
    
    if (sidebarNewNote) {
        sidebarNewNote.addEventListener('click', () => {
            closeMobileMenu();
            openNoteModal();
        });
    }
    
    if (sidebarSearch) {
        sidebarSearch.addEventListener('click', () => {
            closeMobileMenu();
            searchInput.focus();
        });
    }
    
    if (sidebarTheme) {
        sidebarTheme.addEventListener('click', () => {
            closeMobileMenu();
            cycleTheme();
        });
    }
    
    // Emoji Filter Buttons
    document.querySelectorAll('.emoji-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            currentNoteFilter = filter;
            
            // Update active state
            document.querySelectorAll('.emoji-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            closeMobileMenu();
            loadNotes();
        });
    });
    
    // Enhanced Emoji Picker Event Listeners
    if (emojiSearchInput) {
        emojiSearchInput.addEventListener('input', (e) => {
            searchEmojis(e.target.value);
        });
    }
    
    // Navigation Events
    if (navNotes) navNotes.addEventListener('click', () => switchView('notes'));
    if (navBooks) navBooks.addEventListener('click', () => switchView('books'));
    if (navHighlights) navHighlights.addEventListener('click', () => switchView('highlights'));
    
    // Book Management Events
    if (addBookBtn) addBookBtn.addEventListener('click', openBookImportModal);
    if (saveBookBtn) saveBookBtn.addEventListener('click', saveBook);
    if (searchBooksInput) searchBooksInput.addEventListener('input', debounce(loadBooks, 300));
    if (searchHighlightsInput) searchHighlightsInput.addEventListener('input', debounce(loadHighlights, 300));
    
    // Sidebar Book Actions
    const sidebarNewBook = document.getElementById('sidebar-new-book');
    if (sidebarNewBook) {
        sidebarNewBook.addEventListener('click', () => {
            closeMobileMenu();
            openBookImportModal();
        });
    }
    
    // Book Import Modal Events
    const importMethods = document.querySelectorAll('.import-method');
    importMethods.forEach(method => {
        method.addEventListener('click', () => {
            // Remove active class from all methods
            importMethods.forEach(m => m.classList.remove('active'));
            // Add active class to clicked method
            method.classList.add('active');
            
            // Show corresponding panel
            const selectedMethod = method.dataset.method;
            document.querySelectorAll('.import-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            const targetPanel = document.getElementById(`${selectedMethod}-import`);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });
    
    // File Drop Zone Events
    const fileDropZone = document.getElementById('file-drop-zone');
    const fileInput = document.getElementById('file-input');
    
    if (fileDropZone && fileInput) {
        fileDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileDropZone.classList.add('dragover');
        });
        
        fileDropZone.addEventListener('dragleave', () => {
            fileDropZone.classList.remove('dragover');
        });
        
        fileDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            fileDropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });
    }
    
    // Book Filter Events
    const bookFilters = document.querySelectorAll('.book-filter');
    bookFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            bookFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            currentBookFilter = filter.dataset.status;
            loadBooks();
            closeMobileMenu();
        });
    });
    
    // Highlight Filter Events
    const highlightFilters = document.querySelectorAll('.highlight-filter');
    highlightFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            highlightFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            currentHighlightCategory = filter.dataset.color;
            loadHighlights();
            closeMobileMenu();
        });
    });
    
    // Highlight Color Filter Buttons in Highlights View
    const highlightColorBtns = document.querySelectorAll('.highlight-color-btn');
    highlightColorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            highlightColorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentHighlightCategory = btn.dataset.color;
            loadHighlights();
        });
    });
    
    // Modal Close Events for Book Modals
    const bookImportModalOverlay = bookImportModal?.querySelector('.modal-overlay');
    if (bookImportModalOverlay) {
        bookImportModalOverlay.addEventListener('click', closeBookImportModal);
    }
    
    const bookReaderModalOverlay = bookReaderModal?.querySelector('.modal-overlay');
    if (bookReaderModalOverlay) {
        bookReaderModalOverlay.addEventListener('click', closeBookReader);
    }
    
    // Book Import Modal Close Button
    const bookImportCloseBtn = bookImportModal?.querySelector('.modal-close-btn');
    if (bookImportCloseBtn) {
        bookImportCloseBtn.addEventListener('click', closeBookImportModal);
    }
    
    // Emoji Category Tabs
    document.querySelectorAll('.emoji-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            currentEmojiCategory = category;
            
            // Update active tab
            document.querySelectorAll('.emoji-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Render category
            renderEmojiCategory(category);
            
            // Clear search
            if (emojiSearchInput) {
                emojiSearchInput.value = '';
            }
        });
    });
    
    // Initialize emoji picker
    renderEmojiCategory('recent');
    
    // Touch gestures for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Swipe right to open menu (from left edge)
        if (deltaX > 100 && Math.abs(deltaY) < 100 && touchStartX < 50) {
            openMobileMenu();
        }
        
        // Swipe left to close menu
        if (deltaX < -100 && Math.abs(deltaY) < 100 && mobileSidebar && mobileSidebar.classList.contains('open')) {
            closeMobileMenu();
        }
        
        touchStartX = 0;
        touchStartY = 0;
    });
}

async function initApp() {
    try {
        const savedThemeName = localStorage.getItem('theme') || 'light';
        const savedTheme = themes.find(t => t.name === savedThemeName) || themes[0];
        document.documentElement.setAttribute('data-theme', savedTheme.name);
        themeToggle.querySelector('i').className = `fas ${savedTheme.icon}`;
        await openDatabase();
        
        // Initialize with Notes view
        switchView('notes');
        
        setupEventListeners();
        const allNotes = await loadNotesFromDB();
        if (allNotes.length === 0) {
            await saveNoteToDB({ 
                title: "Welcome to Yaadannoo! 🌈", 
                content: `<p>This is your new favorite note-taking app. Here are a few tips:</p><ul><li>Click the <b>plus icon</b> to create new notes.</li><li>Click <i>this note</i> to open the editor.</li><li>Your notes are saved automatically in your browser.</li><li>Use the <b>Books</b> section to start your reading journey.</li></ul><p>Go ahead and delete this welcome note to get started!</p>`, 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString() 
            });
            await loadNotes();
        }
        
        // Check PWA install eligibility
        checkInstallEligibility();
    } catch (error) {
        swal("Initialization Error", `The app could not start correctly: ${error}`, "error");
        console.error('Initialization error:', error);
    }
}

document.addEventListener('DOMContentLoaded', initApp);

// --- FILE UPLOAD HELPER FUNCTIONS ---
function handleFileUpload(file) {
    if (file.type === 'text/plain' || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            // Try to extract title from filename
            const fileName = file.name.replace(/\.[^/.]+$/, "");
            
            document.getElementById('book-title-input').value = fileName;
            document.getElementById('book-content-input').value = content;
            
            // Show file info
            const fileInfo = document.getElementById('file-info');
            const fileNameElement = document.getElementById('file-name');
            if (fileInfo && fileNameElement) {
                fileNameElement.textContent = file.name;
                fileInfo.style.display = 'block';
            }
        };
        reader.readAsText(file);
    } else {
        showToast('Please upload a text (.txt) or markdown (.md) file', 'error');
    }
}

function clearFileSelection() {
    const fileInput = document.getElementById('file-input');
    const fileInfo = document.getElementById('file-info');
    if (fileInput) fileInput.value = '';
    if (fileInfo) fileInfo.style.display = 'none';
    
    document.getElementById('book-title-input').value = '';
    document.getElementById('book-content-input').value = '';
}

// --- UTILITY FUNCTIONS ---
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}