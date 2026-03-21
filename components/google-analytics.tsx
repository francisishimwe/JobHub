"use client"

import Script from "next/script"

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-36H1L40GBH"

export function GoogleAnalytics() {
    // Only load in production environment
    if (process.env.NODE_ENV !== "production") {
        return null
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
                onError={(e) => {
                    console.error("Google Analytics script failed to load:", e)
                }}
            />
            <Script 
                id="google-analytics" 
                strategy="afterInteractive"
                onError={(e) => {
                    console.error("Google Analytics initialization failed:", e)
                }}
            >
                {`
          (function() {
            try {
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_title: document.title,
                page_location: window.location.href,
                send_page_view: true
              });

              // -----------------------------
              // Custom Event Tracking Functions
              // -----------------------------
              window.trackJobApplied = function(jobTitle, category) {
                if(jobTitle && category && typeof gtag === 'function') {
                  gtag('event', 'job_applied', { 
                    job_title: jobTitle, 
                    category: category,
                    custom_parameter: 'job_application'
                  });
                }
              }

              window.trackCVUploaded = function(fileName, userId) {
                if(fileName && userId && typeof gtag === 'function') {
                  gtag('event', 'cv_uploaded', { 
                    file_name: fileName, 
                    user_id: userId,
                    custom_parameter: 'cv_upload'
                  });
                }
              }

              window.trackSearchPerformed = function(searchTerm) {
                if(searchTerm && typeof gtag === 'function') {
                  gtag('event', 'search_performed', { 
                    search_term: searchTerm,
                    custom_parameter: 'job_search'
                  });
                }
              }

              // -----------------------------
              // Automatic Event Binding
              // -----------------------------
              function bindEvents(root = document) {
                try {
                  // 1️⃣ Track Job Applications (button click)
                  root.querySelectorAll('[data-job-title][data-category]').forEach(btn => {
                    if(!btn.dataset.gaBound) {
                      btn.addEventListener('click', () => {
                        window.trackJobApplied(btn.dataset.jobTitle, btn.dataset.category);
                      });
                      btn.dataset.gaBound = 'true';
                    }
                  });

                  // 2️⃣ Track CV Uploads
                  root.querySelectorAll('input[type="file"][data-user-id]').forEach(input => {
                    if(!input.dataset.gaBound) {
                      input.addEventListener('change', () => {
                        if(input.files.length > 0) {
                          window.trackCVUploaded(input.files[0].name, input.dataset.userId);
                        }
                      });
                      input.dataset.gaBound = 'true';
                    }
                  });

                  // 3️⃣ Track Searches
                  root.querySelectorAll('form').forEach(form => {
                    const searchInput = form.querySelector('input[name="q"], input[name="search"], input[type="search"]');
                    if(searchInput && !form.dataset.gaBound) {
                      form.addEventListener('submit', () => {
                        const term = searchInput.value.trim();
                        if(term) window.trackSearchPerformed(term);
                      });
                      form.dataset.gaBound = 'true';
                    }
                  });
                } catch (error) {
                  console.error('Error binding GA events:', error);
                }
              }

              // Initial binding with proper DOM ready check
              if (typeof window !== 'undefined' && typeof gtag === 'function') {
                 if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => bindEvents());
                 } else {
                    // Use setTimeout to ensure DOM is fully ready
                    setTimeout(() => bindEvents(), 0);
                 }

                 // -----------------------------
                 // Dynamic Content Detection
                 // -----------------------------
                 const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                      mutation.addedNodes.forEach(node => {
                        if(node.nodeType === 1) {
                          bindEvents(node);
                        }
                      });
                    });
                 });

                 observer.observe(document.body, { childList: true, subtree: true });
              }
            } catch (error) {
              console.error('Google Analytics initialization error:', error);
            }
          })();
        `}
            </Script>
        </>
    )
}
