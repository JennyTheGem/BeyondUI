import { buttonPresets } from './buttonSettings.js';
import { getMousePosition, beyondAnimate, rippleFill, magnetic } from '../../../beyondUI.js';

export function buttonPreset() {

    const initializedButtons = new Set();

    function applyPreset(btn, preset) {
        btn.classList.add(preset.classname)
    }

    function initButtons() {
        const buttons = document.querySelectorAll('.beyondPreset');

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

        if(preset.hover.text.active) {
            beyondAnimate({
                container: btn,
                eventOn: 'pointerover',
                eventOff: 'pointerleave',
                presetSettings: {
                    ease: preset.hover.text.textGsapSettings.ease,
                    duration: preset.hover.text.textGsapSettings.duration
                },
                animation: {
                    letterSpacing: preset.hover.text.letterSpacing
                },
                resetValue: preset.hover.text.letterSpacingReset,
            })
        }

        function rectCenterX(el) {
            const r = el.getBoundingClientRect();
            return r.left + r.width / 2;
        }
        function rectCenterY(el) {
            const r = el.getBoundingClientRect();
            return r.top + r.height / 2;
        }

        if (preset.hover.tooltip.active) {
            let tooltip = null;
            let isHovered = false;
            const direction = preset.hover.tooltip.direction;
            const delayMs = preset.hover.tooltip.delay;

            const magnetStrength = preset.hover.magnetic.active ? (preset.hover.magnetic.strength / 5) : 0;

            const onPointerMove = (e) => {
                if (!tooltip) return;

                const rect = btn.getBoundingClientRect();
                const tRect = tooltip.getBoundingClientRect();
                let left = 0;
                let top = 0;
                const gap = preset.hover.tooltip.gap;

                switch (direction) {
                    case "top":
                        top = rect.top - tRect.height - gap;
                        left = rect.left + rect.width / 2 - tRect.width / 2;
                        break;
                    case "bottom":
                        top = rect.bottom + gap;
                        left = rect.left + rect.width / 2 - tRect.width / 2;
                        break;
                    case "left":
                        top = rect.top + rect.height / 2 - tRect.height / 2;
                        left = rect.left - tRect.width - gap;
                        break;
                    case "right":
                        top = rect.top + rect.height / 2 - tRect.height / 2;
                        left = rect.right + gap;
                        break;
                }

                left += (e.clientX - (rect.left + rect.width / 2)) * magnetStrength;
                top += (e.clientY - (rect.top + rect.height / 2)) * magnetStrength;

                tooltip.style.left = `${left + window.scrollX}px`;
                tooltip.style.top = `${top + window.scrollY}px`;
            };

            btn.addEventListener('pointerover', () => {
                isHovered = true;

                setTimeout(() => {
                    if (!isHovered || tooltip) return;

                    tooltip = document.createElement('span');
                    tooltip.className = `tooltip tooltip-${direction}`;
                    tooltip.textContent = btn.dataset.tooltip;
                    document.body.appendChild(tooltip);

                    // initial positioning
                    onPointerMove({ clientX: rectCenterX(btn), clientY: rectCenterY(btn) });

                    gsap.fromTo(
                        tooltip,
                        {
                            opacity: 0,
                            scale: 0.8,
                            y: direction === 'top' ? 10 : -10
                        },
                        {
                            duration: preset.hover.tooltip.tooltipGsapSettings.duration,
                            ease: preset.hover.tooltip.tooltipGsapSettings.ease,
                            opacity: preset.hover.tooltip.tooltipGsapSettings.opacity,
                            scale: 1,
                            y: 0
                        }
                    );

                    if (preset.hover.magnetic.active) {
                        btn.addEventListener('pointermove', onPointerMove);
                    }
                }, delayMs);
            });

            btn.addEventListener('pointerout', () => {
                isHovered = false;

                if (!tooltip) return;

                if (preset.hover.magnetic.active) {
                    btn.removeEventListener('pointermove', onPointerMove);
                }

                gsap.to(tooltip, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.2,
                    ease: "power2.in",
                    onComplete: () => {
                        tooltip.remove();
                        tooltip = null;
                    }
                });
            });
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
                    scaleX: preset.hover.scale.scaleX.scaleXValue,
                    scaleY: preset.hover.scale.scaleY.scaleYValue,
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