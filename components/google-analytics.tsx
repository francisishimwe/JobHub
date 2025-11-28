"use client"

import Script from "next/script"

export function GoogleAnalytics() {
    return (
        <>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-36H1L40GBH"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-36H1L40GBH');

          // -----------------------------
          // Custom Event Tracking Functions
          // -----------------------------
          window.trackJobApplied = function(jobTitle, category) {
            if(jobTitle && category) {
              gtag('event', 'job_applied', { job_title: jobTitle, category: category });
            }
          }

          window.trackCVUploaded = function(fileName, userId) {
            if(fileName && userId) {
              gtag('event', 'cv_uploaded', { file_name: fileName, user_id: userId });
            }
          }

          window.trackSearchPerformed = function(searchTerm) {
            if(searchTerm) {
              gtag('event', 'search_performed', { search_term: searchTerm });
            }
          }

          // -----------------------------
          // Automatic Event Binding
          // -----------------------------
          function bindEvents(root = document) {

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
              const searchInput = form.querySelector('input[name="q"]');
              if(searchInput && !form.dataset.gaBound) {
                form.addEventListener('submit', () => {
                  const term = searchInput.value.trim();
                  if(term) window.trackSearchPerformed(term);
                });
                form.dataset.gaBound = 'true';
              }
            });
          }

          // Initial binding
          if (typeof window !== 'undefined') {
             // We need to wait for DOMContentLoaded if it hasn't fired yet, 
             // but since this is a client component in Next.js, it might mount after.
             // Safe to call bindEvents immediately if document is ready, or add listener.
             if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => bindEvents());
             } else {
                bindEvents();
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
        `}
            </Script>
        </>
    )
}
