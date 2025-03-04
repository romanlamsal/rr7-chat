# Server-sent-events powered RR7-Chat

I wanted to create a minimalistic chat application using react-router 7 and server sent events. Here we go.

## Setup

Clone the repo, `pnpm install`, then `pnpm dev`.

## Testing

Open your browser (`https://localhost:5173` by default), give yourself a name and then start chatting. After sending a 
message with `Enter` you should see a message pop up in the list below.

Open a second browser and start chatting with yourself.

## How it works

- the resource route at `/listen` returns a `text/event-stream` response, hence the route serves as an event source
- this resource route also automatically creates a `ReadableStream` 
  - that includes a heartbeat (see [routes/chat-room.server.ts](./app/routes/chat-room.server.ts)) running every 5 seconds
    - sidenote: I increased the `streamTimeout` from 5 to 10 seconds (in [entry.server.tsx](./app/entry.server.tsx))
  - registers a callback that can be called everytime a new message is added to the chatroom 
- everytime a message is sent to the server (POSTing to `/`) all active event-sourced `ReadableStream` instances are notified
