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