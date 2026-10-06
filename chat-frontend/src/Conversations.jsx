import { useEffect, useState } from "react";

function Conversations() {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const getConversations = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/conversations",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setConversations(data.conversations);
            }
        };

        getConversations();
    }, []);

    return (
        <div>
            <h2>My Conversations</h2>

            {conversations.length === 0 ? (
                <p>No conversations found</p>
            ) : (
                conversations.map((conversation) => (
                    <div key={conversation._id}>
                        <p>
                            Conversation ID: {conversation._id}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Conversations;