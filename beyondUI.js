import {buttonPreset} from "./components/btn/buttonPreset/buttonPreset.js";

const componentsConfig = {
    components: {
        beyondUi_Default: {
            default: { // required for most components
                active: true,
                css_path: 'beyondUI.css',
                js_path: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js',
            },
            imgSearch: {
                active: true,
            }
        },
        btn: {
            buttonPreset: {
                active: true,
                js_path: '',
                css_path: 'components/btn/buttonPreset/buttonPreset.css',
            },
            sidebarBtn: {
                active: true,
                js_path: 'components/btn/sidebarBtn/sidebarBtn.js',
                css_path: 'components/btn/sidebarBtn/sidebarBtn.css',
                module: true,
            }
        },
        nav: {
            top_navbar: {
                active: true,
                js_path: 'components/nav/top-navbar/top-navbar.js',
                css_path: 'components/nav/top-navbar/top-navbar.css',
            }
        }
    }
}

if(componentsConfig.components.beyondUi_Default.imgSearch.active) {
    document.addEventListener('DOMContentLoaded', () => {
        applyIconifyImages()
    })
}

// add scripts and styles
function addEl({ typeString, relString, hrefString, srcString, typeScript }) {
    return new Promise((resolve, reject) => {
        const el = document.createElement(typeString);

        if (typeString === 'link') {
            if (relString) el.rel = relString;
            if (hrefString) el.href = hrefString;
            el.onload = resolve;
            el.onerror = reject;
        }

        if (typeString === 'script') {
            if (srcString) el.src = srcString;
            if (typeScript) el.type = typeScript;
            el.onload = resolve;
            el.onerror = reject;
        }

        document.body.appendChild(el);
    });
}


async function loadBeyondUI() {
    const components = componentsConfig.components;

    const defaultComp = components.beyondUi_Default.default;

    if (defaultComp.active) {
        if (defaultComp.css_path) {
            await addEl({
                typeString: 'link',
                relString: 'stylesheet',
                hrefString: defaultComp.css_path
            });
        }

        if (defaultComp.js_path) {
            await addEl({
                typeString: 'script',
                srcString: defaultComp.js_path,
            });
        }
    }

    for (const groupKey in components) {
        const group = components[groupKey];

        for (const componentKey in group) {
            if (groupKey === 'beyondUi_Default' && componentKey === 'default') continue;

            const component = group[componentKey];
            if (!component.active) continue;

            if (component.css_path) {
                await addEl({
                    typeString: 'link',
                    relString: 'stylesheet',
                    hrefString: component.css_path
                });
            }

            if (component.js_path) {
                const isModule = component.module || false;
                await addEl({
                    typeString: 'script',
                    srcString: component.js_path,
                    typeScript: isModule ? 'module' : undefined
                });
            }
        }
    }
}

loadBeyondUI();

export function getMousePosition(container, type, callback) {
    function getPosition(e) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        callback({ x, y });
    }
    container.addEventListener(type, getPosition);
}

export function beyondAnimate({
    container,
    eventOn,
    eventOff,
    presetSettings = {},
    animation = {},
    resetValue = ""
}) {
    container.addEventListener(eventOn, () => {
            gsap.to(container, {
                ...presetSettings,
                ...animation
            })
        }
    )

    container.addEventListener(eventOff, () => {
        const newAnimation = Object.fromEntries(
            Object.keys(animation).map(key => [key, `${resetValue}`])
        );
        gsap.to(container, {
            ...presetSettings,
            ...newAnimation
        })
    })
}

/**
 * Adds an animated mouse-fill effect to a button.
 * A circle is created at the mouse position, grows to cover the button,
 * the circle follows the mouse movement, and disappears at the last pos of the mouse inside the button
 * when the mouse leaves the button.
 *
 * @param container - {HTMLElement} The DOM element (button) on which the effect should appear.
 * @param preset
 */
export function rippleFill(container, preset) {
    getMousePosition(container, 'mouseenter', (pos) => {
        const x = pos.x;
        const y = pos.y;

        const size = 20;
        const fillDiv = document.createElement('div');
        container.appendChild(fillDiv);
        fillDiv.classList.add('fillDiv');

        fillDiv.style.background = preset.background;
        fillDiv.style.width = size + 'px';
        fillDiv.style.height = size + 'px';
        fillDiv.style.position = 'absolute';
        fillDiv.style.borderRadius = '50%';
        fillDiv.style.left = (x - size / 2) + 'px';
        fillDiv.style.top = (y - size / 2) + 'px';

        const distances = [
            Math.hypot(x, y),
            Math.hypot(x - container.offsetWidth, y),
            Math.hypot(x, y - container.offsetHeight),
            Math.hypot(x - container.offsetWidth, y - container.offsetHeight)
        ];
        const maxDistance = Math.max(...distances);

        gsap.to(fillDiv, {
            scale: maxDistance / size * 4,
            duration: preset.duration,
            ease: preset.ease,
        });

        getMousePosition(container, 'mousemove', (pos) => {
            fillDiv.style.left = (pos.x - size / 2) + 'px';
            fillDiv.style.top = (pos.y - size / 2) + 'px';
        });

        container.addEventListener('mouseleave', () => {
            gsap.to(fillDiv, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                onComplete: () => fillDiv.remove()
            });
        }, { once: true });
    });
}

