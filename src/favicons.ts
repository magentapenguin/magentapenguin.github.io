import BootstrapIcon from "./bsicons";

export default class Favicon extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        const url = this.getAttribute('url');
        const size = this.getAttribute('size') ?? '1em';
        if (!url) {
            throw new Error('Favicon URL is required');
        }
        const img = document.createElement('img');
        img.src = url+'favicon.svg';
        img.alt = 'Favicon';
        function onError() {
            console.warn(`Failed to load favicon ${url}`);
            img.remove();
            const defaultIcon = new BootstrapIcon();
            defaultIcon.setAttribute('name', 'globe');
            defaultIcon.setAttribute('size', size);
            this.appendChild(defaultIcon);
        }

        fetch(url+'favicon.svg', {
            cache: 'force-cache',
            method: 'HEAD'  // only check the headers
        }).catch(() => {
            onError.bind(this)();
        }).then(response => {
            if (response && !response.ok) {
                onError.bind(this)();
            } else if (response && response.headers.get('Content-Type') !== 'image/svg+xml') {
                onError.bind(this)();
            }
        });
        img.style.width = size;
        img.style.height = size;
        this.appendChild(img);
    }
}

customElements.define('fav-icon', Favicon);