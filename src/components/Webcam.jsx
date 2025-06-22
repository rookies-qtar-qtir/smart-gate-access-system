import React, { useEffect, useImperativeHandle, forwardRef, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Card, Select, Button, message } from "antd";

const { Option } = Select;

const WebcamComponent = forwardRef((props, ref) => {
  const webcamInnerRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [capturedImage, setCapturedImage] = useState(null); // 👈 state untuk image

  const getVideoDevices = async () => {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
    setDevices(videoDevices);

    if (videoDevices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(videoDevices[0].deviceId);
    }
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => getVideoDevices())
      .catch(() => message.error("Gagal mengakses kamera"));
  }, []);

  const videoConstraints = {
    width: 640,
    height: 480,
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined
  };

  const imageSrcToBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const captureImage = () => {
    const imageSrc = webcamInnerRef.current.getScreenshot();
    if (imageSrc) {
      const blob = imageSrcToBlob(imageSrc);
      const url = URL.createObjectURL(blob);
      setCapturedImage(url);

      // Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `capture_${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // optional: cleanup
    } else {
      message.error("Gagal menangkap gambar");
    }
  };

  // 👇 Expose captureImage to parent via ref
  useImperativeHandle(ref, () => ({
    captureImage: () => {
      const imageSrc = webcamInnerRef.current.getScreenshot();
      return imageSrcToBlob(imageSrc);
    }
  }));

  return (
    <Card title="Live Camera Feed">
      <Select value={selectedDeviceId} onChange={setSelectedDeviceId} style={{ marginBottom: 10 }}>
        {devices.map((device, i) => (
          <Option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${i + 1}`}
          </Option>
        ))}
      </Select>
      <Webcam
        ref={webcamInnerRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <div style={{ marginTop: 10 }}>
        <Button type="primary" onClick={captureImage}>Capture & Download</Button>
      </div>
    </Card>
  );
});

export default WebcamComponent;
