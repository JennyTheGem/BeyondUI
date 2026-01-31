/* Usage:
    <nav class="top-navbar">
        <button> Home </button>
        <button> Projects </button>
        <button> Gallary </button>
        <button> About </button>
        <div class="navbarButtonSelector"></div>
    </nav>

    !!! Requires GSAP !!!
*/

const topNavbar = document.querySelector('.top-navbar');
const topNavbarButtons = Array.from(topNavbar.children).filter(
    child => child.tagName === 'BUTTON'
);
const navbarButtonSelector = document.querySelector('.navbarButtonSelector');
const selectorPadding = 10;

/**
 * Sets the button selector
 * @param parent parents class
 * @param button button of parent
 * @param selector div that moves to active btn
 */
function setButtonSelector(parent, button, selector) {
    const buttonRect = button.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    const selectorWidth = buttonRect.width + selectorPadding;
    const selectorHeight = buttonRect.height + selectorPadding;

    const targetLeft =
        (buttonRect.left - parentRect.left) +
        (buttonRect.width / 2) -
        (selectorWidth / 2);

    gsap.to(selector, {
        left: targetLeft,
        width: selectorWidth,
        height: selectorHeight,
        ease: "elastic.out(0.5, 0.5)",
        duration: 0.5,
    });
}

topNavbarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setButtonSelector(topNavbar, btn, navbarButtonSelector);
    })
})

setButtonSelector(topNavbar, topNavbarButtons[0], navbarButtonSelector);