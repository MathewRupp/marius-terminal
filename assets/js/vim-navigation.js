// Vim-style navigation with j/k keys
document.addEventListener('DOMContentLoaded', function() {
    let scrollAmount = 50; // pixels to scroll per keypress
    
    document.addEventListener('keydown', function(e) {
        // Only activate when not in an input field, textarea, or contenteditable
        const activeElement = document.activeElement;
        const isInputFocused = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        );
        
        if (isInputFocused) return;
        
        switch(e.key) {
            case 'j':
                // Scroll down
                e.preventDefault();
                window.scrollBy(0, scrollAmount);
                break;
            case 'k':
                // Scroll up
                e.preventDefault();
                window.scrollBy(0, -scrollAmount);
                break;
            case 'g':
                // Check if this is the start of 'gg' (go to top)
                if (!window.vimNavTimeout) {
                    window.vimNavTimeout = setTimeout(() => {
                        window.vimNavTimeout = null;
                    }, 500);
                    window.vimNavFirstG = true;
                } else if (window.vimNavFirstG) {
                    // Second 'g' - go to top
                    e.preventDefault();
                    window.scrollTo(0, 0);
                    clearTimeout(window.vimNavTimeout);
                    window.vimNavTimeout = null;
                    window.vimNavFirstG = false;
                }
                break;
            case 'G':
                // Go to bottom (Shift+g)
                e.preventDefault();
                window.scrollTo(0, document.body.scrollHeight);
                break;
            default:
                // Reset 'g' state for any other key
                if (window.vimNavTimeout) {
                    clearTimeout(window.vimNavTimeout);
                    window.vimNavTimeout = null;
                    window.vimNavFirstG = false;
                }
                break;
        }
    });
    
    // Optional: Show a subtle indicator when vim navigation is active
    const style = document.createElement('style');
    style.textContent = `
        body.vim-nav-active::after {
            content: 'vim nav: j/k ↕ | gg ↑ | G ↓';
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: var(--bg);
            color: var(--muted);
            padding: 4px 8px;
            border: 1px solid var(--border);
            font-size: 11px;
            font-family: var(--mono);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1001;
            border-radius: 3px;
        }
        
        body.vim-nav-showing::after {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
    
    // Show indicator briefly on first j/k press
    let indicatorShown = false;
    document.addEventListener('keydown', function(e) {
        if (!indicatorShown && (e.key === 'j' || e.key === 'k')) {
            indicatorShown = true;
            document.body.classList.add('vim-nav-active', 'vim-nav-showing');
            setTimeout(() => {
                document.body.classList.remove('vim-nav-showing');
            }, 2000);
        }
    });
});