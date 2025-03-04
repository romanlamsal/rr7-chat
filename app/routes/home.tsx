import { useEffect, useState } from "react"
import { Form } from "react-router"
import { type Message, addMessage } from "~/routes/chat-room.server"
import type { Route } from "./+types/home"

export const action = async ({ request }: Route.ActionArgs) => {
    const formData = await request.formData()
    const userId = String(formData.get("userId"))
    const message = String(formData.get("message"))
    const timestamp = new Date()

    if (userId && message) {
        addMessage({ user: userId, message, timestamp })
    }

    return null
}

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        const eventSource = new EventSource("/listen")
        eventSource.addEventListener("message", ev => {
            setMessages(JSON.parse(ev.data))
        })
    }, [])

    return (
        <div className={"grid grid-rows-[auto_1fr] max-w-screen-md mx-auto h-screen p-4 gap-y-4"}>
            <Form navigate={false} method={"POST"}>
                <input placeholder={"Username"} name={"userId"} className={"border-white border w-full"} />
                <input
                    placeholder={"Message - press enter to send"}
                    name={"message"}
                    className={"border-white border w-full"}
                    onKeyUp={ev => {
                        if (ev.key === "Enter") {
                            ev.currentTarget.value = ""
                        }
                    }}
                />
                <input type={"submit"} />
            </Form>
            <ul className={"border border-white overflow-auto"}>
                {messages.map((message, idx) => (
                    <li key={idx}>
                        {message.user}: {message.message}
                    </li>
                ))}
            </ul>
        </div>
    )
}
