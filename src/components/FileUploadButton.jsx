import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Button, message, Tooltip } from 'antd';
import { UploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const FileUploadButton = forwardRef((props, ref) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEnabled, setIsEnabled] = useState(true);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        message.error('Please upload an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        message.error('File size should be less than 5MB');
        return;
      }

      setUploadedFile(file);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      message.success(`File uploaded: ${file.name}`);
    }
    
    event.target.value = '';
  };

  const removeFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadedFile(null);
    setPreviewUrl(null);
    message.success('File removed');
  };

  const toggleFeature = () => {
    setIsEnabled(!isEnabled);
    if (isEnabled) {
      removeFile();
    }
    message.info(`File upload feature ${isEnabled ? 'disabled' : 'enabled'}`);
  };

  useImperativeHandle(ref, () => ({
    getUploadedFile: () => uploadedFile,
    hasUploadedFile: () => uploadedFile !== null,
    removeFile: removeFile,
    toggleFeature: toggleFeature,
    isEnabled: () => isEnabled
  }));

  if (!isEnabled) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '120px',
          right: '20px',
          zIndex: 1001,
        }}
      >
        <Tooltip title="Enable file upload feature">
          <Button
            type="dashed"
            shape="circle"
            size="large"
            icon={<UploadOutlined />}
            onClick={toggleFeature}
            style={{
              width: 56,
              height: 56,
              opacity: 0.5,
              border: '2px dashed #d9d9d9'
            }}
          />
        </Tooltip>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '120px',
        right: '20px',
        zIndex: 1001,
        width: 'fit-content',
      }}
    >
      {uploadedFile ? (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #1890ff',
              cursor: 'pointer',
              position: 'relative',
              background: '#fff'
            }}
          >
            <img
              src={previewUrl}
              alt="Uploaded preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                fontSize: '10px',
                textAlign: 'center',
                padding: '2px'
              }}
            >
              Ready
            </div>
          </div>
          
          {/* Tombol hapus file */}
          <Button
            type="primary"
            danger
            shape="circle"
            size="small"
            icon={<DeleteOutlined />}
            onClick={removeFile}
            style={{
              position: 'absolute',
              top: -5,
              right: -5,
              width: 20,
              height: 20,
              fontSize: '10px',
              zIndex: 1002
            }}
          />
          
          {/* Tombol toggle feature */}
          <Button
            type="default"
            shape="circle"
            size="small"
            icon={<EyeOutlined />}
            onClick={toggleFeature}
            style={{
              position: 'absolute',
              bottom: -5,
              right: -5,
              width: 20,
              height: 20,
              fontSize: '10px',
              zIndex: 1002,
              background: '#52c41a',
              borderColor: '#52c41a',
              color: 'white'
            }}
          />
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="file-upload-input"
          />
          <Tooltip title="Upload image file">
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={<UploadOutlined />}
              onClick={() => document.getElementById('file-upload-input').click()}
              style={{
                width: 56,
                height: 56,
                background: '#722ed1',
                borderColor: '#722ed1',
                cursor: 'pointer'
              }}
            />
          </Tooltip>
          
          {/* Tombol toggle feature */}
          <Button
            type="default"
            shape="circle"
            size="small"
            icon={<EyeOutlined />}
            onClick={toggleFeature}
            style={{
              position: 'absolute',
              bottom: -5,
              right: -5,
              width: 20,
              height: 20,
              fontSize: '10px',
              zIndex: 1002,
              background: '#52c41a',
              borderColor: '#52c41a',
              color: 'white'
            }}
          />
        </div>
      )}
      
      {/* Nama file (opsional, bisa dihapus jika tidak diperlukan) */}
      {uploadedFile && (
        <div
          style={{
            position: 'absolute',
            bottom: -25,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '10px',
            color: '#666',
            textAlign: 'center',
            maxWidth: '100px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {uploadedFile.name}
        </div>
      )}
    </div>
  );
});

export default FileUploadButton;