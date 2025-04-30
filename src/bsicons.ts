export default class BootstrapIcon extends HTMLElement {
    constructor() {
        super();
    }
    static get observedAttributes() {
        return ['name', 'size'];
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        console.log('Attribute changed:', name, oldValue, newValue);
        if (name === 'size') {
            this.style.width = newValue;
            this.style.height = newValue;
        }
        if (name === 'name') {
            // Use Vite's import.meta.env.BASE_URL if available, otherwise fallback to '/'
            const base = (import.meta as any).env?.BASE_URL || '/';
            // load the icon from '/icons' folder
            fetch(`${base}icons/${newValue}.svg`, {
                cache: 'force-cache'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to load icon ${newValue}`);
                    }
                    if (response.headers.get('Content-Type') !== 'image/svg+xml') {
                        throw new Error(`Invalid content type for icon ${newValue} - ${response.headers.get('Content-Type')}`);
                    }
                    return response.text()
                })
                .then(svg => {
                    this.innerHTML = svg;
                    this.style.width = this.getAttribute('size') ?? '1em';
                    this.style.height = this.getAttribute('size') ?? '1em';
                    const svgElement = this.querySelector('svg');
                    if (svgElement) {
                        svgElement.style.width = '100%';
                        svgElement.style.height = '100%';
                    }
                }
            );
            return;
        }
    }
}

customElements.define('bs-icon', BootstrapIcon);