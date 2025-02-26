import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import axiosInstance from "../../../services/axiosConfig"

const Notifications = ({ hostUsername }) => {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initial update notifications
    axiosInstance.get(`/hosts/${hostUsername}/notifications`)
      .then(res => {
        setNotifications(res.data);
      })
      .catch(err => {
        console.log(err);
      })

    // Real-time update notifications
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Subscribe to notifications for this host
        client.subscribe(`/topic/notifications/${hostUsername}`, (message) => {
          alert("New notifications: " + message.body);
          try {
            const array = JSON.parse(message.body);
            setNotifications(array);
          } catch (err) {console.log(err)}
        });
      },
    });
    client.activate();

    return () => {
      client.deactivate().catch(err => console.error(err));
    };
  }, [hostUsername]);

  return (
    <div>
      <h4>🔔 Notifications for host {hostUsername}</h4>
      {notifications.map((notification) => (
        <p key={notification.id}>{notification.message}</p>
      ))}
    </div>
  );
};

export default Notifications;
