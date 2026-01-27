
export const gsapSettings = {
    duration: {
        quickDuration: 0.1,
        defaultDuration: 0.3,
        slowDuration: 0.6,
    },
    ease: {
        elastic: 'elastic.out(0.5,0.5)',
        powerOut: 'power.out',
        powerIn: 'power.in',
    },
    scale: {
        defaultScale: '1.05',
        mediumScale: '1.1',
        bigScale: '1.2',
        biggerScale: '1.4',
    },
    scaleNegative: {
        defaultScale: '0.95',
        mediumScale: '0.9',
        bigScale: '0.8',
        biggerScale: '0.4',
    }
}

export const buttonPresets = {
    textButton: {
        classname: 'textButton', // classname for more styling options in CSS
        hover: {
            active: true,
            delay: 0, // WIP
            fill: {
                backgroundFill: {
                    active: false,
                    color: '',
                },
                rippleFill: {
                    active: true,
                    color: 'rgba(255,255,255,0.3)',
                },
            },
            magnetic: { // WIP (Button slightly follows mouse)
                active: false,
                strength: 0.2,
            },
            filter: {
                active: true,
                brightness: '',
                opacity: '1',
            },
            hoverGsapProperties: {
                scale: 1.4,
                duration: gsapSettings.duration.defaultDuration,
                ease: gsapSettings.ease.elastic,
            },
            tooltip: { // WIP
                active: false,
                direction: '', // top, right, bottom, left
                description: '',
            },
            sound: { // WIP
                active: false,
                name: 'hover_soft',
                volume: 0.3,
            },
            text: { // WIP
                active: false,
                letterSpacing: '0.1em',
                y: -2,
                splitText: {
                    active: false
                }
            },
            border: { // WIP
                active: false,
                color: '#fff',
                width: '2px',
                style: 'solid',
            }
        },
        click: {
            active: true,
            color: '',
            debounce: 200, // WIP
            clickGsapProperties: {
                scale: gsapSettings.scaleNegative.defaultScale,
                duration: gsapSettings.duration.quickDuration,
                ease: gsapSettings.ease.elastic,
            },
            ripple: { // WIP
                active: false,
                color: 'rgba(255,255,255,0.4)',
                duration: 0.4,
            },
            sound: { // WIP
                active: false,
                name: 'click_soft',
                volume: 0.4,
            },
            spanLock: { // WIP
                active: false,
                duration: 500, // ms
            },
            toggle: { // WIP
                active: false,
                className: 'active',
            },
            feedback: { // WIP
                active: false,
                successColor: 'rgba(0,255,0,0.3)',
                errorColor: 'rgba(255,0,0,0.3)',
            },
        },
        accessibility: { // WIP
            respectReducedMotion: true
        },
        state: { // WIP
            disabled: { // WIP
                active: false,
                disabledReason: '',
            },
            loading: { // WIP
                active: false,
                text: 'Loading...',
                lockInteraction: true,
            }
        },
        permissions: { // WIP
            required: ['admin'],
        },
        hasIcon: false, // WIP
        variant: '', // WIP (primary, danger, ghost, icon)
    },
}

// https://mui.com/material-ui/react-button/
// https://codetheorem.co/blogs/types-of-ui-buttons/#toc-3-text-button