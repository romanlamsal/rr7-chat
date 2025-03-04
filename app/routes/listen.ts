import { createChatStream } from "~/routes/chat-room.server"
import type { Route } from "./+types/listen"

export const loader = ({ request }: Route.LoaderArgs) =>
    new Response(createChatStream(request.signal), {
        headers: {
            Connection: "keep-alive",
            "Content-Type": "text/event-stream",
        },
    })