export function magnetic(container, preset) {
    const strength = preset.strength;

    getMousePosition(container, 'pointermove', (pos) => {
        const x = (pos.x - container.offsetWidth / 2) * strength;
        const y = (pos.y - container.offsetHeight / 2) * strength;

        gsap.to(container, {
            x,
            y,
            duration: preset.durationFollow,
            ease: preset.easeFollow
        });
    });

    container.addEventListener('mouseleave', () => {
        gsap.to(container, {
            x: 0,
            y: 0,
            duration: preset.durationSnapback,
            ease: preset.easeSnapback
        })
    })
}

buttonPreset()

const processedIconImgs = new WeakSet();

/**
 * applyIconifyImages
 * ------------------
 * Replaces <img data-img="..."> elements with Iconify SVG icons.
 *
 * - Can be called multiple times safely
 * - Each <img> is processed only once
 * - Supports dynamically added DOM content
 * - Prevents memory leaks using a WeakSet
 *
 * HOW IT WORKS
 * ------------
 * - Reads the icon name from `data-img`
 * - Optionally reads color from `data-color` (defaults to white)
 * - Fetches the SVG from the Iconify API
 * - Applies a fallback icon if loading fails
 *
 * STATE HANDLING
 * --------------
 * A WeakSet is used to remember which <img> elements were already processed.
 * WeakSet holds *weak references*, meaning:
 * - Removed DOM elements are automatically garbage-collected
 * - No manual cleanup is required
 * - No memory leaks in SPAs or dynamic UIs
 *
 * USAGE
 * -----
 * applyIconifyImages();                // Initial load
 * applyIconifyImages(containerEl);     // After dynamic DOM updates
 *
 * HTML EXAMPLE
 * ------------
 * <img data-img="mdi:home" data-color="#ffffff">
 * <img data-img="simple-icons:github">
 *
 * REQUIREMENTS
 * ------------
 * - componentsConfig.components.beyondUi_Default.imgSearch.active === true
 * - Icon names must follow Iconify prefixes (mdi:, fa:, lucide:, etc.)
 *
 * Icon source:
 * https://icon-sets.iconify.design/
 *
 * ICONIFY ICON PREFIXES
 * ---------------------
 * Material Design Icons        - mdi:
 * Material Symbols (Google)    - material-symbols:
 * Font Awesome                 - fa:
 * Simple Icons (brands only)   - simple-icons:
 *
 * OTHER POPULAR SETS
 * ------------------
 * tabler:    Clean, modern UI
 * lucide:    Minimal, outline icons
 * ph:        Phosphor icons
 * heroicons: Tailwind-style icons
 * ion:       Ionic icons
 * bx:        Boxicons
 * carbon:    IBM Carbon Design
 * fluent:    Microsoft Fluent UI
 *
 * EXAMPLES
 * --------
 * mdi:home
 * material-symbols:home
 * material-symbols:home-outline
 * material-symbols:home-rounded
 * material-symbols:home-sharp
 * fa:user
 * simple-icons:github
 *
 * <img data-img="mdi:home" data-color="#ffffff">
 */
export function applyIconifyImages(root = document) {
    if (!componentsConfig.components.beyondUi_Default.imgSearch.active) return;

    root.querySelectorAll('img[data-img]').forEach(img => {
        if (processedIconImgs.has(img)) return;

        let icon = img.dataset.img.toLowerCase();
        const color = img.dataset.color || '#ffffff';

        img.src = `https://api.iconify.design/${icon}.svg?color=${encodeURIComponent(color)}`;
        img.onerror = () => {
            img.src = 'https://api.iconify.design/mdi:alert.svg?color=%23ff0000';
        };

        processedIconImgs.add(img);
    });
}


// Global event listener for deactive class
document.addEventListener(
    'click',
    (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        if (btn.classList.contains('deactive')) {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log('Blocked click on deactive button');
        }
    },
    true
);