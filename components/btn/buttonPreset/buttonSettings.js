
export const gsapSettings = {
    duration: {
        quickDuration: 0.1,
        defaultDuration: 0.3,
        slowDuration: 0.6,
    },
    ease: {
        elastic: 'elastic.out(0.5,0.5)',
        superElastic: 'elastic.out(2,0.4)',
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
            fill: {
                backgroundFill: {
                    active: false,
                    color: 'white',
                },
                rippleFill: {
                    active: true,
                    color: 'rgba(255,255,255,0.3)',
                    durationForFill: 1,
                },
            },
            magnetic: { // Follows mouse slightly while in the container
                active: true,
                strength: 0.05, // (0.05 very slight, 0.1 noticeable, < 0.2 very loose)
                magneticGsapSettings: {
                    durationSnapback: gsapSettings.duration.defaultDuration,
                    durationFollow: 0.3,
                    easeSnapback: gsapSettings.ease.superElastic,
                    easeFollow: 'power.out'
                }
            },
            filter: {
                active: false,
                brightness: '',
                opacity: '1',
            },
            hoverGsapProperties: {
                duration: gsapSettings.duration.defaultDuration,
                ease: gsapSettings.ease.elastic,
            },
            scale: {
                active: true,
                scaleXValue: 1.05,
                scaleYValue: 1.05,
            },
            sizing: {
                width: {
                    active: false,
                    widthValue: 1.05,
                    widthGsapSettings: {
                        ease: gsapSettings.ease.superElastic,
                        duration: gsapSettings.duration.defaultDuration
                    },
                },
                height: {
                    active: false,
                    heightValue: 1.05,
                    heightGsapSettings: {
                        ease: gsapSettings.ease.superElastic,
                        duration: gsapSettings.duration.defaultDuration
                    },
                },
            },
            tooltip: { // use: data-tooltip=""
                active: true,
                direction: 'top', // top, right, bottom, left
                delay: 1000, //ms
                gap: 8, // px
                tooltipGsapSettings: {
                    opacity: 1,
                    ease: 'back.out(1.2)',
                    duration: gsapSettings.duration.quickDuration,
                }
            },
            sound: { // WIP
                active: false,
                fileLocation: '',
                volume: 0.3,
            },
            text: {
                active: false,
                letterSpacing: '0.1em',
                letterSpacingReset: '0',
                textGsapSettings: {
                    ease: gsapSettings.ease.powerOut,
                    duration: gsapSettings.duration.defaultDuration
                },
                splitText: { // WIP
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
            scale: {
                active: true,
                duration: 1,
                scaleX: {
                    active: true,
                    scaleXValue: 0.95,
                },
                scaleY: {
                    active: true,
                    scaleYValue: 0.95,
                },
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