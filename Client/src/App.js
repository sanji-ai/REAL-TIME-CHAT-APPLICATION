import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:5000');
        setSocket(newSocket);

        newSocket.onopen = () => {
            console.log('WebSocket connection established');
        };

        newSocket.onmessage = (event) => {
            // Ensure the message is received as a string
            const message = event.data.toString();
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        newSocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            newSocket.close();
        };
    }, []);

    const sendMessage = () => {
        if (input.trim() && socket && 
            socket.readyState === WebSocket.OPEN) {
            socket.send(input);
            setInput('');
        }
    };

    return (
        <div className="App">
            <h1>Chat Application </h1>
            <div className="chat-window">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        {message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                placeholder='Write Here!!'
                onChange={(e) => setInput(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default App;
