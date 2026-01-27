import { buttonPresets, gsapSettings } from './buttonSettings.js';
import { getMousePosition, beyondAnimate } from '../../../beyondUI.js';

const initializedButtons = new Set();

function applyPreset(btn, preset) {
    btn.classList.add(preset.classname)
}


/**
 * Adds an animated mouse-fill effect to a button.
 * A circle is created at the mouse position, grows to cover the button,
 * the circle follows the mouse movement, and disappears at the last pos of the mouse inside the button
 * when the mouse leaves the button.
 *
 * @param btn - {HTMLElement} The DOM element (button) on which the effect should appear.
 * @param preset
 */
function rippleFill(btn, preset) {
    getMousePosition(btn, 'mouseenter', (pos) => {
        const x = pos.x;
        const y = pos.y;

        const size = 20;
        const fillDiv = document.createElement('div');
        btn.appendChild(fillDiv);
        fillDiv.classList.add('fillDiv');

        fillDiv.style.background = preset.hover.fill.rippleFill.color;
        fillDiv.style.width = size + 'px';
        fillDiv.style.height = size + 'px';
        fillDiv.style.position = 'absolute';
        fillDiv.style.borderRadius = '50%';
        fillDiv.style.left = (x - size / 2) + 'px';
        fillDiv.style.top = (y - size / 2) + 'px';

        const distances = [
            Math.hypot(x, y),
            Math.hypot(x - btn.offsetWidth, y),
            Math.hypot(x, y - btn.offsetHeight),
            Math.hypot(x - btn.offsetWidth, y - btn.offsetHeight)
        ];
        const maxDistance = Math.max(...distances);

        gsap.to(fillDiv, {
            scale: maxDistance / size * 3,
            duration: gsapSettings.duration.slowDuration,
            ease: gsapSettings.ease.powerIn,
        });

        getMousePosition(btn, 'mousemove', (pos) => {
            fillDiv.style.left = (pos.x - size / 2) + 'px';
            fillDiv.style.top = (pos.y - size / 2) + 'px';
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(fillDiv, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                onComplete: () => fillDiv.remove()
            });
        }, { once: true });
    });
}

function hover(btn, preset) {
    if(btn.classList.contains('deactive')) return;
    if(preset.hover.fill.rippleFill.active) rippleFill(btn, preset);

    const presetSettings = {
        ease: preset.hover.hoverGsapProperties.ease,
        duration: preset.hover.hoverGsapProperties.duration
    }

    const pointerEventHover = {
        container: btn,
        eventOn: 'pointerenter',
        eventOff: 'pointerout',
        presetSettings: presetSettings,
    }

    if(preset.hover.filter.active) {
        const filterPreset = {
            filter: preset.hover.filter.brightness,
            opacity: preset.hover.filter.opacity
        }
        beyondAnimate({
            ...pointerEventHover,
            animation: filterPreset,
            resetValue: ''})
    }
    if(preset.hover.fill.backgroundFill.active) {
        beyondAnimate({
            ...pointerEventHover,
            animation: {
                background: preset.hover.fill.backgroundFill.color
            },
        })
    }
    if(preset.hover.scale.active) {
        beyondAnimate({
            ...pointerEventHover,
            animation: {
                scale: preset.hover.scale.scaleValue,
            },
            resetValue: 1,
        })
    }
}

function click(btn, preset) {
    if (btn.classList.contains('deactive')) {
        const block = e => e.preventDefault();
        btn.setAttribute('aria-disabled', 'true');
        btn.tabIndex = -1;

        btn.addEventListener('click', block);
        btn.addEventListener('keydown', block);
        return;
    }

    const press = () => {
        gsap.to(btn, {
            ...preset.click.clickGsapProperties
        });
    };

    const release = () => {
        gsap.to(btn, {
            ...preset.click.clickGsapProperties,
            scale: preset.hover.hoverGsapProperties.scale,
        });
    };

    btn.addEventListener('pointerdown', press);
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointerleave', release);
    btn.addEventListener('pointercancel', release);

    btn.addEventListener('keydown', e => {
        if (e.key === 'Enter') press();
    });

    btn.addEventListener('keyup', e => {
        if (e.key === 'Enter') release();
    });

}

function initButtons() {
    const buttons = document.querySelectorAll('.buttonPreset');

    buttons.forEach(btn => {
        if(initializedButtons.has(btn)) return;

        const presetName = btn.dataset.preset;
        const preset = buttonPresets[presetName];

        applyPreset(btn, preset);

        if(preset.hover.active) hover(btn, preset);
        if(preset.click.active) click(btn, preset);

        initializedButtons.add(btn);
    });
}

document.addEventListener('DOMContentLoaded', (initButtons))