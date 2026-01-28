import { buttonPresets } from './buttonSettings.js';
import { getMousePosition, beyondAnimate, rippleFill, magnetic } from '../../../beyondUI.js';

export function buttonPreset() {

    const initializedButtons = new Set();

    function applyPreset(btn, preset) {
        btn.classList.add(preset.classname)
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

    function hover(btn, preset) {
        if(btn.classList.contains('deactive')) return;
        if(preset.hover.fill.rippleFill.active) {
            const rippleFillPreset = {
                background: preset.hover.fill.rippleFill.color,
                duration: preset.hover.fill.rippleFill.durationForFill,
                ease: 'power.in',
            }
            rippleFill(btn, rippleFillPreset);
        }

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

        function sizing(dimension) {
            const rect = btn.getBoundingClientRect();
            btn.style[dimension] = `${rect[dimension]}px`;

            beyondAnimate({
                container: btn,
                eventOn: 'pointerenter',
                eventOff: 'pointerout',
                presetSettings: {
                    ease: preset.hover.sizing[dimension][`${dimension}GsapSettings`].ease,
                    duration: preset.hover.sizing[dimension][`${dimension}GsapSettings`].duration
                },
                animation: {
                    [dimension]: rect[dimension] * preset.hover.sizing[dimension][`${dimension}Value`]
                },
                resetValue: rect[dimension]
            });
        }

        if(preset.hover.sizing.width.active) sizing('width');
        if(preset.hover.sizing.height.active) sizing('height');
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

        if(preset.hover.magnetic.active) {
            const magneticPreset = {
                durationFollow: preset.hover.magnetic.magneticGsapSettings.durationFollow,
                easeFollow: preset.hover.magnetic.magneticGsapSettings.easeFollow,
                durationSnapback: preset.hover.magnetic.magneticGsapSettings.durationSnapback,
                easeSnapback: preset.hover.magnetic.magneticGsapSettings.easeSnapback,
                strength: preset.hover.magnetic.strength
            }
            magnetic(btn, magneticPreset)
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
                scale: preset.hover.scale.scaleValue,
            });
        };

        btn.addEventListener('pointerdown', press);
        btn.addEventListener('pointerup', release);
        btn.addEventListener('pointercancel', release);

        btn.addEventListener('keydown', e => {
            if (e.key === 'Enter') press();
        });

        btn.addEventListener('keyup', e => {
            if (e.key === 'Enter') release();
        });

    }

    document.addEventListener('DOMContentLoaded', () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'components/btn/buttonPreset/buttonPreset.css';

        document.head.appendChild(link);
        initButtons()
    });
}