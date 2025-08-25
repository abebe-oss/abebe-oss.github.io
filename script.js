// App state variables
let db;
let currentNoteId = null;
let activeTag = null;

// Book management state variables
let currentBookId = null;
let currentChapterId = null;
let currentReadingPosition = 0;
let activeView = 'books'; // 'notes', 'books', 'highlights', 'reading'
let currentBookFilter = 'all'; // 'all', 'reading', 'completed', 'paused'
let selectedHighlightColor = 'yellow'; // Default highlight color
let currentHighlightCategory = 'all';
let highlightsPerPage = 20;
let currentHighlightPage = 1;
let isCompactHighlightView = false;
let collapsedBookSections = new Set();

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


// --- HONEY-TOAST NOTIFICATION WRAPPER ---
/**
 * Shows a small, auto-closing toast notification for non-critical feedback.
 * @param {string} title The message to display.
 * @param {string} icon 'success', 'error', 'warning', 'info'.
 */
function showToast(title, icon = 'success') {
    if (typeof toast !== 'undefined') {
        // Use honey-toast with the simple API
        try {
            // Try with options object first
            toast.notify({
                message: title,
                type: icon === 'error' ? 'error' : icon === 'warning' ? 'warning' : icon === 'info' ? 'info' : 'success',
                duration: 2000,
                position: 'bottom-right'
            });
        } catch (e) {
            // Fallback to simple string API
            toast.notify(title);
        }
    } else {
        // Fallback to console and try to create a simple toast
        console.log(`${icon.toUpperCase()}: ${title}`);
        
        // Create a simple toast element
        const toastEl = document.createElement('div');
        toastEl.className = `simple-toast toast-${icon}`;
        toastEl.textContent = title;
        toastEl.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${icon === 'error' ? '#ef4444' : icon === 'warning' ? '#f59e0b' : icon === 'info' ? '#3b82f6' : '#10b981'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(toastEl);
        
        // Auto-remove after 2 seconds
        setTimeout(() => {
            toastEl.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(toastEl)) {
                    document.body.removeChild(toastEl);
                }
            }, 300);
        }, 2000);
    }
}

/**
 * Shows a centered confirmation dialog using custom modal with honey-toast styling
 * @param {string} title The confirmation title
 * @param {string} message The confirmation message
 * @param {function} onConfirm Callback when user confirms
 * @param {function} onCancel Optional callback when user cancels
 */
function showConfirmation(title, message, onConfirm, onCancel = null) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // Create custom confirmation modal
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'confirmation-modal-overlay';
    confirmationModal.innerHTML = `
        <div class="confirmation-modal theme-${currentTheme}">
            <div class="confirmation-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="confirmation-content">
                <h3 class="confirmation-title">${title}</h3>
                <p class="confirmation-message">${message}</p>
            </div>
            <div class="confirmation-actions">
                <button class="btn confirmation-cancel">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="btn confirmation-confirm">
                    <i class="fas fa-check"></i> Confirm
                </button>
            </div>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(confirmationModal);
    
    // Add event listeners
    const cancelBtn = confirmationModal.querySelector('.confirmation-cancel');
    const confirmBtn = confirmationModal.querySelector('.confirmation-confirm');
    const overlay = confirmationModal;
    
    const closeModal = (confirmed = false) => {
        confirmationModal.classList.add('closing');
        setTimeout(() => {
            if (document.body.contains(confirmationModal)) {
                document.body.removeChild(confirmationModal);
            }
        }, 200);
        
        if (confirmed && onConfirm) {
            onConfirm();
        } else if (!confirmed && onCancel) {
            onCancel();
        }
    };
    
    cancelBtn.addEventListener('click', () => {
        closeModal(false);
        showToast('Action cancelled', 'info');
    });
    
    confirmBtn.addEventListener('click', () => {
        closeModal(true);
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(false);
            showToast('Action cancelled', 'info');
        }
    });
    
    // Close on Escape key
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            closeModal(false);
            showToast('Action cancelled', 'info');
            document.removeEventListener('keydown', handleKeyDown);
        }
    };
    document.addEventListener('keydown', handleKeyDown);
    
    // Show modal with animation
    setTimeout(() => {
        confirmationModal.classList.add('visible');
    }, 10);
}

/**
 * Enhanced Modal System for Smooth User Interactions
 * Uses honey-toast styling with theme-adaptive design
 */

/**
 * Shows a theme-adaptive input modal for text entry
 * @param {string} title Modal title
 * @param {string} message Modal message/description
 * @param {string} placeholder Input placeholder text
 * @param {string} defaultValue Default input value
 * @param {function} onConfirm Callback with input value
 * @param {function} onCancel Optional callback when cancelled
 */
function showInputModal(title, message, placeholder = '', defaultValue = '', onConfirm, onCancel = null) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    const inputModal = document.createElement('div');
    inputModal.className = 'input-modal-overlay';
    inputModal.innerHTML = `
        <div class="input-modal theme-${currentTheme}">
            <div class="modal-header">
                <div class="modal-icon">
                    <i class="fas fa-edit"></i>
                </div>
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close-btn" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p class="modal-message">${message}</p>
                <div class="input-group">
                    <textarea class="modal-input" placeholder="${placeholder}" rows="4">${defaultValue}</textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn modal-cancel">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="btn modal-confirm primary">
                    <i class="fas fa-check"></i> Save
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(inputModal);
    
    const input = inputModal.querySelector('.modal-input');
    const cancelBtn = inputModal.querySelector('.modal-cancel');
    const confirmBtn = inputModal.querySelector('.modal-confirm');
    const closeBtn = inputModal.querySelector('.modal-close-btn');
    const overlay = inputModal;
    
    // Focus input and select text if there's default value
    setTimeout(() => {
        input.focus();
        if (defaultValue) {
            input.select();
        }
    }, 100);
    
    const closeModal = (confirmed = false) => {
        inputModal.classList.add('closing');
        setTimeout(() => {
            if (document.body.contains(inputModal)) {
                document.body.removeChild(inputModal);
            }
        }, 300);
        
        if (confirmed && onConfirm) {
            const value = input.value.trim();
            onConfirm(value);
        } else if (!confirmed && onCancel) {
            onCancel();
        }
    };
    
    // Event listeners
    cancelBtn.addEventListener('click', () => closeModal(false));
    closeBtn.addEventListener('click', () => closeModal(false));
    confirmBtn.addEventListener('click', () => closeModal(true));
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(false);
        }
    });
    
    // Keyboard shortcuts
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            closeModal(true);
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal(false);
        }
    });
    
    // Show modal with animation
    setTimeout(() => {
        inputModal.classList.add('visible');
    }, 10);
}

/**
 * Alias for backward compatibility - uses enhanced confirmation
 */
