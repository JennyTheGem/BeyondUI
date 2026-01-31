import { content } from "./content.js";
/**
 * ─────────────────────────────────────────────────────────────
 * SIDEBAR CONTENT SYSTEM - HOW TO USE
 * ─────────────────────────────────────────────────────────────
 *
 * This sidebar system displays dynamic content panels that slide
 * open next to the sidebar buttons. Content is defined centrally
 * in `content.js` and referenced by key.
 *
 *
 *     !!! Requires GSAP !!!
 *
 * -------------------------------------------------------------
 * 0. REQUIRED HTML STRUCTURE
 * -------------------------------------------------------------
 *
 * The sidebar requires the following HTML structure:
 *
 * <div class="SidebarContainer">
 *   <div class="Sidebar">
 *     <button class="SidebarBtn" id="SidebarBtn">
 *       <img class="img_contain" src="IMG.png">
 *     </button>
 *     <button onclick="openContent('indexID')"></button>
 *   </div>
 *   <div class="sidebarContent"></div>
 * </div>
 *
 * - `.Sidebar` contains all sidebar buttons
 * - `#SidebarBtn` is the main toggle button
 * - `.sidebarContent` is where dynamic content is injected
 *
 * -------------------------------------------------------------
 * 1. DEFINING CONTENT (content.js)
 * -------------------------------------------------------------
 *
 * All sidebar content must be defined in `content.js`:
 *
 * export const content = {
 *   test: {
 *     content: `<div>My HTML</div>`,
 *     width: 500 | 'auto' | 'fit-content'
 *   }
 * }
 *
 * - `content`  → HTML string that will be injected into the sidebar
 * - `width`    → Target width of the sidebar content
 *                - Number = pixel width
 *                - 'auto' / 'fit-content' = measured dynamically
 *
 * -------------------------------------------------------------
 * 2. OPENING CONTENT (openContent)
 * -------------------------------------------------------------
 *
 * Use `openContent(index)` to open or toggle content.
 *
 * Intended usage (HTML):
 * <button onclick="openContent('test')"></button>
 *
 * Behavior:
 * - Opens the content if it is not currently open
 * - Closes the content if the same index is clicked again
 *
 * Example:
 * openContent('success');
 *
 * -------------------------------------------------------------
 * 1. SHOWING MESSAGES (sendMsg)
 * -------------------------------------------------------------
 *
 * `sendMsg(type)` temporarily replaces the current content with
 * a message (e.g. warn / success), then restores the previous
 * content automatically.
 *
 * Example:
 * sendMsg('warn');
 * sendMsg('success');
 *
 * Behavior:
 * - Closes the currently open content
 * - Displays the message content
 * - Automatically closes after a timeout
 * - Restores the previously open content
 *
 * -------------------------------------------------------------
 * 4. IMPORTANT NOTES
 * -------------------------------------------------------------
 *
 * - `openContent()` should NOT be called with an already-set
 *   `indexOpen` value (it handles state internally).
 *
 * - Message content is defined in `content.js` under keys like
 *   `warn`, `success`, `custom`.
 *
 * - Width animations are handled via GSAP and support
 *   dynamic measurement for 'auto' / 'fit-content'.
 *
 * -------------------------------------------------------------
 * This system is designed to be state-safe and animation-friendly.
 * When in doubt: define content in `content.js` and open it via
 * `openContent('key')`.
 * -------------------------------------------------------------
 */

const SidebarBtn = document.getElementById('SidebarBtn');
const Sidebar = document.querySelector('.Sidebar');
const sidebarButtons = Sidebar.querySelectorAll('button');
const sidebarContent = document.querySelector('.sidebarContent');

const btnHeight = parseInt(getComputedStyle(SidebarBtn).height);
Sidebar.style.height = `${btnHeight}px`

let sidebarOpen = false;
let contentOpen = false;

const SidebarOpenHeight = () => {
    let height = 0;
    sidebarButtons.forEach(btn => {
        height = height + btn.offsetHeight + parseInt(getComputedStyle(Sidebar).gap);
    })
    return height - parseInt(getComputedStyle(Sidebar).gap);
}

const gsapSettings = {
    duration: .3,
    ease: 'elastic.out(0.5,0.5)'
}

function closeSidebar() {
    sidebarOpen = false;
    let sidebarContentDisplay = sidebarContent.style.display;
    if(sidebarContentDisplay === 'flex') {
        setTimeout(() => {
            gsap.to(Sidebar, {
                ...gsapSettings,
                height: btnHeight,
            })
            closecontent()
        }, gsapSettings.duration * 1000)
    } else {
        gsap.to(Sidebar, {
            ...gsapSettings,
            height: btnHeight,
        })
    }

    closecontent()
    contentOpen = false;
}

function openSidebar() {
    sidebarOpen = true;
    gsap.to(Sidebar, {
        ...gsapSettings,
        height: SidebarOpenHeight(),
    })
}

SidebarBtn.addEventListener('click', () => {
    if(!sidebarOpen) {
        openSidebar()
    } else {
        closeSidebar()
    }
})

