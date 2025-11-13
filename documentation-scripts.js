// Document ready function
function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

// Class-based architecture for better code organization and maintainability
class DocsApp {
  constructor() {
    this.sidebar = null;
    this.mobileMenuToggle = null;
    this.init();
  }

  init() {
    // Initialize components
    this.sidebar = new SidebarManager();
    this.codeBlockManager = new CodeBlockManager();
    this.searchManager = new SearchManager();
    this.themeManager = new ThemeManager();
    this.smoothScrollManager = new SmoothScrollManager(this.sidebar);
    this.tableOfContentsGenerator = new TableOfContentsGenerator();
    this.uiComponentsManager = new UIComponentsManager();

    // Initialize active navigation and event listeners
    this.setActiveNavItem();
    this.setupResizeHandler();
  }

  setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
        
        // Open parent dropdown if needed
        const parentDropdown = link.closest('.nav-dropdown');
        if (parentDropdown) {
          parentDropdown.classList.add('open');
          const toggle = parentDropdown.querySelector('.toggle-dropdown');
          if (toggle) toggle.classList.add('open');
        }
      }
    });
  }

  setupResizeHandler() {
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.sidebar && this.sidebar.isOpen) {
        this.sidebar.closeSidebar();
      }
    });
  }
}

class SidebarManager {
  constructor() {
    this.sidebar = document.getElementById('sidebar');
    this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    this.versionSelector = document.querySelector('.version-selector');
    this.versionDropdown = document.querySelector('.version-dropdown');
    this.isOpen = false;
    this.init();
  }

  init() {
    this.setupMobileToggle();
    this.setupVersionSelector();
    this.setupCollapsibleNavigation();
  }

  setupMobileToggle() {
    if (this.mobileMenuToggle && this.sidebar) {
      this.mobileMenuToggle.addEventListener('click', () => {
        this.toggleSidebar();
      });
    }
  }

  setupVersionSelector() {
    if (this.versionSelector && this.versionDropdown) {
      this.versionSelector.addEventListener('click', (e) => {
        e.stopPropagation();
        this.versionDropdown.classList.toggle('open');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!this.versionSelector.contains(e.target)) {
          this.versionDropdown.classList.remove('open');
        }
      });
    }
  }

  setupCollapsibleNavigation() {
    const toggleDropdowns = document.querySelectorAll('.toggle-dropdown');
    
    toggleDropdowns.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const parent = toggle.closest('.nav-dropdown');
        const isCurrentlyOpen = parent.classList.contains('open');
        
        // Close all other dropdowns
        document.querySelectorAll('.nav-dropdown.open').forEach(dropdown => {
          if (dropdown !== parent) {
            dropdown.classList.remove('open');
            const otherToggle = dropdown.querySelector('.toggle-dropdown');
            if (otherToggle) otherToggle.classList.remove('open');
          }
        });
        
        // Toggle current dropdown
        parent.classList.toggle('open');
        toggle.classList.toggle('open');
      });
    });
  }

  toggleSidebar() {
    if (this.sidebar) {
      this.isOpen = !this.isOpen;
      this.sidebar.classList.toggle('open');
      
      if (this.isOpen) {
        this.createOverlay();
      } else {
        this.removeOverlay();
      }
    }
  }

  closeSidebar() {
    if (this.sidebar && this.isOpen) {
      this.isOpen = false;
      this.sidebar.classList.remove('open');
      this.removeOverlay();
    }
  }

  createOverlay() {
    // Check if overlay already exists
    if (document.querySelector('.sidebar-overlay')) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '800';
    
    overlay.addEventListener('click', () => {
      this.closeSidebar();
    });
    
    document.body.appendChild(overlay);
  }

  removeOverlay() {
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
      overlay.remove();
    }
  }
}

class CodeBlockManager {
  constructor() {
    this.init();
  }

  init() {
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
      button.addEventListener('click', () => {
        const codeBlock = button.closest('.code-block');
        const code = codeBlock.querySelector('code').textContent;
        
        const originalContent = button.innerHTML;
        
        navigator.clipboard.writeText(code).then(() => {
          button.classList.add('copied');
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
          
          setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalContent;
          }, 2000);
        });
      });
    });
  }
}

class UIComponentsManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupTabs();
    this.setupCollapsibleSections();
    this.setupAccordion();
    this.setupTooltips();
    this.setupAnimations();
  }

  // Tabs Functionality
  setupTabs() {
    const tabsContainers = document.querySelectorAll('.tabs');
    
    tabsContainers.forEach(container => {
      const tabButtons = container.querySelectorAll('.tab-button');
      const tabContents = container.querySelectorAll('.tab-content');
      
      tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
          // Remove active class from all buttons and contents
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabContents.forEach(content => content.classList.remove('active'));
          
          // Add active class to clicked button and corresponding content
          button.classList.add('active');
          
          const tabId = button.getAttribute('data-tab');
          const contentElement = document.getElementById(`tab-${tabId}`);
          if (contentElement) {
            contentElement.classList.add('active');
          }
        });
      });
    });
  }
  
  // Collapsible Sections
  setupCollapsibleSections() {
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    
    collapsibleHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const section = header.closest('.collapsible-section');
        section.classList.toggle('open');
      });
    });
  }
  
  // Accordion Functionality
  setupAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const isOpen = item.classList.contains('open');
        
        // Close all items
        document.querySelectorAll('.accordion-item').forEach(i => {
          i.classList.remove('open');
        });
        
        // Open clicked item if it wasn't open
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  }
  
  // Initialize tooltips (mostly CSS-based but can add JS enhancements)
  setupTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    
    tooltips.forEach(tooltip => {
      // Add keyboard accessibility
      tooltip.setAttribute('tabindex', '0');
      tooltip.setAttribute('aria-label', tooltip.getAttribute('data-tooltip'));
      
      // Support for keyboard navigation
      tooltip.addEventListener('focus', () => {
        tooltip.classList.add('focused');
      });
      
      tooltip.addEventListener('blur', () => {
        tooltip.classList.remove('focused');
      });
    });
  }
  
  // Initialize animations
  setupAnimations() {
    // Add animation class to elements when they come into view
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.feature-card, .info-box');
      
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isVisible) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      });
    };
    
    // Set initial styles
    document.querySelectorAll('.feature-card, .info-box').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Trigger once to catch elements in viewport on load
    animateOnScroll();
  }
}

class SearchManager {
  constructor() {
    this.searchInput = document.querySelector('.search-input');
    this.init();
  }

  init() {
    if (!this.searchInput) return;
    
    this.searchInput.addEventListener('input', () => {
      const query = this.searchInput.value.toLowerCase().trim();
      
      if (query.length > 2) {
        this.showSearchResults(query);
      } else {
        this.hideSearchResults();
      }
    });
    
    // Focus and blur events for search
    this.searchInput.addEventListener('focus', () => {
      const resultsContainer = document.querySelector('.search-results');
      if (resultsContainer) {
        resultsContainer.style.display = 'block';
      }
    });
    
    this.searchInput.addEventListener('blur', () => {
      // Delay hiding results to allow clicking on them
      setTimeout(() => this.hideSearchResults(), 200);
    });
  }

