import links from './links.json';
import BootstrapIcon from './bsicons';

interface LinkOptions {
    type?: 'link';
    name: string;
    url: string;
    icon?: string;
    description?: string;
}
interface HeaderOptions {
    type?: 'header';
    name: string;
    icon?: string;
}

async function makeLink(opts: LinkOptions) {
    console.log('Making link:', opts);
    const li = document.createElement('li');
    const icon = document.createElement('img');
    try {
        if (!opts.icon) {
            throw new Error('No icon provided');
        }
        icon.src = opts.icon;
    } catch (e) {
        console.error('Error fetching icon:', e);
        const newIcon = new BootstrapIcon();
        newIcon.setAttribute('name', 'globe');
        newIcon.setAttribute('size', '1em');
        icon.replaceWith(newIcon);        
    }
    icon.crossOrigin = 'anonymous';
    icon.onerror = () => {
        const newIcon = new BootstrapIcon();
        newIcon.setAttribute('name', 'globe');
        newIcon.setAttribute('size', '1em');
        icon.replaceWith(newIcon);
    }
    icon.classList.add('favicon');
    li.appendChild(icon);
    const a = document.createElement('a');
    a.href = opts.url;
    a.target = '_blank';
    a.classList.add('text-blue-500', 'hover:text-blue-400');
    a.innerText = opts.name;
    const iconElement = new BootstrapIcon();
    iconElement.setAttribute('name', 'arrow-right-short');
    iconElement.setAttribute('size', '1em');
    iconElement.classList.add('text-xl');
    a.appendChild(iconElement);
    li.appendChild(a);
    if (opts.description) {
        const desc = document.createElement('p');
        desc.innerText = opts.description;
        desc.classList.add('text-gray-500', 'text-sm');
        li.appendChild(desc);
    }
    return li;
}
async function makeHeader(opts: HeaderOptions) {
    const li = document.createElement('li');
    if (opts.icon) {
        const icon = document.createElement('img');
        icon.src = opts.icon;
        icon.crossOrigin = 'anonymous';
        icon.onerror = () => {
            icon.remove();
        }
    }
    const span = document.createElement('span');
    span.innerText = opts.name;
    span.classList.add('text-blue-500', 'hover:text-blue-400');
    li.appendChild(span);
    return li;
}
(async () => {
    console.log('Links:', links);
    const list = document.getElementById('links');
    if (!list) {
        throw new Error('Links list not found');
    }
    for (const link of links.data) {    
        console.log('Link:', link);
        if (link.type === 'link') {
            const li = await makeLink(link as LinkOptions);
            console.log('Link element:', li);
            list.appendChild(li);
        } else if (link.type === 'header') {
            const li = await makeHeader(link as HeaderOptions);
            list.appendChild(li);
        }
    }
})();