let indexOpen;

/**
 * Injects content into the sidebar and animates its width.
 *
 * The content object must come from `content.js` and contain:
 * - `content`: HTML string to be rendered
 * - `width`: Number (px) or `'auto'`
 *
 * If `width` is `'auto'`, the function calculates the required pixel width
 * before animating (since GSAP cannot animate `auto`).
 *
 * Example usage:
 * setSidebarContent(content.test);
 */
function setSidebarContent(contentID) {
    sidebarContent.innerHTML = contentID.content;
    const sidebarContentChildren = [...sidebarContent.children];
    if(!contentOpen) {
        sidebarContentChildren.forEach(child => {
            child.style.display = 'none';
            child.style.opacity = '0';
        })
    }

    sidebarContent.style.display = 'flex';
    let contentWidth;
    function getWidth() {
        if(contentID.width === 'fit-content' || contentID.width === 'auto') {
            const div = document.createElement('div');
            div.style.position = "absolute";
            div.style.visibility = "hidden";
            div.style.width = "fit-content";
            div.style.pointerEvents = "none";

            document.body.appendChild(div);
            div.innerHTML = contentID.content;
            const width = div.scrollWidth;

            document.body.removeChild(div);
            contentWidth = width;
        } else {
            contentWidth = contentID.width
        }
    }

    getWidth()

    const currentWidth = sidebarContent.offsetWidth;
    const ease = contentWidth > currentWidth ? gsapSettings.ease : "power.out";

    gsap.to(sidebarContent, {
        ease,
        duration: gsapSettings.duration,
        width: contentWidth,
    })
    setTimeout(() => {
        sidebarContentChildren.forEach(child => {
            child.style.display = '';
            gsap.to(child, {
                ...gsapSettings,
                opacity: 1,
            })
        })
    }, gsapSettings.duration * 1000 / 2)
}

/**
 * Opens or toggles sidebar content.
 *
 * If the provided index is already open, the content will be closed.
 * Otherwise, the corresponding content from `content.js` is loaded
 * and animated into view.
 *
 * Intended to be used directly from HTML:
 * <button onclick="openContent('test')"></button>
 * @param index - {string} Key of the content object defined in content.js
 * @param [force=false] - {boolean}  Forces the content to open even if it is already active
 */
function openContent(index, force = false) {
    if (!force && index === indexOpen) {
        closecontent();
        indexOpen = '';
    } else {
        setSidebarContent(content[index]);
        contentOpen = true;
        indexOpen = index;
    }
}

window.openContent = openContent;

/**
 * Closes the sidebar and any open content.
 *
 * Animates the sidebar height back to its collapsed state
 * and ensures content is fully closed.
 */
function closecontent() {
    [...sidebarContent.children].forEach(child => {
        child.style.display = 'none';
    })
    gsap.to(sidebarContent, {
        duration: gsapSettings.duration / 2,
        ease: 'power.out',
        width: 0,
    })
    setTimeout(() => {
        sidebarContent.style.display = 'none';
    }, gsapSettings.duration * 1000 / 2)
    contentOpen = false;
    indexOpen = '';
}

let preIndexOpen;

function openPrevious() {
    if (preIndexOpen) {
        openSidebar()
        setTimeout(() => {
            openContent(preIndexOpen, true);
        }, gsapSettings.duration * 1000)
    }
}

let sendMsgActive = false;

/**
 * Displays a temporary sidebar message (e.g. warn, success, custom)
 * and then restores the previously opened sidebar content.
 *
 * Workflow:
 * 1. Remembers the currently opened content (`indexOpen`)
 * 2. Closes the sidebar and disables the sidebar button
 * 3. Opens the message content defined in `content.js`
 * 4. Automatically closes the message after 3 seconds
 * 5. Reopens the sidebar and restores the previous content (if any)
 *
 * Intended to be used for short-lived notifications.
 *
 * Example:
 * sendMsg('warn');
 * sendMsg('success');
 *
 * @param type - {string} Key of the message content defined in `content.js`
 *                        (e.g. 'warn', 'success', 'custom')
 */
export function sendMsg(type) {
    if(!sendMsgActive) {
        sendMsgActive = true;
        SidebarBtn.classList.add('deactive');
        preIndexOpen = indexOpen;
        const showMessageForMs = 5000;
        let timeout = 0;
        if(sidebarOpen) {
            closeSidebar();
            timeout = gsapSettings.duration * 1000 * 3;
        }
        setTimeout( () => {
            sidebarContent.innerHTML = '';
            openContent(`${type}`);
            contentOpen = true;
            setTimeout( () => {
                if(contentOpen) {
                    closecontent();
                };
                setTimeout(() => {
                    openPrevious();
                }, gsapSettings.duration * 1000);
                SidebarBtn.classList.remove('deactive');
                sendMsgActive = false;
            }, showMessageForMs)
        }, timeout)
    }
}

window.sendMsg = sendMsg;

