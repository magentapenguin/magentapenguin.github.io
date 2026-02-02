import links from './links.json';
import BootstrapIcon from './bsicons';
import Tooltip from './tooltip';

const libraries: Record<string, {
    name: string;
    url: string;
    icon: string;
}> = {
    bootstrap: {
        name: 'Bootstrap',
        url: 'https://getbootstrap.com/',
        icon: 'bootstrap.png',
    },
    tailwindcss: {
        name: 'Tailwind CSS',
        url: 'https://tailwindcss.com/',
        icon: 'tailwind.png',
    },
    vite: {
        name: 'Vite',
        url: 'https://vitejs.dev/',
        icon: 'vite.png',
    },
    shoelace: {
        name: 'Shoelace',
        url: 'https://shoelace.style/',
        icon: 'shoelace.png',
    },
    partykit: {
        name: 'Partykit',
        url: 'https://partykit.dev/',
        icon: 'partykit.png',
    },
    kaplay: {
        name: 'Kaplay',
        url: 'https://kaplayjs.com/',
        icon: 'kaplay.png',
    },
    jquery: {
        name: 'jQuery',
        url: 'https://jquery.com/',
        icon: 'jquery.png',
    },
    typescript: {
        name: 'TypeScript',
        url: 'https://www.typescriptlang.org/',
        icon: 'ts.png',
    },
    javascript: {
        name: 'JavaScript',
        url: 'https://www.javascript.com/',
        icon: 'js.png',
    },
    python: {
        name: 'Python',
        url: 'https://www.python.org/',
        icon: 'python.png',
    }
}

interface LinkOptions {
    type?: 'link';
    name: string;
    url: string;
    icon?: string;
    description?: string;
    libraries?: string[];
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
    icon.onerror = () => {
        const newIcon = new BootstrapIcon();
        newIcon.setAttribute('name', 'globe');
        newIcon.setAttribute('size', '1em');
        icon.replaceWith(newIcon);
    }
    try {
        icon.src = opts.icon ?? 'null';
    } catch (e) {
        console.error('Error fetching icon:', e);
        const newIcon = new BootstrapIcon();
        newIcon.setAttribute('name', 'globe');
        newIcon.setAttribute('size', '1em');
        icon.replaceWith(newIcon);
    }
    icon.crossOrigin = 'anonymous';
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
    li.classList.add("flex", "flex-row", "gap-2", "items-center", "ps-2");
    li.appendChild(a);
    if (opts.description) {
        const desc = document.createElement('p');
        desc.innerText = opts.description;
        desc.classList.add('text-gray-500', 'text-sm');
        li.appendChild(desc);
    }
    if (opts.libraries) {
        for (const lib of opts.libraries.sort()) {
            const libOpts = libraries[lib];
            console.log('Library options:', libOpts);
            if (libOpts) {
                const libwrap = document.createElement('a');
                const libicon = document.createElement('img');
                libicon.src = '/icons/'+libOpts.icon;
                libicon.alt = libOpts.name + ' icon';
                libicon.classList.add('favicon');
                libwrap.href = libOpts.url;
                libwrap.target = '_blank';
                libwrap.appendChild(libicon);
                new Tooltip(libwrap, 'Made with ' + libOpts.name);
                li.appendChild(libwrap);
            }
        }
    }
    return li;
}
async function makeHeader(opts: HeaderOptions) {
    const li = document.createElement('li');
    if (opts.icon) {
        const icon = document.createElement('img');
        icon.src = opts.icon;
        icon.onerror = () => {
            icon.remove();
        }
    }
    const span = document.createElement('span');
    span.innerText = opts.name;
    span.classList.add('text-2xl', 'font-bold');
    li.appendChild(span);
    li.classList.add("flex", "flex-row", "gap-2", "items-bottom");
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
