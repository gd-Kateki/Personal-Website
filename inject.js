const fs = require('fs');
const glob = require('glob'); // wait, glob might not be installed. I will use native fs.readdirSync
const path = require('path');

const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));

const headScript = `
  <script>
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark-mode');
    }
  </script>
</head>`;

const themeToggle = `
    <!-- Theme toggle -->
    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle Dark Mode">
      <svg class="sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      <svg class="moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    </button>
  </nav>`;

const bottomScript = `
  <script>
    /* Theme Toggle */
    const themeBtn = document.getElementById('theme-toggle');
    const sunIcon = themeBtn.querySelector('.sun-icon');
    const moonIcon = themeBtn.querySelector('.moon-icon');
    
    function updateThemeIcon() {
      if (document.documentElement.classList.contains('dark-mode')) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
    
    if (themeBtn) {
      updateThemeIcon();
      themeBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        if (document.documentElement.classList.contains('dark-mode')) {
          localStorage.setItem('theme', 'dark');
        } else {
          localStorage.setItem('theme', 'light');
        }
        updateThemeIcon();
      });
    }
  </script>
</body>`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes('id="theme-toggle"')) {
        console.log(`Skipping ${file}, already injected.`);
        return;
    }
    
    content = content.replace('</head>', headScript);
    content = content.replace('</nav>', themeToggle);
    content = content.replace('</body>', bottomScript);
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Injected into ${file}`);
});
