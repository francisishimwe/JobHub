const GA_MEASUREMENT_ID = "G-36H1L40GBH"

export function GoogleAnalytics() {
    return (
        <>
            {/* Google Analytics Script - Load Immediately */}
            <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_MEASUREMENT_ID}', {
                            page_title: document.title,
                            page_location: window.location.href,
                            send_page_view: true
                        });
                        
                        // Custom Event Tracking Functions
                        window.trackJobApplied = function(jobTitle, category) {
                            if(jobTitle && category && typeof gtag === 'function') {
                                gtag('event', 'job_applied', { 
                                    job_title: jobTitle, 
                                    category: category,
                                    custom_parameter: 'job_application'
                                });
                            }
                        };

                        window.trackCVUploaded = function(fileName, userId) {
                            if(fileName && userId && typeof gtag === 'function') {
                                gtag('event', 'cv_uploaded', { 
                                    file_name: fileName, 
                                    user_id: userId,
                                    custom_parameter: 'cv_upload'
                                });
                            }
                        };

                        window.trackSearchPerformed = function(searchTerm) {
                            if(searchTerm && typeof gtag === 'function') {
                                gtag('event', 'search_performed', { 
                                    search_term: searchTerm,
                                    custom_parameter: 'job_search'
                                });
                            }
                        };

                        // Automatic Event Binding
                        document.addEventListener('DOMContentLoaded', function() {
                            // Track Job Applications
                            document.querySelectorAll('[data-job-title][data-category]').forEach(btn => {
                                if(!btn.dataset.gaBound) {
                                    btn.addEventListener('click', () => {
                                        window.trackJobApplied(btn.dataset.jobTitle, btn.dataset.category);
                                    });
                                    btn.dataset.gaBound = 'true';
                                }
                            });

                            // Track CV Uploads
                            document.querySelectorAll('input[type="file"][data-user-id]').forEach(input => {
                                if(!input.dataset.gaBound) {
                                    input.addEventListener('change', () => {
                                        if(input.files.length > 0) {
                                            window.trackCVUploaded(input.files[0].name, input.dataset.userId);
                                        }
                                    });
                                    input.dataset.gaBound = 'true';
                                }
                            });

                            // Track Searches
                            document.querySelectorAll('form').forEach(form => {
                                const searchInput = form.querySelector('input[name="q"], input[name="search"], input[type="search"]');
                                if(searchInput && !form.dataset.gaBound) {
                                    form.addEventListener('submit', () => {
                                        const term = searchInput.value.trim();
                                        if(term) window.trackSearchPerformed(term);
                                    });
                                    form.dataset.gaBound = 'true';
                                }
                            });
                        });
                    `
                }}
            />
        </>
    )
}
