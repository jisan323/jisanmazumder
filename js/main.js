/**
 * JISAN MAZUMDER | SEO SPECIALIST & CONTENT STRATEGIST
 * Interactive Portfolio & SEO Analytics Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initDashboardChart();
  initCaseStudyModals();
  initInsightModals();
  initContactForm();
});

/* ==========================================================================
   1. NAVBAR & NAVIGATION
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky shrink effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  // Mobile menu toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active section spy
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  }
}

/* ==========================================================================
   2. SCROLL REVEAL (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   3. INTERACTIVE SEO ANALYTICS CHART
   ========================================================================== */
function initDashboardChart() {
  const chartSvg = document.getElementById('mainAnalyticsChart');
  const tooltip = document.getElementById('chartTooltip');
  const filterBtns = document.querySelectorAll('.dash-time-filter .filter-btn');
  
  if (!chartSvg || !tooltip) return;

  // Placeholder datasets demonstrating organic performance analytics
  const chartDatasets = {
    '30d': {
      labels: ['Day 1', 'Day 6', 'Day 12', 'Day 18', 'Day 24', 'Day 30'],
      primary: [32, 45, 48, 62, 78, 92],
      secondary: [20, 28, 33, 44, 52, 65],
      clicks: ['120', '195', '240', '380', '520', '710'],
      impressions: ['1.2k', '1.8k', '2.4k', '3.9k', '5.1k', '7.4k']
    },
    '90d': {
      labels: ['Month 1', 'Month 2', 'Month 3'],
      primary: [25, 55, 95],
      secondary: [15, 38, 70],
      clicks: ['420', '1,150', '2,890'],
      impressions: ['4.5k', '12.8k', '31.2k']
    },
    '12m': {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      primary: [20, 42, 68, 98],
      secondary: [10, 25, 45, 76],
      clicks: ['1.2k', '3.8k', '7.4k', '14.2k'],
      impressions: ['15k', '48k', '92k', '180k']
    }
  };

  let currentRange = '30d';

  function renderChart(rangeKey) {
    const data = chartDatasets[rangeKey];
    const width = 800;
    const height = 200;
    const padding = { top: 20, right: 30, bottom: 30, left: 40 };

    const usableWidth = width - padding.left - padding.right;
    const usableHeight = height - padding.top - padding.bottom;

    const pointsPrimary = data.primary.map((val, idx) => {
      const x = padding.left + (idx / (data.primary.length - 1)) * usableWidth;
      const y = padding.top + usableHeight - (val / 100) * usableHeight;
      return { x, y, val, label: data.labels[idx], clicks: data.clicks[idx], imp: data.impressions[idx] };
    });

    const pointsSecondary = data.secondary.map((val, idx) => {
      const x = padding.left + (idx / (data.secondary.length - 1)) * usableWidth;
      const y = padding.top + usableHeight - (val / 100) * usableHeight;
      return { x, y, val };
    });

    // Create curved path (Catmull-Rom or cubic Bezier)
    function createSmoothPath(points) {
      if (points.length === 0) return '';
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = i > 0 ? points[i - 1] : points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = i != points.length - 2 ? points[i + 2] : p2;
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
      return d;
    }

    const pathD = createSmoothPath(pointsPrimary);
    const pathSecD = createSmoothPath(pointsSecondary);
    const areaD = `${pathD} L ${padding.left + usableWidth} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

    // Build SVG inner HTML
    chartSvg.innerHTML = `
      <defs>
        <linearGradient id="chartGradPrimary" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#00f298" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#00f298" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="chartGradCyan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#00d2ff" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#00d2ff" stop-opacity="0.0"/>
        </linearGradient>
      </defs>

      <!-- Grid lines -->
      <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" class="chart-grid-line" />
      <line x1="${padding.left}" y1="${padding.top + usableHeight * 0.5}" x2="${width - padding.right}" y2="${padding.top + usableHeight * 0.5}" class="chart-grid-line" />
      <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" class="chart-grid-line" />

      <!-- Area fill -->
      <path d="${areaD}" fill="url(#chartGradPrimary)" />

      <!-- Secondary Curve (Impressions Baseline) -->
      <path d="${pathSecD}" class="chart-curve-secondary" />

      <!-- Primary Curve (Organic Clicks Growth) -->
      <path d="${pathD}" class="chart-curve-main" />

      <!-- Data Dots with Event Handlers -->
      ${pointsPrimary.map((p, i) => `
        <circle cx="${p.x}" cy="${p.y}" r="5" class="chart-dot" 
          data-label="${p.label}" 
          data-clicks="${p.clicks}" 
          data-imp="${p.imp}" 
          data-index="${i}"
        />
      `).join('')}

      <!-- X-axis Labels -->
      ${pointsPrimary.map(p => `
        <text x="${p.x}" y="${height - 8}" fill="#64748b" font-size="11" font-family="'JetBrains Mono', monospace" text-anchor="middle">
          ${p.label}
        </text>
      `).join('')}
    `;

    // Bind Dot Interactions
    const dots = chartSvg.querySelectorAll('.chart-dot');
    dots.forEach(dot => {
      dot.addEventListener('mouseenter', (e) => {
        const label = dot.getAttribute('data-label');
        const clicks = dot.getAttribute('data-clicks');
        const imp = dot.getAttribute('data-imp');
        
        tooltip.innerHTML = `
          <div style="font-weight: 700; color: #00f298; margin-bottom: 2px;">${label} (Placeholder)</div>
          <div>Clicks: <strong style="color: #fff">${clicks}</strong></div>
          <div>Impressions: <strong style="color: #00d2ff">${imp}</strong></div>
        `;
        tooltip.style.display = 'block';

        const svgRect = chartSvg.getBoundingClientRect();
        const cx = parseFloat(dot.getAttribute('cx'));
        const cy = parseFloat(dot.getAttribute('cy'));
        
        // Scale to actual rendered dimensions
        const scaleX = svgRect.width / width;
        const scaleY = svgRect.height / height;

        tooltip.style.left = `${svgRect.left + window.scrollX + cx * scaleX}px`;
        tooltip.style.top = `${svgRect.top + window.scrollY + cy * scaleY - 12}px`;
      });

      dot.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  }

  // Initial render
  renderChart(currentRange);

  // Time Filter Button Event Handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRange = btn.getAttribute('data-range');
      renderChart(currentRange);
    });
  });
}

/* ==========================================================================
   4. CASE STUDY DETAIL MODALS (JUST SOLAR CO & JUST WATER CO ONLY)
   ========================================================================== */
function initCaseStudyModals() {
  const modalOverlay = document.getElementById('caseStudyModal');
  const modalBody = document.getElementById('caseStudyModalBody');
  const closeBtn = document.getElementById('caseStudyCloseBtn');
  const triggerBtns = document.querySelectorAll('.btn-view-study');

  const caseStudiesData = {
    'just-solar': {
      title: 'Just Solar Co',
      industry: 'Solar & Renewable Energy',
      tagline: 'Strengthening Search Authority & Clean Energy Intent Capture',
      services: ['SEO Content Strategy', 'Keyword Research', 'On-Page SEO', 'Content Optimization', 'Organic Growth Strategy'],
      overview: 'Just Solar Co is dedicated to delivering residential and commercial clean energy solutions. The objective was to build a comprehensive SEO foundation, aligning site architecture and informational content with high-intent solar searches.',
      challenge: 'The solar sector is highly competitive with intense competition from national aggregators and local installers. The website needed targeted content hubs, optimized metadata, clear internal linking, and strategic topical clustering around solar installation, ROI calculations, and federal tax incentive queries.',
      strategy: [
        'Comprehensive keyword intent mapping for commercial and residential solar buyers.',
        'Creation of structured topical clusters covering solar efficiency, installation timelines, and financing options.',
        'Technical on-page optimization including schema markup for local service areas and FAQ rich snippets.'
      ],
      execution: [
        'Conducted complete audit of existing service pages and content gaps.',
        'Engineered 15+ comprehensive informational guides targeting informational and commercial search intent.',
        'Optimized header tags (H1-H3), image alt texts, meta titles, and conversion-focused calls to action.'
      ],
      contentApproach: 'Focused on high-clarity, trustworthy educational content addressing common homeowner hesitations (roof compatibility, battery storage, ROI payback periods), establishing domain expertise without promotional fluff.',
      optimization: 'Streamlined page load speed, implemented semantic structured data (Service, FAQPage schema), and cleaned internal link architecture to direct equity toward core regional service landing pages.',
      results: {
        traffic: '[Add Real Data]',
        keywords: '[Add Real Data]',
        visibility: '[Add Real Data]',
        conversions: '[Add Real Data]'
      },
      beforeAfter: {
        before: ['Unfocused keyword targeting', 'Thin informational service content', 'Missing structured schema data', 'Isolated pages with weak internal linking'],
        after: ['Intent-driven topical keyword clusters', 'Comprehensive solar guide library', 'Full semantic schema & rich snippets', 'Structured topic silo internal linking']
      }
    },
    'just-water': {
      title: 'Just Water Co',
      industry: 'Water & Home Services',
      tagline: 'Capturing Local & Residential Water Solution Search Intent',
      services: ['SEO Content Strategy', 'Keyword Research', 'On-Page SEO', 'Content Optimization', 'Organic Growth Strategy'],
      overview: 'Just Water Co specializes in residential water filtration, bottle delivery, and system maintenance. The goal was to expand organic visibility across local search queries and build search equity around water quality and filtration solutions.',
      challenge: 'Target audiences searched for both high-urgency maintenance terms and broad water quality concerns (hard water testing, reverse osmosis vs whole-home filters). The brand needed structured pages capturing both immediate service intent and research-phase visitors.',
      strategy: [
        'Identified long-tail problem-aware search queries around water contamination, filtration types, and routine maintenance.',
        'Built targeted service landing pages optimized for localized search intent.',
        'Implemented clear on-page hierarchy connecting informational guides directly to relevant service solutions.'
      ],
      execution: [
        'Restructured core service navigation to improve crawl depth and user discoverability.',
        'Authored optimized, research-backed guides answering common water quality questions.',
        'Refined meta descriptions, titles, and on-page headings for maximum SERP click-through rate.'
      ],
      contentApproach: 'Structured educational content highlighting practical water quality diagnostics, comparison matrices of filtration systems, and transparent maintenance guidelines to foster user trust and dwell time.',
      optimization: 'Optimized Core Web Vitals, improved mobile viewport layout for on-the-go service booking, and embedded LocalBusiness and Service schema markup.',
      results: {
        traffic: '[Add Real Data]',
        keywords: '[Add Real Data]',
        visibility: '[Add Real Data]',
        conversions: '[Add Real Data]'
      },
      beforeAfter: {
        before: ['Scattered service descriptions', 'Zero educational water guides', 'No localized schema markup', 'Generic metadata with low CTR'],
        after: ['Structured service hierarchy', 'High-authority water quality hub', 'Complete LocalBusiness schema', 'Compelling SERP-optimized snippets']
      }
    }
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectId = btn.getAttribute('data-project');
      const study = caseStudiesData[projectId];
      if (!study) return;

      modalBody.innerHTML = `
        <div class="case-study-hero">
          <div class="case-study-tag">Featured Project · ${study.industry}</div>
          <h2 class="case-study-title">${study.title}</h2>
          <p class="case-study-industry">${study.tagline}</p>
          <div class="project-services-list" style="margin-top: 14px;">
            ${study.services.map(s => `<span class="project-service-tag">${s}</span>`).join('')}
          </div>
        </div>

        <div class="case-section-block">
          <h3 class="case-section-heading">01. Project Overview</h3>
          <p style="color: var(--text-secondary); line-height: 1.7;">${study.overview}</p>
        </div>

        <div class="case-section-block">
          <h3 class="case-section-heading">02. The SEO Challenge</h3>
          <p style="color: var(--text-secondary); line-height: 1.7;">${study.challenge}</p>
        </div>

        <div class="case-section-block">
          <h3 class="case-section-heading">03. Strategy & Intent Mapping</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
            ${study.strategy.map(item => `
              <li style="display: flex; align-items: baseline; gap: 10px; color: var(--text-secondary);">
                <span style="color: var(--accent-green); font-size: 0.8rem;">◆</span> ${item}
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="case-section-block">
          <h3 class="case-section-heading">04. Execution & Implementation</h3>
          <ul style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
            ${study.execution.map(item => `
              <li style="display: flex; align-items: baseline; gap: 10px; color: var(--text-secondary);">
                <span style="color: var(--accent-cyan); font-size: 0.8rem;">◆</span> ${item}
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="case-section-block">
          <h3 class="case-section-heading">05. Content & Optimization Approach</h3>
          <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 12px;"><strong>Content Approach:</strong> ${study.contentApproach}</p>
          <p style="color: var(--text-secondary); line-height: 1.7;"><strong>Technical Optimization:</strong> ${study.optimization}</p>
        </div>

        <div class="case-section-block">
          <h3 class="case-section-heading">06. Strategy Comparison (Before vs. After)</h3>
          <div class="case-before-after">
            <div class="ba-box before">
              <div class="ba-title">Before Optimization</div>
              <div class="ba-list">
                ${study.beforeAfter.before.map(b => `<div>• ${b}</div>`).join('')}
              </div>
            </div>
            <div class="ba-box after">
              <div class="ba-title">After Strategic SEO</div>
              <div class="ba-list">
                ${study.beforeAfter.after.map(a => `<div>✓ ${a}</div>`).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="case-section-block">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <h3 class="case-section-heading" style="margin-bottom: 0;">07. Project Results</h3>
            <span class="badge-editable">✏️ Editable Placeholder</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
            To maintain complete integrity, placeholders are provided below. Insert verified Google Search Console or Analytics metrics when published.
          </p>
          <div class="case-results-grid">
            <div class="case-result-box">
              <div class="c-res-label">Organic Traffic</div>
              <div class="c-res-val">${study.results.traffic}</div>
            </div>
            <div class="case-result-box">
              <div class="c-res-label">Keyword Growth</div>
              <div class="c-res-val">${study.results.keywords}</div>
            </div>
            <div class="case-result-box">
              <div class="c-res-label">Search Visibility</div>
              <div class="c-res-val">${study.results.visibility}</div>
            </div>
            <div class="case-result-box">
              <div class="c-res-label">Conversions</div>
              <div class="c-res-val">${study.results.conversions}</div>
            </div>
          </div>
        </div>
      `;

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
    });
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   5. INSIGHTS / BLOG ARTICLE PREVIEW MODAL
   ========================================================================== */
function initInsightModals() {
  const modalOverlay = document.getElementById('caseStudyModal');
  const modalBody = document.getElementById('caseStudyModalBody');
  const triggerBtns = document.querySelectorAll('.btn-read-insight');

  const articles = {
    'search-intent': {
      title: 'How Search Intent Shapes a Successful SEO Strategy',
      category: 'SEO Strategy',
      date: 'Published Article Concept',
      content: `
        <p style="margin-bottom: 16px; color: var(--text-secondary); line-height: 1.8;">
          Search engine optimization is no longer just about matching exact keywords in titles and headers. Google's modern ranking algorithms (including neural matching and semantic search models) are engineered to understand <strong>what the user actually wants to accomplish</strong>.
        </p>
        <h4 style="color: #fff; margin: 20px 0 10px;">The 4 Core Intent Archetypes</h4>
        <ul style="display: flex; flex-direction: column; gap: 8px; color: var(--text-secondary); margin-bottom: 18px;">
          <li><strong>Informational:</strong> Users researching answers (e.g., "how do solar panels work"). Best served with comprehensive, clear guides.</li>
          <li><strong>Commercial Investigation:</strong> Users comparing options (e.g., "best water filtration systems 2026"). Best served with side-by-side matrices and unbiased criteria.</li>
          <li><strong>Transactional:</strong> Users ready to purchase or book (e.g., "hire solar installer near me"). Best served with friction-free landing pages and clear CTAs.</li>
          <li><strong>Navigational:</strong> Users seeking a specific brand or login page.</li>
        </ul>
        <p style="color: var(--text-secondary); line-height: 1.8;">
          Aligning every URL with exact user intent is the single highest-leverage strategy to decrease bounce rates and increase organic conversions.
        </p>
      `
    },
    'keyword-research': {
      title: 'Keyword Research: From Search Terms to Content Opportunities',
      category: 'Keyword Research',
      date: 'Published Article Concept',
      content: `
        <p style="margin-bottom: 16px; color: var(--text-secondary); line-height: 1.8;">
          Effective keyword research goes beyond looking up search volume metrics in a spreadsheet. It involves analyzing SERP features, competitor content gaps, and topical authority clusters.
        </p>
        <h4 style="color: #fff; margin: 20px 0 10px;">The Modern Keyword Framework</h4>
        <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 12px;">
          1. <strong>Seed Term Discovery:</strong> Mining customer questions, support tickets, and competitor sitemaps.
        </p>
        <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 12px;">
          2. <strong>SERP Anatomy Evaluation:</strong> Observing what currently ranks (listicles, video carousels, local packs) to avoid creating the wrong content format.
        </p>
        <p style="color: var(--text-secondary); line-height: 1.8;">
          3. <strong>Topical Clustering:</strong> Grouping dozens of related long-tail terms under single authoritative pillar resources rather than creating thin duplicate pages.
        </p>
      `
    },
    'on-page-seo': {
      title: 'On-Page SEO Essentials for Better Search Visibility',
      category: 'On-Page Optimization',
      date: 'Published Article Concept',
      content: `
        <p style="margin-bottom: 16px; color: var(--text-secondary); line-height: 1.8;">
          On-page SEO remains the foundational baseline for search visibility. Proper document structure communicates context to search crawlers and improves accessibility for users.
        </p>
        <h4 style="color: #fff; margin: 20px 0 10px;">Essential Checkpoints</h4>
        <ul style="display: flex; flex-direction: column; gap: 8px; color: var(--text-secondary); margin-bottom: 18px;">
          <li>• Strict H1 to H3 hierarchy with descriptive, keyword-integrated headings.</li>
          <li>• Concise title tags under 60 characters and click-optimized meta descriptions under 155 characters.</li>
          <li>• Contextual internal linking with descriptive anchor text to pass topical relevance.</li>
          <li>• Meaningful alt text on all visual assets and structured JSON-LD schema.</li>
        </ul>
      `
    },
    'organic-growth': {
      title: 'Building a Sustainable Organic Growth Strategy',
      category: 'Organic Growth',
      date: 'Published Article Concept',
      content: `
        <p style="margin-bottom: 16px; color: var(--text-secondary); line-height: 1.8;">
          Sustainable organic growth is not built on temporary shortcuts or algorithmic exploits. It is an iterative system that compounds over time when technical health, content quality, and search relevance operate in harmony.
        </p>
        <p style="color: var(--text-secondary); line-height: 1.8; margin-top: 14px;">
          By establishing a regular rhythm of content optimization, technical auditing, and keyword opportunity discovery, websites build long-term search equity that continues to deliver organic returns month after month.
        </p>
      `
    }
  };

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const articleId = btn.getAttribute('data-article');
      const article = articles[articleId];
      if (!article) return;

      modalBody.innerHTML = `
        <div class="case-study-hero">
          <div class="case-study-tag">${article.category} · ${article.date}</div>
          <h2 class="case-study-title">${article.title}</h2>
        </div>
        <div style="padding-top: 10px; border-top: 1px solid var(--border-subtle);">
          ${article.content}
        </div>
        <div style="margin-top: 30px; padding: 16px; background: rgba(255,255,255,0.03); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md); font-size: 0.85rem; color: var(--text-muted);">
          ✏️ <em>Editable Article Container: Jisan Mazumder can connect this directly to a headless CMS or static markdown blog system.</em>
        </div>
      `;

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
}

/* ==========================================================================
   6. CONTACT FORM INTERACTION & TOAST NOTIFICATION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolioContactForm');
  const toast = document.getElementById('contactToast');
  const toastMessage = document.getElementById('toastMessage');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#contactName').value.trim();
    const email = form.querySelector('#contactEmail').value.trim();
    const message = form.querySelector('#contactMessage').value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', '#ef4444');
      return;
    }

    // Button loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Sending...</span>`;
    submitBtn.disabled = true;

    // Simulate sending message
    setTimeout(() => {
      submitBtn.innerHTML = `<span>Message Sent! ✓</span>`;
      submitBtn.style.background = 'linear-gradient(135deg, #00f298, #00c77b)';
      form.reset();

      showToast(`Thank you, ${name}! Your message has been prepared for Jisan Mazumder.`, '#00f298');

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }, 3500);
    }, 900);
  });

  function showToast(msg, borderColor = '#00f298') {
    if (!toast) return;
    toast.style.borderColor = borderColor;
    if (toastMessage) toastMessage.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}
