import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function Chat() {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");

    const conversationId = localStorage.getItem("conversationId");
    const chatUserName = localStorage.getItem("chatUserName");

    const currentUserId = (() => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return null;
            }

            const payload = JSON.parse(atob(token.split(".")[1]));

            return payload.userId;
        } catch (error) {
            return null;
        }
    })();

    // Socket.IO connection
    useEffect(() => {
        if (!conversationId) {
            return;
        }

        const socket = io("http://localhost:5000");

        socket.emit("joinConversation", conversationId);

        socket.on("receiveMessage", (data) => {
            setMessages((previousMessages) => [
                ...previousMessages,
                data.message
            ]);
        });

        return () => {
            socket.disconnect();
        };
    }, [conversationId]);

    // Previous messages load karna
    useEffect(() => {
        if (!conversationId) {
            return;
        }

        const getMessages = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/messages/${conversationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setMessages(data.messages);
            }
        };

        getMessages();
    }, [conversationId]);

    // Message send karna
    const sendMessage = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            return;
        }

        if (!conversationId) {
            alert("Please start a chat first");
            return;
        }

        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:5000/messages",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    conversationId,
                    content
                })
            }
        );

        const data = await response.json();

        if (data.success) {
            const socket = io("http://localhost:5000");

            socket.emit("joinConversation", conversationId);

            socket.emit("sendMessage", {
                conversationId,
                message: data.data
            });

            setContent("");

            setTimeout(() => {
                socket.disconnect();
            }, 1000);
        }
    };

    return (
        <div
            style={{
                width: "400px",
                margin: "20px auto",
                border: "1px solid #ccc",
                padding: "15px"
            }}
        >
            <h2>
                Chat with {chatUserName || "User"}
            </h2>

            {!conversationId && (
                <p>Please start a chat first.</p>
            )}

            <div
                style={{
                    minHeight: "250px",
                    border: "1px solid #ddd",
                    padding: "10px",
                    marginBottom: "10px"
                }}
            >
                {messages.map((message) => {
                    const isMyMessage =
                        message.sender === currentUserId ||
                        message.sender?._id === currentUserId;

                    return (
                        <div
                            key={message._id}
                            style={{
                                textAlign: isMyMessage
                                    ? "right"
                                    : "left",
                                marginBottom: "10px"
                            }}
                        >
                            <span
                                style={{
                                    display: "inline-block",
                                    padding: "8px 12px",
                                    border: "1px solid #ccc"
                                }}
                            >
                                {message.content}
                            </span>
                        </div>
                    );
                })}
            </div>

            {conversationId && (
                <form onSubmit={sendMessage}>
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <button type="submit">
                        Send
                    </button>
                </form>
            )}
        </div>
    );
}

export default Chat;