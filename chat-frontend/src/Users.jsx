import { useEffect, useState } from "react";

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "https://brl-chat-application.onrender.com/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setUsers(data.users);
            }
        };

        getUsers();
    }, []);

    const startChat = async (participantId) => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            "https://brl-chat-application.onrender.com/conversations",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    participantId
                })
            }
        );

        const data = await response.json();

        if (data.success) {
            alert("Conversation created successfully");

            localStorage.setItem(
                "conversationId",
                data.conversation._id
            );
            localStorage.setItem(
                "chatUserName",
                users.find((user) => user._id === participantId).name
            );

            console.log(
                "Conversation ID:",
                data.conversation._id
            );
        } else {
            alert(data.message);
        }
    };

    return (
        <div>
            <h2>Users</h2>

            {users.map((user) => (
                <div key={user._id}>
                    <p>
                        {user.name} - {user.email}
                    </p>

                    <button
                        onClick={() => startChat(user._id)}
                    >
                        Start Chat
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Users;