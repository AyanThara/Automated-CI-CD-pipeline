/**
 * JavaScript logic for the DevOps Control Panel
 * Handles API interactions with the Spring Boot backend
 */

const consoleOutput = document.getElementById('console-output');

/**
 * Format timestamp for console logs
 */
function getTimeString() {
    const now = new Date();
    return now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
}

/**
 * Append HTML safely to console
 */
function appendToConsole(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    // Append all child nodes
    while (div.firstChild) {
        consoleOutput.appendChild(div.firstChild);
    }
    // Auto-scroll to bottom
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

/**
 * Clear the console output
 */
function clearConsole() {
    consoleOutput.innerHTML = `<div class="text-secondary mb-2">> [${getTimeString()}] Console cleared. Waiting for requests...</div>`;
}

/**
 * Make an API request to the backend
 * @param {string} method HTTP Method (GET, POST, etc.)
 * @param {string} endpoint The endpoint path (e.g. '/customers')
 */
async function testApi(method, endpoint) {
    const time = getTimeString();
    
    // Log the request
    let reqHtml = `
        <div class="req-line">
            <span class="text-muted">[${time}]</span> <span class="fw-bold">REQ:</span> ${method} ${endpoint}
        </div>
        <div class="text-secondary small ms-3">Executing request...</div>
    `;
    appendToConsole(reqHtml);

    try {
        const fetchOptions = {
            method: method,
            headers: {
                'Accept': 'text/plain, application/json, */*'
            }
        };

        // Execute the fetch request
        const response = await fetch(endpoint, fetchOptions);
        
        // Ensure response is OK before reading text
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.text();
        
        // Log the response
        const resTime = getTimeString();
        let resHtml = `
            <div class="res-line">
                <div class="text-muted small mb-1">Status: ${response.status} OK</div>
                <div class="text-light">${escapeHtml(data)}</div>
            </div>
        `;
        
        // Add a slight delay for realistic "network" feel if testing locally
        setTimeout(() => {
            // Remove the "Executing request..." text
            if(consoleOutput.lastElementChild.classList.contains('text-secondary')) {
               // consoleOutput.removeChild(consoleOutput.lastElementChild);
            }
            appendToConsole(resHtml);
        }, 300);

    } catch (error) {
        // Log the error
        let errHtml = `
            <div class="err-line">
                <div class="text-muted small mb-1">Status: Failed</div>
                <div>${escapeHtml(error.message)}</div>
            </div>
        `;
        setTimeout(() => {
            appendToConsole(errHtml);
        }, 300);
    }
}

/**
 * Simple HTML escaping to prevent XSS if API returns bad data
 */
function escapeHtml(unsafe) {
    if(!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Add smooth scrolling for navbar links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Adjust for fixed navbar height
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
            window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
            });
        }
    });
});
