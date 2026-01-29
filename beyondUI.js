import {buttonPreset} from "./components/btn/buttonPreset/buttonPreset.js";

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
