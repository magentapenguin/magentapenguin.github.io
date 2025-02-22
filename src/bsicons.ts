export default class BootstrapIcon extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        const name = this.getAttribute('name');
        const size = this.getAttribute('size') ?? '1em';
        const base = import.meta.env.BASE_URL;
        // load the icon from '/icons' folder
        fetch(`${base}icons/${name}.svg`, {
            cache: 'force-cache'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load icon ${name}`);
                }
                if (response.headers.get('Content-Type') !== 'image/svg+xml') {
                    throw new Error(`Invalid content type for icon ${name} - ${response.headers.get('Content-Type')}`);
                }
                return response.text()
            })
            .then(svg => {
                this.innerHTML = svg;
                this.style.width = size;
                this.style.height = size;
                const svgElement = this.querySelector('svg');
                if (svgElement) {
                    svgElement.style.width = '100%';
                    svgElement.style.height = '100%';
                }
            }
        );
    }
}

customElements.define('bs-icon', BootstrapIcon);