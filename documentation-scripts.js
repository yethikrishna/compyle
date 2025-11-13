// Document ready function
function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(function() {
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  
  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      
      // Add overlay for mobile view
      const overlay = document.querySelector('.sidebar-overlay');
      if (sidebar.classList.contains('open')) {
        createOverlay();
      } else if (overlay) {
        overlay.remove();
      }
    });
  }
  
  // Create sidebar overlay for mobile view
  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '800';
    
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('open');
      overlay.remove();
    });
    
    document.body.appendChild(overlay);
  }
  
  // Collapsible navigation dropdowns
  const toggleDropdowns = document.querySelectorAll('.toggle-dropdown');
  
  toggleDropdowns.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const parent = this.closest('.nav-dropdown');
      
      // Toggle current dropdown
      parent.classList.toggle('open');
      this.classList.toggle('open');
      
      // Close other dropdowns (optional)
      toggleDropdowns.forEach(otherToggle => {
        if (otherToggle !== this) {
          const otherParent = otherToggle.closest('.nav-dropdown');
          otherParent.classList.remove('open');
          otherToggle.classList.remove('open');
        }
      });
    });
  });
  
  // Code block copy functionality
  const copyButtons = document.querySelectorAll('.copy-button');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const codeBlock = this.closest('.code-block');
      const code = codeBlock.querySelector('code').textContent;
      
      navigator.clipboard.writeText(code).then(() => {
        const originalText = this.textContent;
        this.textContent = 'Copied!';
        this.classList.add('copied');
        
        setTimeout(() => {
          this.textContent = originalText;
          this.classList.remove('copied');
        }, 2000);
      });
    });
  });
  
  // Search functionality (basic implementation)
  const searchInput = document.querySelector('.search-input');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      
      if (query.length > 2) {
        // Here you would typically: 
        // 1. Make an API call to your search endpoint
        // 2. Show search results in a dropdown
        // 3. Handle keyboard navigation
        console.log('Search query:', query);
        
        // Simple mock implementation
        showSearchResults(query);
      } else {
        hideSearchResults();
      }
    });
    
    // Focus and blur events for search
    searchInput.addEventListener('focus', function() {
      const resultsContainer = document.querySelector('.search-results');
      if (resultsContainer) {
        resultsContainer.style.display = 'block';
      }
    });
    
    searchInput.addEventListener('blur', function() {
      // Delay hiding results to allow clicking on them
      setTimeout(hideSearchResults, 200);
    });
  }
  
  function showSearchResults(query) {
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
  
  function hideSearchResults() {
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
      resultsContainer.style.display = 'none';
    }
  }
  
  // Theme toggle functionality
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.documentElement.classList.toggle('dark-theme');
      
      // Update icon based on theme
      const themeIcon = this.querySelector('.theme-icon');
      if (document.documentElement.classList.contains('dark-theme')) {
        // Switch to sun icon for light mode
        themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        localStorage.setItem('theme', 'dark');
      } else {
        // Switch to moon icon for dark mode
        themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        localStorage.setItem('theme', 'light');
      }
    });
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark-theme');
      const themeIcon = themeToggle.querySelector('.theme-icon');
      themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
    }
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just a hash or has an onclick handler
      if (href === '#' || this.hasAttribute('onclick')) {
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
        if (sidebar && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
          const overlay = document.querySelector('.sidebar-overlay');
          if (overlay) overlay.remove();
        }
      }
    });
  });
  
  // Active navigation item based on current URL
  function setActiveNavItem() {
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
  
  // Set active navigation item on page load
  setActiveNavItem();
  
  // Responsive adjustments
  function handleResize() {
    if (window.innerWidth > 768 && sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) overlay.remove();
    }
  }
  
  // Listen for resize events
  window.addEventListener('resize', handleResize);
});