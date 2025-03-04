import { randomUUID } from "node:crypto"

export type Message = { user: string; message: string; timestamp: Date }

export const messages: Message[] = []

function getEventText() {
    return `event: message\ndata: ${JSON.stringify(messages)}\n\n`
}

const listeners: Record<string, () => void> = {}

export const addMessage = (message: Message) => {
    messages.push(message)

    for (const notifyFn of Object.values(listeners)) {
        notifyFn()
    }

    return messages
}

export const createChatStream = (signal: AbortSignal) => {
    let intervalId: ReturnType<typeof setInterval>

    const id = randomUUID()

    const cleanup = () => {
        delete listeners[id]

        if (intervalId) {
            clearInterval(intervalId)
        }
    }

    signal.addEventListener("abort", cleanup)

    return new ReadableStream({
        start(controller) {
            intervalId = setInterval(() => {
                controller.enqueue(": heartbeat.\n\n")
            }, 5000)

            listeners[id] = () => controller.enqueue(getEventText())
            listeners[id]()
        },
        cancel() {
            cleanup()
        },
    })
}
