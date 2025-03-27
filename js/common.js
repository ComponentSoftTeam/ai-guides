/**
 * @typedef {Object} A.DefaultConfigParameters
 * @property {string | null} port - Port number placeholder
 * @property {string | null} domain - Domain name placeholder
 * @property {string} guacamole_name - Remote lab username placeholder
 * @property {string} pass - Password placeholder
 * @property {string} pri_rlab - Primary remote lab location
 */

/**
 * Default configuration parameters for the application
 * @type {DefaultConfigParameters}
 */
const DEFAULT_PARAMETERS = {
    port: null,
    domain: null,
    guacamole_name: '<REMOTE LAB USERNAME>',
    pass: '<PASSWORD>',
    pri_rlab: 'rlab-eu'
};


/**
 * Gets the default parameters for the application
 * @returns {DefaultConfigParameters} An object containing default parameters for the application
 */
export function getDefaultParameters() {
    return getParameters(Object.keys(DEFAULT_PARAMETERS), DEFAULT_PARAMETERS);
}

/**
 * Gets the Guacamole connection URL based on configuration parameters
 * @param {DefaultConfigParameters} params - Configuration parameters
 * @returns {string | null} The complete Guacamole connection URL
 */
export function getGuacamoleLink(params) {
    return (params?.domain) ? `https://${params.domain}/rdp`: null;
}

/**
 * Gets the Jupyter URL based on configuration parameters
 * @param {DefaultConfigParameters} params - Configuration parameters
 * @returns {string | null} The complete Jupyter URL
 */
export function getJupyterLink(params) {
    if (!params?.domain || !params?.port) return null;
    const machine_id = parseInt(params.port.slice(-2));
    if (isNaN(machine_id)) return null;
    return `https://${params.domain}/${machine_id}`;
}

/**
 * Gets the URL parameters from the current page
 * 
 * @param {string[]} paramNames - List of parameter names to get
 * @param {Object} defaults - Object with default values for parameters
 * @return {Object} - Object containing the extracted parameters
 */
export function getParameters(paramNames, defaults = {}) {
    const urlParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(paramNames.map(param => [param, (urlParams.get(param) ?? defaults[param]) ?? null ]));
}

/**
 * Creates a copiable element with copy functionality
 * @param {string} id - Unique identifier for the element
 * @param {string} label - The label text to display
 * @param {string} value - The content that will be copied
 * @returns {HTMLElement} The created copiable element container
 */
export function createCopiableElement(id, label, value) {
    const container = document.createElement('div');
    container.className = 'credential-container';
    container.id = id + 'Container';
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'credential-label';
    labelSpan.innerHTML = `<b>${label}:</b>`;
    
    const textSpan = document.createElement('span');
    textSpan.className = 'credential-text';
    textSpan.id = id + 'Text';
    textSpan.innerText = value;
    
    const copyIcon = document.createElement('img');
    copyIcon.src = './img/copy-regular.svg';
    copyIcon.alt = 'Copy';
    copyIcon.className = 'copy-icon';
    copyIcon.onclick = function() { 
        const textValue = textSpan.innerText;
        copyText(notification, textValue); 
    };
    
    const notification = document.createElement('span');
    notification.className = 'copy-notification';
    notification.id = id + 'Notification';
    notification.innerText = 'Copied!';
    
    container.appendChild(labelSpan);
    container.appendChild(textSpan);
    container.appendChild(copyIcon);
    container.appendChild(notification);
    
    return container;
}

/**
 * Copies the provided text to the clipboard and shows a notification
 * @param {HTMLElement} notification - The notification element to show
 * @param {string} textToCopy - The text to copy to clipboard
 */
export function copyText(notification, textToCopy) {
    // For compatibility
    if (!!navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy);
    } else {
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = textToCopy;
        document.body.appendChild(tempTextArea);
        tempTextArea.select()
        document.execCommand("copy");
        document.body.removeChild(tempTextArea);
    }

    // Show notification
    notification.style.display = "inline-block";
    notification.style.opacity = 1; // Make it visible
    setTimeout(() => {
        notification.style.opacity = 0; // Fade out
        setTimeout(() => {
            notification.style.display = "none"; // Hide after fade
        }, 300); // Time to match the fade out duration
    }, 2000); // Show for 2 seconds
}


