import React, { useState, useEffect } from 'react'
import {BASE_URL} from "../../constants/api";

const HouseCarousel = ({ images, height = '300px' }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (images && images.length > 0) {
            const timer = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
            }, 7000) // thay đổi hình mỗi 3 giây
            return () => clearInterval(timer)
        }
    }, [images])

    // Nếu không có hình, hiển thị hình mặc định
    if (!images || images.length === 0) {
        return (
            <img
                src={`${BASE_URL}/images/default.png`}
                alt="placeholder"
                style={{
                    width: '100%',
                    height: height,
                    objectFit: 'cover',
                }}
            />
        )
    }

    return (
        <div style={{ position: 'relative', overflow: 'hidden', height: height }}>
            <div
                style={{
                    display: 'flex',
                    transition: 'transform 0.5s ease-in-out',
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {images.map((image) => (
                    <img
                        key={image.id}
                        src={`${BASE_URL}/images/${image.fileName}`}
                        alt="Image"
                        style={{
                            width: '100%',
                            flexShrink: 0,
                            objectFit: 'cover',
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default HouseCarousel