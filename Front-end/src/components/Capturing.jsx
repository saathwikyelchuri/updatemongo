/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import html2canvas from 'html2canvas';

const Capturing = ({ 
    childName, 
    sessionId, 
    gameId, 
    captureInterval = 3000, 
    screenshotInterval = 6000, 
    uploadUrl = 'http://localhost:3000/photos' 
}) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const timerImage = useRef(null);
    const timerScreenshot = useRef(null);
    const streamRef = useRef(null); // Reference to the video stream
    const [startTime, setStartTime] = useState(Date.now());
    const [capturing, setCapturing] = useState(true);

    useEffect(() => {
        if (!childName || !sessionId || !gameId) {
            alert("Missing required session information. Please log in again.");
            return;
        }

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                streamRef.current = stream; // Store the stream reference
                setStartTime(Date.now());
                startCaptureIntervals();
            })
            .catch(error => console.error("Video capture error:", error));

        return () => stopCaptureIntervals();
    }, [childName, sessionId, gameId]);

    const startCaptureIntervals = () => {
        timerImage.current = setInterval(() => {
            captureImage();
        }, captureInterval);

        timerScreenshot.current = setInterval(() => {
            captureScreenshot();
        }, screenshotInterval);
    };

    const stopCaptureIntervals = () => {
        if (timerImage.current) clearInterval(timerImage.current);
        if (timerScreenshot.current) clearInterval(timerScreenshot.current);

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null; // Clear the stream reference
        }

        setCapturing(false); // Update state to reflect stopped capturing
    };

    const captureImage = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, 640, 480);
            const imageData = canvasRef.current.toDataURL('image/png');
            const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
            const filename = `img-${gameId}-${timeElapsed}.png`;

            uploadImage(imageData, filename);
        }
    };

    const captureScreenshot = () => {
        if (canvasRef.current) {
            html2canvas(document.body).then(canvas => {
                const screenshotData = canvas.toDataURL('image/png');
                const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
                const filename = `screenshot-${gameId}-${timeElapsed}.png`;

                uploadImage(screenshotData, filename);
            }).catch(error => console.error("Screenshot capture error:", error));
        }
    };

    const uploadImage = (imageData, filename) => {
        fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: imageData,
                filename: filename,
                childName: childName,
                sessionId: sessionId,
                gameId: gameId
            })
        })
        .then(response => response.json())
        .then(data => console.log('Upload response:', data))
        .catch(error => console.error('Upload error:', error));
    };

    return (
        <div>
            <video ref={videoRef} autoPlay style={{ display: 'none' }} />
            <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />
            {/* {capturing ? (
                <button onClick={stopCaptureIntervals}>Stop Capturing</button>
            ) : (
                <p>Capture stopped</p>
            )} */}
        </div>
    );
};

Capturing.propTypes = {
    childName: PropTypes.string.isRequired,
    sessionId: PropTypes.string.isRequired,
    gameId: PropTypes.string.isRequired,
    captureInterval: PropTypes.number,
    screenshotInterval: PropTypes.number,
    uploadUrl: PropTypes.string
};

export default Capturing;