function showEnhancedConfirmation(title, message, onConfirm, onCancel = null, confirmText = 'Confirm', cancelText = 'Cancel') {
    showConfirmation(title, message, onConfirm, onCancel);
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
 * Uses custom confirmation dialog for better UX.
 */
async function deleteAndClose() {
    if (!currentNoteId) {
        closeNoteModal();
        return;
    }
    const noteTitleText = noteTitle.value || 'this note';
    
    showConfirmation(
        "Are you sure?",
        `Once deleted, you will not be able to recover "${noteTitleText}"!`,
        async () => {
            // User confirmed - delete the note
            await deleteNote();
            closeNoteModal();
        }
    );
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
        
        // Load book notes and integrate them
        const bookNotes = await loadBookNotesFromDB();
        const books = await loadBooksFromDB();
        
        // Convert book notes to note format for unified display
        const convertedBookNotes = await Promise.all(bookNotes.map(async (bookNote) => {
            const book = books.find(b => b.id === bookNote.bookId);
            const bookTitle = book ? book.title : 'Unknown Book';
            const bookAuthor = book ? book.author : 'Unknown Author';
            
            return {
                id: `book-note-${bookNote.id}`,
                title: `📖 Note from "${bookTitle}"`,
                content: `<div class="book-note-context">
                    <p><strong>From:</strong> ${bookTitle} by ${bookAuthor}</p>
                    <div class="book-note-content">${bookNote.content}</div>
                </div>`,
                tag: 'Book Note',
                createdAt: bookNote.createdAt,
                updatedAt: bookNote.createdAt,
                isBookNote: true,
                originalBookNote: bookNote,
                bookId: bookNote.bookId,
                bookTitle: bookTitle
            };
        }));
        
        // Combine and sort all notes by date
        const allNotes = [...notes, ...convertedBookNotes];
        
        // Apply search filter to combined notes
        let filteredNotes = allNotes;
        if (searchTerm) {
            filteredNotes = allNotes.filter(note => 
                note.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (note.bookTitle && note.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        // Apply category filter
        if (currentNoteFilter !== 'all') {
            filteredNotes = filteredNotes.filter(note => note.tag === currentNoteFilter);
        }
        
        // Sort by date (most recent first)
        filteredNotes.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
        
        renderNotes(filteredNotes);
        document.getElementById('notes-count').textContent = `(${filteredNotes.length})`;
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
    
    // Update navigation buttons (both mobile and desktop)
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.desktop-nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected view and update nav
    switch (viewName) {
        case 'notes':
            if (notesList) {
                notesList.style.display = 'block';
                loadNotes();
            }
            if (navNotes) navNotes.classList.add('active');
            const navNotesDesktop = document.getElementById('nav-notes-desktop');
            if (navNotesDesktop) navNotesDesktop.classList.add('active');
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
            const navBooksDesktop = document.getElementById('nav-books-desktop');
            if (navBooksDesktop) navBooksDesktop.classList.add('active');
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
            const navHighlightsDesktop = document.getElementById('nav-highlights-desktop');
            if (navHighlightsDesktop) navHighlightsDesktop.classList.add('active');
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
        } else if (currentMethod === 'file') {
            // File upload method uses the same fields as text method
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
        
        // Sort by date (newest first)
        highlights.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Calculate pagination
        const totalHighlights = highlights.length;
        const totalPages = Math.ceil(totalHighlights / highlightsPerPage);
        const startIndex = (currentHighlightPage - 1) * highlightsPerPage;
        const endIndex = startIndex + highlightsPerPage;
        const paginatedHighlights = highlights.slice(startIndex, endIndex);
        
        renderHighlights(paginatedHighlights, {
            currentPage: currentHighlightPage,
            totalPages,
            totalHighlights,
            startIndex,
            endIndex: Math.min(endIndex, totalHighlights)
        });
        
        const highlightsCount = document.getElementById('highlights-count');
        if (highlightsCount) highlightsCount.textContent = `(${totalHighlights})`;
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
    
    // Load book data and populate reader
    getBookFromDB(bookId).then(book => {
        if (book && bookReaderModal) {
            // Update reader header with book info
            const readerTitle = document.getElementById('reader-book-title');
            const readerAuthor = document.getElementById('reader-book-author');
            if (readerTitle) readerTitle.textContent = book.title;
            if (readerAuthor) readerAuthor.textContent = `by ${book.author}`;
            
            // Load book content into reader
            const readerContentArea = document.getElementById('reader-content-area');
            if (readerContentArea && book.content) {
                readerContentArea.innerHTML = `
                    <div class="book-content">
                        <h1>${book.title}</h1>
                        <h2>by ${book.author}</h2>
                        <div class="book-text" id="book-text-content">
                            ${book.content.split('\n').map(paragraph => 
                                paragraph.trim() ? `<p>${paragraph.trim()}</p>` : ''
                            ).filter(p => p).join('')}
                        </div>
                    </div>
                `;
                
                // Enable text selection and highlighting
                setupBookHighlighting();
                
                // Restore existing highlights for this book
                restoreBookHighlights(bookId);
            }
            
            // Update reading progress
            const progressFill = document.getElementById('reading-progress-fill');
            const progressText = document.getElementById('reading-progress-text');
            const progress = book.totalPages ? Math.round((book.currentPage / book.totalPages) * 100) : 0;
            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${progress}%`;
            
            // Load highlights for this book
            loadBookHighlights(bookId);
            
            // Load notes for this book
            loadBookNotes(bookId);
            
            // Show reader modal
            bookReaderModal.classList.add('visible');
        }
    }).catch(error => {
        showToast('Error loading book', 'error');
        console.error('Load book error:', error);
    });
}

function setupBookHighlighting() {
    const bookTextContent = document.getElementById('book-text-content');
    console.log('Setting up book highlighting for element:', bookTextContent);
    
    if (!bookTextContent) {
        console.warn('Book text content element not found');
        return;
    }
    
    // Remove existing event listeners to prevent duplicates
    bookTextContent.removeEventListener('mouseup', handleTextSelection);
    bookTextContent.removeEventListener('touchend', handleTextSelection);
    
    // Text selection events
    bookTextContent.addEventListener('mouseup', handleTextSelection);
    bookTextContent.addEventListener('touchend', handleTextSelection);
    
    console.log('Text selection event listeners added');
    
    // Prevent text selection when clicking on existing highlights
    bookTextContent.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('highlight-text')) {
            e.preventDefault();
            console.log('Prevented selection on existing highlight');
        }
    });
    
    // Add keyboard shortcut for highlighting (Ctrl+H)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'h' && selectedText && currentBookId) {
            e.preventDefault();
            console.log('Keyboard shortcut triggered for highlighting');
            highlightSelectedText('yellow');
        }
    });
    
    console.log('Book highlighting setup completed');
}

function handleTextSelection(event) {
    try {
        const selection = window.getSelection();
        
        // Debug logging
        console.log('Text selection event:', {
            selection: selection,
            rangeCount: selection?.rangeCount,
            currentBookId: currentBookId,
            event: event.type
        });
        
        // Check if we have a valid selection
        if (!selection || selection.rangeCount === 0) {
            console.log('No valid selection found');
            hideHighlightToolbar();
            selectedText = null;
            selectionRange = null;
            return;
        }
        
        const selectedTextContent = selection.toString().trim();
        console.log('Selected text:', selectedTextContent);
        
        // Only show toolbar if text is selected and we're in a book reader
        if (selectedTextContent.length > 0 && currentBookId) {
            // Verify selection is within book content
            const bookTextContent = document.getElementById('book-text-content');
            if (bookTextContent && selection.anchorNode) {
                // Check if selection is within book text content
                const isWithinBook = bookTextContent.contains(selection.anchorNode) || 
                                   bookTextContent.contains(selection.focusNode) ||
                                   bookTextContent === selection.anchorNode ||
                                   bookTextContent === selection.focusNode;
                
                console.log('Selection within book?', isWithinBook);
                
                if (isWithinBook) {
                    // Store selection for highlighting
                    selectedText = selectedTextContent;
                    selectionRange = selection.getRangeAt(0).cloneRange();
                    
                    console.log('Showing highlight toolbar for text:', selectedText);
                    // Show highlight toolbar
                    showHighlightToolbar();
                } else {
                    console.log('Selection not within book content');
                    hideHighlightToolbar();
                    selectedText = null;
                    selectionRange = null;
                }
            } else {
                console.log('Book text content not found or no anchor node');
                hideHighlightToolbar();
                selectedText = null;
                selectionRange = null;
            }
        } else {
            console.log('No text selected or not in book reader');
            // Hide highlight toolbar
            hideHighlightToolbar();
            selectedText = null;
            selectionRange = null;
        }
    } catch (error) {
        console.error('Error in handleTextSelection:', error);
        hideHighlightToolbar();
        selectedText = null;
        selectionRange = null;
    }
}

function showHighlightToolbar() {
    let toolbar = document.getElementById('highlight-toolbar');
    if (toolbar) {
        // Position the toolbar near the selection if possible
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            // Position toolbar below the selection, but adjust for screen boundaries
            const toolbarHeight = 60; // Approximate toolbar height
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            if (spaceBelow >= toolbarHeight + 20) {
                // Position below selection
                toolbar.style.top = `${rect.bottom + 10}px`;
                toolbar.style.bottom = 'auto';
            } else if (spaceAbove >= toolbarHeight + 20) {
                // Position above selection
                toolbar.style.top = `${rect.top - toolbarHeight - 10}px`;
                toolbar.style.bottom = 'auto';
            } else {
                // Default position at bottom of screen
                toolbar.style.top = 'auto';
                toolbar.style.bottom = '2rem';
            }
            
            // Center horizontally but stay within viewport
            const toolbarWidth = 300; // Approximate toolbar width
            const centerX = (rect.left + rect.right) / 2;
            const leftPos = Math.max(20, Math.min(centerX - toolbarWidth / 2, window.innerWidth - toolbarWidth - 20));
            
            toolbar.style.left = `${leftPos}px`;
            toolbar.style.transform = 'none';
        } else {
            // Default positioning
            toolbar.style.position = 'fixed';
            toolbar.style.left = '50%';
            toolbar.style.transform = 'translateX(-50%)';
            toolbar.style.bottom = '2rem';
            toolbar.style.top = 'auto';
        }
        
        toolbar.style.position = 'fixed';
        toolbar.style.zIndex = '1000';
        
        // Add event listeners to highlight buttons if not already added
        if (!toolbar.hasAttribute('data-listeners-added')) {
            console.log('Adding event listeners to highlight toolbar');
            
            toolbar.querySelectorAll('.highlight-btn[data-color]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const color = e.currentTarget.dataset.color;
                    console.log('Highlight button clicked:', color);
                    if (color) {
                        highlightSelectedText(color);
                    }
                });
            });
            
            // Add note to highlight button
            const addNoteBtn = toolbar.querySelector('#add-note-to-highlight');
            if (addNoteBtn) {
                addNoteBtn.addEventListener('click', () => {
                    console.log('Add note to highlight clicked');
                    if (selectedText && currentBookId) {
                        showInputModal(
                            'Add Note to Highlight',
                            'What are your thoughts on this selected text?',
                            'Share your insights about this passage...',
                            '',
                            (noteText) => {
                                // Check if content is empty or just whitespace
                                if (!noteText || !noteText.trim()) {
                                    showToast('Note cannot be empty! ⚠️', 'warning');
                                    return;
                                }
                                
                                // First highlight the text with yellow color, then add note
                                highlightSelectedText('yellow').then((highlightId) => {
                                    console.log('Adding note to highlight:', highlightId);
                                    // Add note to the highlight
                                    const bookNote = {
                                        bookId: currentBookId,
                                        highlightId: highlightId,
                                        type: 'highlight_note',
                                        content: noteText.trim(),
                                        createdAt: new Date().toISOString()
                                    };
                                    
                                    saveBookNoteToDB(bookNote).then(() => {
                                        showToast('Note added to highlight! 📋', 'success');
                                        loadBookHighlights(currentBookId);
                                    }).catch(error => {
                                        showToast('Error saving note', 'error');
                                        console.error('Save note error:', error);
                                    });
                                }).catch(error => {
                                    showToast('Error creating highlight', 'error');
                                    console.error('Highlight error:', error);
                                });
                            },
                            () => {
                                showToast('Note cancelled', 'info');
                            }
                        );
                    }
                });
            }
            
            // Remove highlight button
            const removeBtn = toolbar.querySelector('#remove-highlight');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    console.log('Remove highlight clicked');
                    hideHighlightToolbar();
                    selectedText = null;
                    selectionRange = null;
                    showToast('Highlight cancelled', 'info');
                });
            }
            
            toolbar.setAttribute('data-listeners-added', 'true');
            console.log('Highlight toolbar event listeners added');
        }
        
        toolbar.style.display = 'flex';
        console.log('Highlight toolbar shown');
    } else {
        console.warn('Highlight toolbar element not found');
    }
}

function hideHighlightToolbar() {
    const toolbar = document.getElementById('highlight-toolbar');
    if (toolbar) {
        toolbar.style.display = 'none';
        console.log('Highlight toolbar hidden');
    }
    
    // Clear selection if it exists
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        selection.removeAllRanges();
        console.log('Text selection cleared');
    }
}

function highlightSelectedText(color) {
    return new Promise((resolve, reject) => {
        if (!selectedText || !selectionRange || !currentBookId) {
            console.warn('Missing required data for highlighting:', { selectedText, selectionRange, currentBookId });
            reject(new Error('Missing required data for highlighting'));
            return;
        }
        
        try {
            // Validate that the range is still valid
            if (selectionRange.collapsed) {
                showToast('Please select some text to highlight', 'error');
                reject(new Error('No text selected'));
                return;
            }
            
            // Create highlight span
            const highlightSpan = document.createElement('span');
            highlightSpan.className = `highlight-text ${color}`;
            highlightSpan.style.backgroundColor = getHighlightColor(color);
            highlightSpan.title = getHighlightCategory(color);
            
            // Check if the range can be surrounded
            try {
                selectionRange.surroundContents(highlightSpan);
            } catch (rangeError) {
                // If surroundContents fails, use extractContents and insert
                const contents = selectionRange.extractContents();
                highlightSpan.appendChild(contents);
                selectionRange.insertNode(highlightSpan);
            }
            
            // Save highlight to database
            const positionData = getTextPosition(selectionRange);
            saveHighlight(currentBookId, selectedText, color, positionData).then((highlightId) => {
                showToast(`Text highlighted as ${getHighlightCategory(color)}!`, 'success');
                // Refresh highlights in sidebar
                loadBookHighlights(currentBookId);
                resolve(highlightId);
            }).catch(error => {
                console.error('Error saving highlight to database:', error);
                showToast('Error saving highlight', 'error');
                reject(error);
            });
            
            // Clear selection
            window.getSelection().removeAllRanges();
            hideHighlightToolbar();
            
            // Reset selection variables
            selectedText = null;
            selectionRange = null;
            
        } catch (error) {
            console.error('Error highlighting text:', error);
            showToast('Error highlighting text: ' + error.message, 'error');
            // Reset variables on error
            selectedText = null;
            selectionRange = null;
            hideHighlightToolbar();
            reject(error);
        }
    });
}

function getHighlightColor(color) {
    const colors = {
        'yellow': 'rgba(234, 179, 8, 0.3)',
        'green': 'rgba(34, 197, 94, 0.3)',
        'blue': 'rgba(59, 130, 246, 0.3)',
        'orange': 'rgba(249, 115, 22, 0.3)',
        'red': 'rgba(239, 68, 68, 0.3)'
    };
    return colors[color] || 'rgba(234, 179, 8, 0.3)';
}

function getTextPosition(range) {
    // Enhanced position calculation with multiple markers for better accuracy
    const container = document.getElementById('book-text-content');
    if (!container) return 0;
    
    try {
        // Get text before the selection
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(container);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        const beforeText = preCaretRange.toString();
        
        // Also store surrounding context for better matching
        const selectedText = range.toString();
        const contextLength = 50; // Characters before and after
        
        // Get context before
        const fullText = container.textContent;
        const startPos = beforeText.length;
        const contextStart = Math.max(0, startPos - contextLength);
        const contextBefore = fullText.substring(contextStart, startPos);
        
        // Get context after
        const endPos = startPos + selectedText.length;
        const contextAfter = fullText.substring(endPos, endPos + contextLength);
        
        return {
            position: startPos,
            length: selectedText.length,
            contextBefore: contextBefore,
            contextAfter: contextAfter,
            selectedText: selectedText
        };
    } catch (error) {
        console.error('Error calculating text position:', error);
        return { position: 0, length: 0, contextBefore: '', contextAfter: '', selectedText: '' };
    }
}

function restoreBookHighlights(bookId) {
    console.log('Restoring highlights for book:', bookId);
    
    loadHighlightsFromDB(bookId).then(highlights => {
        console.log('Found highlights to restore:', highlights.length);
        
        const bookTextContent = document.getElementById('book-text-content');
        if (!bookTextContent || highlights.length === 0) {
            console.log('No content element or no highlights to restore');
            return;
        }
        
        // Sort highlights by position to apply them in order
        highlights.sort((a, b) => (a.position || 0) - (b.position || 0));
        
        // Apply highlights using a more robust text matching approach
        highlights.forEach((highlight, index) => {
            setTimeout(() => {
                applyHighlightToText(bookTextContent, highlight);
            }, index * 10); // Small delay to prevent conflicts
        });
        
    }).catch(error => {
        console.error('Error restoring highlights:', error);
    });
}

function applyHighlightToText(container, highlight) {
    try {
        console.log('Applying highlight:', highlight.text.substring(0, 50) + '...');
        
        // Get all text nodes in the container
        const textNodes = getTextNodes(container);
        const fullText = textNodes.map(node => node.textContent).join('');
        
        // Try to find text using enhanced position data if available
        const textToFind = highlight.text;
        let startIndex = -1;
        
        if (highlight.position && typeof highlight.position === 'object') {
            // Use enhanced position data
            const posData = highlight.position;
            
            // First try exact position match with context validation
            if (posData.position && posData.contextBefore && posData.contextAfter) {
                const contextStart = Math.max(0, posData.position - posData.contextBefore.length);
                const contextEnd = Math.min(fullText.length, posData.position + textToFind.length + posData.contextAfter.length);
                const contextText = fullText.substring(contextStart, contextEnd);
                
                // Check if the context matches
                const expectedContext = posData.contextBefore + textToFind + posData.contextAfter;
                if (contextText.includes(expectedContext)) {
                    startIndex = posData.position;
                    console.log('Found highlight using enhanced position data');
                }
            }
        } else if (typeof highlight.position === 'number') {
            // Legacy position format - try direct position
            if (fullText.substring(highlight.position, highlight.position + textToFind.length) === textToFind) {
                startIndex = highlight.position;
                console.log('Found highlight using legacy position');
            }
        }
        
        // Fallback to text search
        if (startIndex === -1) {
            startIndex = fullText.indexOf(textToFind);
            if (startIndex !== -1) {
                console.log('Found highlight using text search fallback');
            }
        }
        
        // Last resort: fuzzy matching
        if (startIndex === -1) {
            console.warn('Exact match failed, trying fuzzy matching for:', textToFind.substring(0, 30));
            const fuzzyMatch = findFuzzyTextMatch(fullText, textToFind);
            if (fuzzyMatch) {
                applyHighlightAtPosition(textNodes, fuzzyMatch.start, fuzzyMatch.end, highlight);
                return;
            }
        }
        
        if (startIndex === -1) {
            console.warn('Could not find text to highlight:', textToFind.substring(0, 30));
            return;
        }
        
        const endIndex = startIndex + textToFind.length;
        applyHighlightAtPosition(textNodes, startIndex, endIndex, highlight);
        
    } catch (error) {
        console.error('Error applying highlight:', error);
    }
}

function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Skip empty text nodes and nodes that are already highlighted
                if (node.textContent.trim() === '' || 
                    node.parentElement.classList.contains('highlight-text')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        },
        false
    );
    
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    return textNodes;
}

function applyHighlightAtPosition(textNodes, startIndex, endIndex, highlight) {
    let currentIndex = 0;
    let startNode = null, endNode = null;
    let startOffset = 0, endOffset = 0;
    
    // Find start and end nodes
    for (let i = 0; i < textNodes.length; i++) {
        const node = textNodes[i];
        const nodeLength = node.textContent.length;
        
        if (startNode === null && currentIndex + nodeLength > startIndex) {
            startNode = node;
            startOffset = startIndex - currentIndex;
        }
        
        if (currentIndex + nodeLength >= endIndex) {
            endNode = node;
            endOffset = endIndex - currentIndex;
            break;
        }
        
        currentIndex += nodeLength;
    }
    
    if (!startNode || !endNode) {
        console.warn('Could not find start/end nodes for highlight');
        return;
    }
    
    // Create range and apply highlight
    const range = document.createRange();
    try {
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        
        // Create highlight span
        const highlightSpan = document.createElement('span');
        highlightSpan.className = `highlight-text ${highlight.color} persistent-highlight`;
        highlightSpan.style.backgroundColor = getHighlightColor(highlight.color);
        highlightSpan.title = `${getHighlightCategory(highlight.color)} - Click to view note`;
        highlightSpan.dataset.highlightId = highlight.id;
        highlightSpan.dataset.highlightColor = highlight.color;
        
        // Add click handler for navigation
        highlightSpan.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showHighlightDetails(highlight);
        });
        
        // Surround the range with the highlight span
        try {
            range.surroundContents(highlightSpan);
            console.log('Successfully applied persistent highlight');
        } catch (rangeError) {
            // If surroundContents fails, use extractContents and insert
            const contents = range.extractContents();
            highlightSpan.appendChild(contents);
            range.insertNode(highlightSpan);
            console.log('Applied highlight using extractContents method');
        }
        
    } catch (error) {
        console.error('Error creating highlight range:', error);
    }
}

function findFuzzyTextMatch(fullText, textToFind) {
    // Try to find the text with some tolerance for minor differences
    const normalizedFullText = fullText.replace(/\s+/g, ' ').trim();
    const normalizedTextToFind = textToFind.replace(/\s+/g, ' ').trim();
    
    const index = normalizedFullText.indexOf(normalizedTextToFind);
    if (index !== -1) {
        // Map back to original text positions
        let originalStart = 0;
        let normalizedIndex = 0;
        
        for (let i = 0; i < fullText.length && normalizedIndex < index; i++) {
            if (fullText[i].match(/\s/)) {
                while (i < fullText.length && fullText[i].match(/\s/)) {
                    originalStart++;
                    i++;
                }
                normalizedIndex++;
                i--; // Adjust for the for loop increment
            } else {
                originalStart++;
                normalizedIndex++;
            }
        }
        
        return {
            start: originalStart,
            end: originalStart + textToFind.length
        };
    }
    
    return null;
}

function showHighlightDetails(highlight) {
    console.log('Showing details for highlight:', highlight.id);
    
    // Switch to highlights tab in sidebar
    const highlightsTab = document.querySelector('.sidebar-tab[data-tab="highlights"]');
    if (highlightsTab) {
        highlightsTab.click();
    }
    
    // Scroll to highlight in sidebar and highlight it temporarily
    setTimeout(() => {
        const highlightElements = document.querySelectorAll('.sidebar-highlight');
        highlightElements.forEach(el => {
            const highlightCard = el.closest('[data-id]');
            if (highlightCard && highlightCard.dataset.id == highlight.id) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.style.animation = 'pulse 2s ease-in-out';
                setTimeout(() => {
                    el.style.animation = '';
                }, 2000);
            }
        });
    }, 100);
    
    // Show a tooltip with highlight details
    showHighlightTooltip(highlight);
}

function showHighlightTooltip(highlight) {
    // Create or update tooltip
    let tooltip = document.getElementById('highlight-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'highlight-tooltip';
        tooltip.className = 'highlight-tooltip';
        document.body.appendChild(tooltip);
    }
    
    tooltip.innerHTML = `
        <div class="tooltip-header">
            <span class="color-dot ${highlight.color}"></span>
            <span class="tooltip-category">${getHighlightCategory(highlight.color)}</span>
        </div>
        <div class="tooltip-text">"${highlight.text.length > 100 ? highlight.text.substring(0, 100) + '...' : highlight.text}"</div>
        ${highlight.note ? `<div class="tooltip-note"><i class="fas fa-sticky-note"></i> ${highlight.note}</div>` : ''}
        <div class="tooltip-actions">
            <button class="tooltip-btn" onclick="editHighlightNote(${highlight.id})">Edit Note</button>
            <button class="tooltip-btn delete" onclick="deleteHighlightFromBook(${highlight.id})">Delete</button>
        </div>
    `;
    
    // Position tooltip
    tooltip.style.display = 'block';
    tooltip.style.position = 'fixed';
    tooltip.style.top = '50%';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translate(-50%, -50%)';
    tooltip.style.zIndex = '10001';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (tooltip && tooltip.parentElement) {
            tooltip.style.display = 'none';
        }
    }, 5000);
    
    // Hide on click outside
    const hideTooltip = (e) => {
        if (!tooltip.contains(e.target)) {
            tooltip.style.display = 'none';
            document.removeEventListener('click', hideTooltip);
        }
    };
    setTimeout(() => {
        document.addEventListener('click', hideTooltip);
    }, 100);
}

function loadBookHighlights(bookId) {
    loadHighlightsFromDB(bookId).then(highlights => {
        // Load highlights in sidebar
        const highlightsPanel = document.getElementById('highlights-panel');
        if (highlightsPanel) {
            if (highlights.length === 0) {
                highlightsPanel.innerHTML = `
                    <div class="sidebar-empty">
                        <i class="fas fa-highlighter"></i>
                        <p>No highlights yet</p>
                        <small>Select text and highlight to save important passages</small>
                    </div>
                `;
            } else {
                highlightsPanel.innerHTML = highlights.map(highlight => `
                    <div class="sidebar-highlight ${highlight.color}" data-id="${highlight.id}">
                        <div class="highlight-header">
                            <span class="color-dot ${highlight.color}"></span>
                            <span class="color-label">${getHighlightCategory(highlight.color)}</span>
                        </div>
                        <blockquote onclick="scrollToHighlight(${highlight.id})" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='var(--bg-tertiary)'" onmouseout="this.style.background=''" title="Click to scroll to highlight in text">"${highlight.text}"</blockquote>
                        ${highlight.note ? `<div class="highlight-note"><i class="fas fa-sticky-note"></i> ${highlight.note}</div>` : ''}
                        <div class="highlight-actions">
                            <button class="action-btn" onclick="scrollToHighlight(${highlight.id})" title="Go to highlight">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn" onclick="addNoteToHighlight(${highlight.id})" title="Add note">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="action-btn delete-btn" onclick="confirmDeleteHighlight(${highlight.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }
    }).catch(error => {
        console.error('Error loading book highlights:', error);
    });
}

function scrollToHighlight(highlightId) {
    console.log('Scrolling to highlight:', highlightId);
    
    // Find the highlight element in the book text
    const highlightElement = document.querySelector(`[data-highlight-id="${highlightId}"]`);
    if (highlightElement) {
        // Scroll to the highlight smoothly
        highlightElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Add a temporary pulse animation
        highlightElement.style.animation = 'highlightPulse 2s ease-in-out';
        setTimeout(() => {
            highlightElement.style.animation = '';
        }, 2000);
        
        console.log('Scrolled to highlight successfully');
    } else {
        console.warn('Highlight element not found in text');
        showToast('Highlight not found in current view', 'warning');
    }
}

function editHighlightNote(highlightId) {
    loadHighlightsFromDB().then(highlights => {
        const highlight = highlights.find(h => h.id === highlightId);
        if (highlight) {
            const currentNote = highlight.note || '';
            showInputModal(
                'Edit Highlight Note',
                'Update your note for this highlight:',
                'Add your thoughts about this passage...',
                currentNote,
                (noteText) => {
                    // Allow empty notes for highlights (user might want to remove the note)
                    // But trim whitespace
                    highlight.note = noteText.trim();
                    saveHighlightToDB(highlight).then(() => {
                        if (noteText.trim()) {
                            showToast('Note updated! 📝', 'success');
                        } else {
                            showToast('Note removed! 🗑️', 'info');
                        }
                        loadBookHighlights(currentBookId);
                        // Hide tooltip
                        const tooltip = document.getElementById('highlight-tooltip');
                        if (tooltip) tooltip.style.display = 'none';
                    }).catch(error => {
                        showToast('Error updating note', 'error');
                        console.error('Update note error:', error);
                    });
                },
                () => {
                    showToast('Edit cancelled', 'info');
                }
            );
        }
    }).catch(error => {
        showToast('Error loading highlight', 'error');
        console.error('Load highlight error:', error);
    });
}

function deleteHighlightFromBook(highlightId) {
    showConfirmation(
        'Delete Highlight?',
        'This highlight and any associated notes will be permanently removed. This action cannot be undone.',
        () => {
            deleteHighlightFromDB(highlightId).then(() => {
                showToast('Highlight deleted! 🗑️', 'success');
                
                // Remove the visual highlight from the book text
                const highlightElement = document.querySelector(`[data-highlight-id="${highlightId}"]`);
                if (highlightElement) {
                    // Replace the highlight span with its text content
                    const textContent = highlightElement.textContent;
                    const textNode = document.createTextNode(textContent);
                    highlightElement.parentNode.replaceChild(textNode, highlightElement);
                }
                
                // Refresh sidebar
                loadBookHighlights(currentBookId);
                
                // Hide tooltip
                const tooltip = document.getElementById('highlight-tooltip');
                if (tooltip) tooltip.style.display = 'none';
                
            }).catch(error => {
                showToast('Error deleting highlight', 'error');
                console.error('Delete highlight error:', error);
            });
        },
        () => {
            showToast('Deletion cancelled', 'info');
        }
    );
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
        noteCard.className = note.isBookNote ? 'note-card book-note-card' : 'note-card';
        noteCard.dataset.id = note.id;
        
        const cardEmoji = note.isBookNote ? '📖' : getFirstEmoji(note.title, note.content);
        const previewText = getPreviewText(note.content);
        const tagEmoji = note.isBookNote ? '📚' : getTagEmoji(note.tag);
        const timeAgo = getTimeAgo(note.updatedAt || note.createdAt);
        
        // Create action buttons based on note type
        let actionButtons;
        if (note.isBookNote) {
            actionButtons = `
                <button class="quick-edit-btn book-note-edit" onclick="editBookNote(${note.originalBookNote.id})" title="Edit book note">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="quick-details-btn" onclick="openBookNotePreview(${JSON.stringify(note).replace(/"/g, '&quot;')})" title="Preview Note">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="quick-book-btn" onclick="openBook(${note.bookId})" title="Go to book">
                    <i class="fas fa-book-open"></i>
                </button>
            `;
        } else {
            actionButtons = `
                <button class="quick-edit-btn" onclick="openNoteModal(${JSON.stringify(note).replace(/"/g, '&quot;')})" title="Edit note">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="quick-details-btn" onclick="openNotePreview(${JSON.stringify(note).replace(/"/g, '&quot;')})" title="Preview Note">
                    <i class="fas fa-eye"></i>
                </button>
            `;
        }
        
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
                    ${actionButtons}
                </div>
            </div>
        `;
        
        // Make entire card clickable for preview (except action buttons)
        noteCard.addEventListener('click', (e) => {
            if (!e.target.closest('.note-card-actions')) {
                if (note.isBookNote) {
                    openBookNotePreview(note);
                } else {
                    openNotePreview(note);
                }
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
function renderHighlights(highlights, paginationInfo = null) {
    if (!highlightsContainer) return;
    
    highlightsContainer.innerHTML = '';
    
    if (highlights.length === 0) {
        let emptyMessage;
        if (paginationInfo && paginationInfo.totalHighlights > 0) {
            emptyMessage = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No highlights on this page</h3>
                    <p>Try adjusting your filters or search terms.</p>
                    <button class="btn secondary" onclick="resetHighlightFilters()">
                        <i class="fas fa-undo"></i> Reset Filters
                    </button>
                </div>
            `;
        } else {
            emptyMessage = `
                <div class="empty-state">
                    <i class="fas fa-highlighter"></i>
                    <h3>${searchHighlightsInput?.value ? 'No highlights match your search.' : 'No highlights yet!'}</h3>
                    <p>${searchHighlightsInput?.value ? 'Try a different keyword.' : 'Start reading books and highlight important passages.'}</p>
                    <button class="btn primary" onclick="switchView('books')">
                        <i class="fas fa-book"></i> Browse Books
                    </button>
                </div>
            `;
        }
        highlightsContainer.innerHTML = emptyMessage;
        return;
    }
    
    // Add view controls and pagination info at the top
    if (paginationInfo) {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'highlights-controls';
        controlsDiv.innerHTML = `
            <div class="highlights-info">
                <span class="pagination-info">
                    Showing ${paginationInfo.startIndex + 1}-${paginationInfo.endIndex} of ${paginationInfo.totalHighlights} highlights
                </span>
                <div class="view-toggles">
                    <button class="toggle-btn ${isCompactHighlightView ? '' : 'active'}" onclick="toggleHighlightView(false)" title="Card View">
                        <i class="fas fa-th"></i>
                    </button>
                    <button class="toggle-btn ${isCompactHighlightView ? 'active' : ''}" onclick="toggleHighlightView(true)" title="Compact View">
                        <i class="fas fa-list"></i>
                    </button>
                </div>
            </div>
            ${paginationInfo.totalPages > 1 ? createPaginationControls(paginationInfo) : ''}
        `;
        highlightsContainer.appendChild(controlsDiv);
    }
    
    // Group highlights by book for better organization
    const highlightsByBook = highlights.reduce((acc, highlight) => {
        if (!acc[highlight.bookId]) {
            acc[highlight.bookId] = [];
        }
        acc[highlight.bookId].push(highlight);
        return acc;
    }, {});
    
    Object.entries(highlightsByBook).forEach(async ([bookId, bookHighlights]) => {
        const bookSection = document.createElement('div');
        bookSection.className = 'highlights-book-section';
        const isCollapsed = collapsedBookSections.has(bookId);
        
        try {
            const book = await getBookFromDB(parseInt(bookId));
            const bookTitle = book ? book.title : 'Unknown Book';
            const bookAuthor = book ? book.author : 'Unknown Author';
            
            bookSection.innerHTML = `
                <div class="book-section-header" onclick="toggleBookSection('${bookId}')">
                    <div class="book-info">
                        <h4><i class="fas fa-book"></i> ${bookTitle}</h4>
                        <p class="book-author-small">by ${bookAuthor}</p>
                    </div>
                    <div class="section-controls">
                        <span class="highlight-count">${bookHighlights.length} highlights</span>
                        <button class="collapse-btn" title="${isCollapsed ? 'Expand' : 'Collapse'}">
                            <i class="fas fa-chevron-${isCollapsed ? 'down' : 'up'}"></i>
                        </button>
                    </div>
                </div>
            `;
        } catch (error) {
            bookSection.innerHTML = `
                <div class="book-section-header" onclick="toggleBookSection('${bookId}')">
                    <div class="book-info">
                        <h4><i class="fas fa-book"></i> Book Highlights</h4>
                    </div>
                    <div class="section-controls">
                        <span class="highlight-count">${bookHighlights.length} highlights</span>
                        <button class="collapse-btn" title="${isCollapsed ? 'Expand' : 'Collapse'}">
                            <i class="fas fa-chevron-${isCollapsed ? 'down' : 'up'}"></i>
                        </button>
                    </div>
                </div>
            `;
        }
        
        if (!isCollapsed) {
            const highlightsContainer = document.createElement('div');
            highlightsContainer.className = isCompactHighlightView ? 'highlights-list-compact' : 'highlights-grid';
            
            bookHighlights.forEach(highlight => {
                const highlightElement = createHighlightElement(highlight, isCompactHighlightView);
                highlightsContainer.appendChild(highlightElement);
            });
            
            bookSection.appendChild(highlightsContainer);
        } else {
            bookSection.classList.add('collapsed');
        }
        
        highlightsContainer.appendChild(bookSection);
    });
    
    // Add pagination controls at the bottom if needed
    if (paginationInfo && paginationInfo.totalPages > 1) {
        const bottomPagination = document.createElement('div');
        bottomPagination.className = 'highlights-pagination-bottom';
        bottomPagination.innerHTML = createPaginationControls(paginationInfo);
        highlightsContainer.appendChild(bottomPagination);
    }
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
    showConfirmation(
        "Delete Book?",
        "This will also delete all highlights and notes for this book. This action cannot be undone.",
        async () => {
            await deleteBook(bookId);
        }
    );
}

function confirmDeleteHighlight(highlightId) {
    showConfirmation(
        "Delete Highlight?",
        "This action cannot be undone.",
        async () => {
            await deleteHighlightFromDB(highlightId);
            await loadHighlights();
            showToast('Highlight deleted!', 'success');
        }
    );
}

function editBook(bookId) {
    getBookFromDB(bookId).then(book => {
        if (book) {
            currentBookId = bookId;
            
            // Populate form with existing book data
            document.getElementById('book-title-input').value = book.title;
            document.getElementById('book-author-input').value = book.author;
            document.getElementById('book-category-select').value = book.category;
            document.getElementById('book-content-input').value = book.content || '';
            
            // Select text import method for editing
            document.querySelectorAll('.import-method').forEach(m => m.classList.remove('active'));
            document.querySelector('.import-method[data-method="text"]').classList.add('active');
            
            document.querySelectorAll('.import-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById('text-import').classList.add('active');
            
            // Open the import modal for editing
            if (bookImportModal) {
                bookImportModal.classList.add('visible');
            }
        }
    }).catch(error => {
        showToast('Error loading book for editing', 'error');
        console.error('Edit book error:', error);
    });
}

function addNoteToHighlight(highlightId) {
    // Get highlight data
    loadHighlightsFromDB().then(highlights => {
        const highlight = highlights.find(h => h.id === highlightId);
        if (highlight) {
            showInputModal(
                'Add Note to Highlight',
                'Add your thoughts about this highlighted passage:',
                'What insights does this passage give you?',
                highlight.note || '',
                (noteText) => {
                    // Check if content is empty or just whitespace
                    if (!noteText || !noteText.trim()) {
                        showToast('Note cannot be empty! ⚠️', 'warning');
                        return;
                    }
                    
                    // Save the note
                    const bookNote = {
                        bookId: highlight.bookId,
                        highlightId: highlightId,
                        type: 'highlight_note',
                        content: noteText.trim(),
                        createdAt: new Date().toISOString()
                    };
                    
                    saveBookNoteToDB(bookNote).then(() => {
                        // Update the highlight with note reference
                        highlight.note = noteText.trim();
                        saveHighlightToDB(highlight).then(() => {
                            showToast('Note added to highlight! 📋', 'success');
                            if (activeView === 'highlights') {
                                loadHighlights();
                            }
                        });
                    }).catch(error => {
                        showToast('Error saving note', 'error');
                        console.error('Save note error:', error);
                    });
                },
                () => {
                    showToast('Note cancelled', 'info');
                }
            );
        }
    }).catch(error => {
        showToast('Error loading highlight', 'error');
        console.error('Load highlight error:', error);
    });
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
        personal: '❤️',
        'Book Note': '📚'
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

// Helper function to create pagination controls
function createPaginationControls(paginationInfo) {
    const { currentPage, totalPages } = paginationInfo;
    
    let paginationHTML = '<div class="pagination-controls">';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="changeHighlightPage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Previous
        </button>
    `;
    
    // Page numbers (show max 5 pages)
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changeHighlightPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += '<span class="pagination-ellipsis">...</span>';
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changeHighlightPage(${i})">${i}</button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += '<span class="pagination-ellipsis">...</span>';
        }
        paginationHTML += `<button class="pagination-btn" onclick="changeHighlightPage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="changeHighlightPage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''}>
            Next <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationHTML += '</div>';
    return paginationHTML;
}

// Function to change highlight page
function changeHighlightPage(page) {
    if (page < 1) return;
    currentHighlightPage = page;
    loadHighlights();
    
    // Scroll to top of highlights
    const highlightsContainer = document.getElementById('highlights-container');
    if (highlightsContainer) {
        highlightsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Function to toggle between card and compact view
function toggleHighlightView(compact) {
    isCompactHighlightView = compact;
    localStorage.setItem('compactHighlightView', compact);
    loadHighlights();
}

// Function to toggle book section collapse
function toggleBookSection(bookId) {
    if (collapsedBookSections.has(bookId)) {
        collapsedBookSections.delete(bookId);
    } else {
        collapsedBookSections.add(bookId);
    }
    localStorage.setItem('collapsedBookSections', JSON.stringify([...collapsedBookSections]));
    loadHighlights();
}

// Function to create highlight element (card or compact)
function createHighlightElement(highlight, isCompact) {
    const timeAgo = getTimeAgo(highlight.createdAt);
    const colorLabel = getHighlightCategory(highlight.color);
    
    if (isCompact) {
        const highlightRow = document.createElement('div');
        highlightRow.className = `highlight-row ${highlight.color}`;
        highlightRow.dataset.id = highlight.id;
        
        highlightRow.innerHTML = `
            <div class="highlight-compact-content">
                <div class="highlight-text-preview">
                    <span class="color-dot ${highlight.color}"></span>
                    <span class="highlight-excerpt">"${highlight.text.length > 100 ? highlight.text.substring(0, 100) + '...' : highlight.text}"</span>
                </div>
                <div class="highlight-meta">
                    <span class="highlight-date">${timeAgo}</span>
                    <span class="color-label">${colorLabel}</span>
                    ${highlight.note ? '<i class="fas fa-sticky-note" title="Has note"></i>' : ''}
                </div>
            </div>
            <div class="highlight-actions">
                <button class="action-btn" onclick="addNoteToHighlight(${highlight.id})" title="Add note">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="action-btn delete-btn" onclick="confirmDeleteHighlight(${highlight.id})" title="Delete highlight">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        return highlightRow;
    } else {
        const highlightCard = document.createElement('div');
        highlightCard.className = `highlight-card ${highlight.color}`;
        highlightCard.dataset.id = highlight.id;
        
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
        
        return highlightCard;
    }
}

// Function to reset highlight filters
function resetHighlightFilters() {
    currentHighlightPage = 1;
    currentHighlightCategory = 'all';
    if (searchHighlightsInput) searchHighlightsInput.value = '';
    
    // Reset filter buttons
    document.querySelectorAll('.highlight-color-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === 'all');
    });
    
    loadHighlights();
}

// Function to open book note preview
function openBookNotePreview(note) {
    // Create preview modal
    const previewModal = document.createElement('div');
    previewModal.className = 'note-preview-modal book-note-preview';
    previewModal.innerHTML = `
        <div class="preview-overlay"></div>
        <div class="preview-content">
            <div class="preview-header">
                <div class="preview-title">
                    <span class="preview-emoji">📖</span>
                    <h2>${note.title || 'Book Note'}</h2>
                </div>
                <div class="preview-actions">
                    <button class="preview-edit-btn" title="Edit Book Note">
                        <i class="fas fa-edit"></i>
                        <span class="edit-text">Edit</span>
                    </button>
                    <button class="preview-book-btn" title="Go to Book">
                        <i class="fas fa-book-open"></i>
                        <span class="book-text">Book</span>
                    </button>
                    <button class="preview-close-btn" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="preview-meta">
                <div class="meta-left">
                    <span class="preview-tag">📚 Book Note</span>
                    <span class="preview-time">${getTimeAgo(note.createdAt)}</span>
                </div>
                <div class="book-context">
                    <span class="book-title">From: ${note.bookTitle}</span>
                </div>
            </div>
            <div class="preview-body">
                ${note.originalBookNote.content || '<em>No content</em>'}
            </div>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(previewModal);
    
    // Add event listeners
    const closeBtn = previewModal.querySelector('.preview-close-btn');
    const editBtn = previewModal.querySelector('.preview-edit-btn');
    const bookBtn = previewModal.querySelector('.preview-book-btn');
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
        editBookNote(note.originalBookNote.id);
    });
    bookBtn.addEventListener('click', () => {
        closePreview();
        openBook(note.bookId);
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

// Function to edit book note
function editBookNote(bookNoteId) {
    loadBookNotesFromDB().then(bookNotes => {
        const note = bookNotes.find(n => n.id === bookNoteId);
        if (note) {
            showInputModal(
                'Edit Book Note',
                'Update your thoughts about this book:',
                'Edit your note...',
                note.content,
                (newContent) => {
                    if (newContent !== note.content) {
                        note.content = newContent;
                        saveBookNoteToDB(note).then(() => {
                            showToast('Book note updated! ✨', 'success');
                            loadNotes(); // Refresh the notes display
                        }).catch(error => {
                            showToast('Error updating book note', 'error');
                            console.error('Update book note error:', error);
                        });
                    } else {
                        showToast('No changes made', 'info');
                    }
                },
                () => {
                    showToast('Edit cancelled', 'info');
                }
            );
        }
    }).catch(error => {
        showToast('Error loading book note', 'error');
        console.error('Load book note error:', error);
    });
}

// Function to open book (navigate to book view)
function openBook(bookId) {
    switchView('books');
    // Optionally, you could add logic to scroll to or highlight the specific book
    // For now, we'll just switch to the books view
    setTimeout(() => {
        const bookCard = document.querySelector(`[data-id="${bookId}"]`);
        if (bookCard) {
            bookCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            bookCard.style.boxShadow = '0 0 20px var(--accent-primary)';
            setTimeout(() => {
                bookCard.style.boxShadow = '';
            }, 2000);
        }
    }, 100);
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
    
    // Navigation Events (Mobile Sidebar)
    if (navNotes) navNotes.addEventListener('click', () => switchView('notes'));
    if (navBooks) navBooks.addEventListener('click', () => switchView('books'));
    if (navHighlights) navHighlights.addEventListener('click', () => switchView('highlights'));
    
    // Desktop Navigation Events
    const navNotesDesktop = document.getElementById('nav-notes-desktop');
    const navBooksDesktop = document.getElementById('nav-books-desktop');
    const navHighlightsDesktop = document.getElementById('nav-highlights-desktop');
    
    if (navNotesDesktop) navNotesDesktop.addEventListener('click', () => switchView('notes'));
    if (navBooksDesktop) navBooksDesktop.addEventListener('click', () => switchView('books'));
    if (navHighlightsDesktop) navHighlightsDesktop.addEventListener('click', () => switchView('highlights'));
    
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
        
        fileDropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
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
    
    // Reader Sidebar Tab Events
    const readerSidebarTabs = bookReaderModal?.querySelectorAll('.sidebar-tab');
    readerSidebarTabs?.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            readerSidebarTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Switch panels
            const panels = bookReaderModal.querySelectorAll('.sidebar-panel');
            panels.forEach(panel => panel.classList.remove('active'));
            
            const targetPanel = document.getElementById(`${targetTab}-panel`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
    
    // Reader Control Events
    const readerSettingsBtn = document.getElementById('reader-settings-btn');
    const readerHighlightsBtn = document.getElementById('reader-highlights-btn');
    const readerNotesBtn = document.getElementById('reader-notes-btn');
    
    if (readerSettingsBtn) {
        readerSettingsBtn.addEventListener('click', () => {
            showToast('Reading settings coming soon!', 'info');
        });
    }
    
    if (readerHighlightsBtn) {
        readerHighlightsBtn.addEventListener('click', () => {
            const sidebar = document.getElementById('reader-sidebar');
            if (sidebar) {
                sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
            }
        });
    }
    
    if (readerNotesBtn) {
        readerNotesBtn.addEventListener('click', () => {
            const sidebar = document.getElementById('reader-sidebar');
            if (sidebar) {
                sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
                // Switch to notes tab
                const notesTab = sidebar.querySelector('.sidebar-tab[data-tab="notes"]');
                if (notesTab) {
                    notesTab.click();
                }
            }
        });
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

// --- BOOK NOTES FUNCTIONS ---
function loadBookNotes(bookId) {
    loadBookNotesFromDB(bookId).then(bookNotes => {
        const notesPanel = document.getElementById('notes-panel');
        if (notesPanel) {
            if (bookNotes.length === 0) {
                notesPanel.innerHTML = `
                    <div class="sidebar-empty">
                        <i class="fas fa-sticky-note"></i>
                        <p>No notes yet</p>
                        <button class="btn primary" onclick="addBookNote(${bookId})">
                            <i class="fas fa-plus"></i> Add Note
                        </button>
                    </div>
                `;
            } else {
                notesPanel.innerHTML = bookNotes.map(note => `
                    <div class="sidebar-note">
                        <div class="note-content">${note.content}</div>
                        <div class="note-date">${getTimeAgo(note.createdAt)}</div>
                        <div class="note-actions">
                            <button class="action-btn" onclick="editBookNote(${note.id})" title="Edit note">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" onclick="confirmDeleteBookNote(${note.id})" title="Delete note">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('') + `
                    <button class="btn primary" onclick="addBookNote(${bookId})" style="margin-top: 1rem;">
                        <i class="fas fa-plus"></i> Add Note
                    </button>
                `;
            }
        }
    }).catch(error => {
        console.error('Error loading book notes:', error);
    });
}

function addBookNote(bookId) {
    showInputModal(
        'Add Book Note',
        'Share your thoughts about this book:',
        'What are your thoughts on this book?',
        '',
        (noteContent) => {
            // Check if content is empty or just whitespace
            if (!noteContent || !noteContent.trim()) {
                showToast('Note cannot be empty! ⚠️', 'warning');
                return;
            }
            
            const bookNote = {
                bookId: bookId,
                type: 'general_note',
                content: noteContent.trim(),
                createdAt: new Date().toISOString()
            };
            
            saveBookNoteToDB(bookNote).then(() => {
                showToast('Note added! 📝', 'success');
                loadBookNotes(bookId);
            }).catch(error => {
                showToast('Error saving note', 'error');
                console.error('Save book note error:', error);
            });
        },
        () => {
            showToast('Note cancelled', 'info');
        }
    );
}

function editBookNote(noteId) {
    loadBookNotesFromDB().then(bookNotes => {
        const note = bookNotes.find(n => n.id === noteId);
        if (note) {
            showInputModal(
                'Edit Book Note',
                'Update your thoughts about this book:',
                'Edit your note...',
                note.content,
                (newContent) => {
                    // Check if content is empty or just whitespace
                    if (!newContent || !newContent.trim()) {
                        showToast('Note cannot be empty! ⚠️', 'warning');
                        return;
                    }
                    
                    // Only update if content actually changed
                    if (newContent.trim() !== note.content.trim()) {
                        note.content = newContent.trim();
                        saveBookNoteToDB(note).then(() => {
                            showToast('Note updated! ✨', 'success');
                            loadBookNotes(note.bookId);
                        }).catch(error => {
                            showToast('Error updating note', 'error');
                            console.error('Update book note error:', error);
                        });
                    } else {
                        showToast('No changes made', 'info');
                    }
                },
                () => {
                    showToast('Edit cancelled', 'info');
                }
            );
        }
    }).catch(error => {
        showToast('Error loading note', 'error');
        console.error('Load book note error:', error);
    });
}

function confirmDeleteBookNote(noteId) {
    showConfirmation(
        "Delete Note?",
        "This action cannot be undone.",
        async () => {
            try {
                const bookNotes = await loadBookNotesFromDB();
                const note = bookNotes.find(n => n.id === noteId);
                await deleteBookNoteFromDB(noteId);
                showToast('Note deleted!', 'success');
                if (note) {
                    loadBookNotes(note.bookId);
                }
            } catch (error) {
                showToast('Error deleting note', 'error');
                console.error('Delete book note error:', error);
            }
        }
    );
}

async function initApp() {
    try {
        const savedThemeName = localStorage.getItem('theme') || 'light';
        const savedTheme = themes.find(t => t.name === savedThemeName) || themes[0];
        document.documentElement.setAttribute('data-theme', savedTheme.name);
        themeToggle.querySelector('i').className = `fas ${savedTheme.icon}`;
        
        // Load saved highlight preferences
        isCompactHighlightView = localStorage.getItem('compactHighlightView') === 'true';
        const savedCollapsedSections = localStorage.getItem('collapsedBookSections');
        if (savedCollapsedSections) {
            collapsedBookSections = new Set(JSON.parse(savedCollapsedSections));
        }
        
        await openDatabase();
        
        // Initialize with Books view as default
        switchView('books');
        
        setupEventListeners();
        
        // Create welcome content if this is a new installation
        const allNotes = await loadNotesFromDB();
        const allBooks = await loadBooksFromDB();
        
        if (allNotes.length === 0) {
            await saveNoteToDB({ 
                title: "Welcome to Yaadannoo! 🌈", 
                content: `<p>This is your new favorite note-taking app. Here are a few tips:</p><ul><li>Click the <b>plus icon</b> to create new notes.</li><li>Click <i>this note</i> to open the editor.</li><li>Your notes are saved automatically in your browser.</li><li>Use the <b>Books</b> section to start your reading journey.</li></ul><p>Go ahead and delete this welcome note to get started!</p>`, 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString() 
            });
            await loadNotes();
        }
        
        // Create sample book if no books exist
        if (allBooks.length === 0) {
            const sampleBookContent = `# The Art of Reading

Reading is not just about consuming words on a page; it's about engaging with ideas, expanding perspectives, and embarking on intellectual adventures.

## Chapter 1: The Power of Books

Books have the unique ability to transport us to different worlds, times, and minds. When we read, we're not just processing information – we're experiencing life through different lenses.

### Key Benefits of Reading:

• **Knowledge Expansion**: Every book adds to our understanding of the world
• **Vocabulary Growth**: Exposure to new words and expressions
• **Critical Thinking**: Analyzing and questioning what we read
• **Empathy Development**: Understanding different perspectives and experiences
• **Stress Relief**: Reading can be a form of meditation and escape

## Chapter 2: Active Reading Techniques

To get the most out of your reading experience, consider these active reading strategies:

### Highlighting and Note-Taking

Highlight important concepts, memorable quotes, and actionable insights. Use different colors to categorize information:

- **Yellow**: Key concepts and main ideas
- **Green**: Actionable insights and practical advice
- **Blue**: Memorable quotes and inspiring passages
- **Orange**: Questions and areas for further exploration
- **Red**: Critical points and warnings

### The SQ3R Method

1. **Survey**: Skim through the material first
2. **Question**: Ask yourself what you expect to learn
3. **Read**: Read actively and engaged
4. **Recite**: Summarize what you've learned
5. **Review**: Go back and reinforce key points

## Chapter 3: Building a Reading Habit

### Start Small
Begin with just 15-20 minutes of reading daily. Consistency is more important than duration.

### Choose What Interests You
Read books that genuinely interest you. Passion for the subject matter will sustain your reading habit.

### Create a Reading Environment
Designate a comfortable, quiet space for reading. Good lighting and minimal distractions are essential.

### Track Your Progress
Keep a reading journal or use apps like this one to track books you've read and insights you've gained.

## Conclusion

Reading is a journey of continuous learning and discovery. Every book you read contributes to your personal and intellectual growth. Remember, it's not about how fast you read or how many books you finish – it's about the quality of engagement and the insights you gain.

Happy reading! 📚✨`;
            
            const bookId = await saveBookToDB({
                title: "The Art of Reading: A Complete Guide",
                author: "Digital Library",
                category: "self-help",
                content: sampleBookContent,
                totalPages: Math.ceil(sampleBookContent.length / 2500),
                currentPage: 0,
                status: "reading",
                dateAdded: new Date().toISOString()
            });
            
            // Add sample highlights to demonstrate the feature
            const sampleHighlights = [
                {
                    bookId: bookId,
                    text: "Reading is not just about consuming words on a page; it's about engaging with ideas, expanding perspectives, and embarking on intellectual adventures.",
                    color: "yellow",
                    category: "Key Concepts",
                    position: 95,
                    createdAt: new Date().toISOString()
                },
                {
                    bookId: bookId,
                    text: "Consistency is more important than duration.",
                    color: "green",
                    category: "Actionable Insights",
                    position: 1250,
                    createdAt: new Date().toISOString()
                },
                {
                    bookId: bookId,
                    text: "Every book you read contributes to your personal and intellectual growth.",
                    color: "blue",
                    category: "Memorable Quotes",
                    position: 1980,
                    createdAt: new Date().toISOString()
                }
            ];
            
            // Save sample highlights
            for (const highlight of sampleHighlights) {
                await saveHighlightToDB(highlight);
            }
            
            // Add a sample book note
            await saveBookNoteToDB({
                bookId: bookId,
                type: 'general_note',
                content: 'This sample book demonstrates the core features of Yaadannoo. Try highlighting text, adding notes, and exploring the different views!',
                createdAt: new Date().toISOString()
            });
            
            // Show welcome toast for the sample book
            setTimeout(() => {
                showToast('Sample book "The Art of Reading" has been added to get you started! 📚', 'success');
            }, 1500);
        }
        
        // Check PWA install eligibility
        checkInstallEligibility();
    } catch (error) {
        showToast(`Initialization Error: The app could not start correctly: ${error}`, 'error');
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