import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import axiosInstance from "../../../services/axiosConfig";
import { CDropdownItem } from '@coreui/react';

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
        client.subscribe(`/topic/notifications/${hostUsername}`, (message) => {
          try {
            const notiArray = JSON.parse(message.body);
            setNotifications(notiArray);
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
    <>
      {notifications.map((notification, index) => (
        <CDropdownItem
          key={notification.id}
          className={index === notifications.length - 1 ? 'no-border' : 'border-bottom'}
        >
          {notification.message}
        </CDropdownItem>
      ))}
    </>
  );
};

export default Notifications;
