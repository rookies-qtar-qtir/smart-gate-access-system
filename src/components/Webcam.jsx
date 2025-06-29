import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
  useState,
} from "react";
import Webcam from "react-webcam";
import { Card, Select, Button, message } from "antd";

const { Option } = Select;

const Webcam = forwardRef((props, ref) => {
  const webcamInnerRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [visible, setVisible] = useState(true);

  const getVideoDevices = async () => {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = mediaDevices.filter(
      (device) => device.kind === "videoinput"
    );
    setDevices(videoDevices);

    if (videoDevices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(videoDevices[0].deviceId);
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => getVideoDevices())
      .catch(() => message.error("Gagal mengakses kamera"));
  }, []);

  const videoConstraints = {
    width: 320,
    height: 240,
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
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

      const a = document.createElement("a");
      a.href = url;
      a.download = `capture_${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      message.error("Gagal menangkap gambar");
    }
  };

  useImperativeHandle(ref, () => ({
    captureImage: () => {
      const imageSrc = webcamInnerRef.current.getScreenshot();
      return imageSrcToBlob(imageSrc);
    },
    toggle: () => {
      setVisible((prev) => !prev);
    },
  }));

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "80px",
        zIndex: 1000,
        width: 360,
      }}
    >
      <Card title="Live Camera" size="small" bodyStyle={{ padding: 10 }}>
        <Select
          value={selectedDeviceId}
          onChange={setSelectedDeviceId}
          style={{ marginBottom: 8, width: "100%" }}
        >
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
          style={{ width: "100%", borderRadius: 8 }}
        />
        <Button
          type="primary"
          block
          size="small"
          onClick={captureImage}
          style={{ marginTop: 8 }}
        >
          Capture & Download
        </Button>
      </Card>
    </div>
  );
});

export default Webcam;