  showSearchResults(query) {
    // Mock implementation - in a real app, this would be dynamic
    let resultsContainer = document.querySelector('.search-results');
    
    if (!resultsContainer) {
      resultsContainer = document.createElement('div');
      resultsContainer.className = 'search-results';
      resultsContainer.style.position = 'absolute';
      resultsContainer.style.top = '100%';
      resultsContainer.style.left = '0';
      resultsContainer.style.right = '0';
      resultsContainer.style.backgroundColor = 'white';
      resultsContainer.style.border = '1px solid #e2e8f0';
      resultsContainer.style.borderRadius = '4px';
      resultsContainer.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      resultsContainer.style.zIndex = '1000';
      resultsContainer.style.maxHeight = '300px';
      resultsContainer.style.overflowY = 'auto';
      
      const searchContainer = document.querySelector('.search-container');
      searchContainer.style.position = 'relative';
      searchContainer.appendChild(resultsContainer);
    }
    
    // Mock search results
    const mockResults = [
      { title: 'Getting Started Guide', url: '#', type: 'guide' },
      { title: 'Installation', url: '#', type: 'page' },
      { title: 'API Reference', url: '#', type: 'reference' },
      { title: 'Configuration Options', url: '#', type: 'page' },
      { title: 'Troubleshooting', url: '#', type: 'guide' }
    ];
    
    // Filter results based on query
    const filteredResults = mockResults.filter(result => 
      result.title.toLowerCase().includes(query)
    );
    
    // Render results
    resultsContainer.innerHTML = '';
    
    if (filteredResults.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'search-no-results';
      noResults.style.padding = '16px';
      noResults.style.color = '#718096';
      noResults.textContent = `No results found for "${query}"`;
      resultsContainer.appendChild(noResults);
    } else {
      filteredResults.forEach(result => {
        const resultItem = document.createElement('a');
        resultItem.href = result.url;
        resultItem.className = 'search-result-item';
        resultItem.style.display = 'block';
        resultItem.style.padding = '8px 16px';
        resultItem.style.color = '#4a5568';
        resultItem.style.textDecoration = 'none';
        resultItem.style.borderBottom = '1px solid #f1f5f9';
        
        resultItem.addEventListener('mouseenter', function() {
          this.style.backgroundColor = '#f7fafc';
        });
        
        resultItem.addEventListener('mouseleave', function() {
          this.style.backgroundColor = 'transparent';
        });
        
        // Result title
        const titleSpan = document.createElement('span');
        titleSpan.className = 'search-result-title';
        titleSpan.style.fontWeight = '500';
        titleSpan.textContent = result.title;
        
        // Result type badge
        const typeBadge = document.createElement('span');
        typeBadge.className = 'search-result-type';
        typeBadge.style.display = 'inline-block';
        typeBadge.style.marginLeft = '8px';
        typeBadge.style.padding = '2px 6px';
        typeBadge.style.fontSize = '11px';
        typeBadge.style.backgroundColor = '#e2e8f0';
        typeBadge.style.color = '#4a5568';
        typeBadge.style.borderRadius = '10px';
        typeBadge.textContent = result.type;
        
        resultItem.appendChild(titleSpan);
        resultItem.appendChild(typeBadge);
        resultsContainer.appendChild(resultItem);
      });
    }
    
    resultsContainer.style.display = 'block';
  }

  hideSearchResults() {
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
      resultsContainer.style.display = 'none';
    }
  }
}

class ThemeManager {
  constructor() {
    this.themeToggle = document.querySelector('.theme-toggle');
    this.init();
  }

  init() {
    if (!this.themeToggle) return;
    
    this.themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark-theme');
      this.updateThemeIcon();
      this.saveThemePreference();
    });
    
    // Initialize theme based on saved preference or system preference
    this.initializeTheme();
  }

  updateThemeIcon() {
    const themeIcon = this.themeToggle.querySelector('.theme-icon');
    if (document.documentElement.classList.contains('dark-theme')) {
      // Sun icon for light mode
      themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
    } else {
      // Moon icon for dark mode
      themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
    }
  }

  saveThemePreference() {
    const theme = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark-theme');
    }
    
    this.updateThemeIcon();
  }
}

class SmoothScrollManager {
  constructor(sidebarManager) {
    this.sidebarManager = sidebarManager;
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        
        // Skip if it's just a hash or has an onclick handler
        if (href === '#' || anchor.hasAttribute('onclick')) {
          return;
        }
        
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Adjust for header height
            behavior: 'smooth'
          });
          
          // Close mobile sidebar if open
          if (this.sidebarManager && this.sidebarManager.isOpen) {
            this.sidebarManager.closeSidebar();
          }
        }
      });
    });
  }
}

class TableOfContentsGenerator {
  constructor() {
    this.init();
  }

  init() {
    // This would generate a table of contents based on heading elements
    // For now, we'll just check if TOC exists and handle any necessary initialization
    const toc = document.querySelector('.table-of-contents');
    if (toc) {
      // Initialize active state for table of contents items based on scroll position
      this.setupScrollSpy();
    }
  }

  setupScrollSpy() {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY + 100;
      const headings = document.querySelectorAll('h2, h3, h4');
      const tocItems = document.querySelectorAll('.toc-item a');
      
      headings.forEach((heading, index) => {
        const headingTop = heading.offsetTop;
        const nextHeading = headings[index + 1];
        const headingBottom = nextHeading ? nextHeading.offsetTop : Infinity;
        
        if (scrollPosition >= headingTop && scrollPosition < headingBottom) {
          // Find corresponding TOC item and highlight it
          tocItems.forEach(item => item.classList.remove('active'));
          
          const correspondingItem = Array.from(tocItems).find(item => {
            const targetId = item.getAttribute('href').substring(1);
            return heading.getAttribute('id') === targetId;
          });
          
          if (correspondingItem) {
            correspondingItem.classList.add('active');
          }
        }
      });
    });
  }
}

// Initialize the documentation application
ready(function() {
  const docsApp = new DocsApp();
});