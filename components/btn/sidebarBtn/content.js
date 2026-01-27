export const content = {
    test: {
        content: `
            <div class="outfit">
                This is a spaceholder for btn 1
            </div>
        `,
        width: 500
    },
    test2: {
        content: `
            <div class="outfit">
                This is a spaceholder for btn 2
            </div>
        `,
        width: 'auto'
    },
    warn: {
        content: `
            <div class="messageContent outfit">
                <figure class="divider-Vertical" style="background-color: var(--color-warning);"></figure>
                <div class="message">
                    <span class="font-bold">
                        Warning!
                    </span>
                    <span>
                        Song deleted
                    </span>
                </div>
            </div>
        `,
        width: 'auto'
    },
    success: {
        content: `
            <div class="messageContent outfit">
                <figure class="divider-Vertical" style="background: var(--color-success)"></figure>
                <div class="message">
                    <span class="font-bold">
                        Successfull!
                    </span>
                    <span>
                        Song added
                    </span>
                </div>
            </div>
        `,
        width: 'auto'
    },
    custom: {
        content: `
            <div class="messageContent outfit">
                <figure class="divider-Vertical" style="background: var(--color-accent)"></figure>
                <div class="message">
                    <span class="font-bold">
                        THIS IS IMPORTANT!
                    </span>
                    <span>
                        RAHHH
                    </span>
                </div>
            </div>
        `,
        width: 'auto'
    },
}