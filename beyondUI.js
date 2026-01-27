export function getMousePosition(container, type, callback) {
    function getPosition(e) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        callback({ x, y });
    }
    container.addEventListener(type, getPosition);
}