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

    // use an ID to ease the cleanup
    const id = randomUUID()

    // cleanup should a) remove the listener and b) clear the heartbeat, if applicable
    const cleanup = () => {
        delete listeners[id]

        if (intervalId) {
            clearInterval(intervalId)
        }
    }

    signal.addEventListener("abort", cleanup)

    return new ReadableStream({
        start(controller) {
            // start the heartbeat
            intervalId = setInterval(() => {
                controller.enqueue(": heartbeat.\n\n")
            }, 5000)

            // register the notify callback in the `listeners` lookup
            listeners[id] = () => controller.enqueue(getEventText())

            // call immediately to send the current state of all messages as initial message
            listeners[id]()
        },
        cancel() {
            cleanup()
        },
    })
}
