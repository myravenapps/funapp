import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCamera, FiRotateCcw, FiUpload, FiArrowLeft, FiZap } = FiIcons;

function CameraPage({ setCurrentPhoto, setRoastResult }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'camera';
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Camera access is required to take photos!');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setIsStreaming(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Flip image horizontally for selfie effect
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();
  }, [stopCamera]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    if (mode === 'camera') {
      startCamera();
    }
  }, [mode, startCamera]);

  const analyzePhoto = useCallback(async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setCurrentPhoto(capturedImage);

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    // Generate fake roast result
    const roasts = [
      "87% Goblin DNA detected. Your face scared my backend server! 👹",
      "Analysis complete: 94% chance of being mistaken for a potato 🥔",
      "Error 404: Attractiveness not found. Please try again with a different face 😂",
      "AI crashed trying to process this image. Congratulations! 🤖💥",
      "92% Troll genetics confirmed. Bridge trolling license approved 🌉",
      "Warning: Face may cause spontaneous laughter in viewers 😂",
      "Detected: 89% Shrek similarity. Swamp residency recommended 🧌",
      "System overload: Ugliness levels exceed maximum parameters 📊",
      "Analysis: Your face is a perfect advertisement for plastic surgery 💉",
      "Congratulations! You've unlocked the 'Unique' achievement 🏆"
    ];

    const uglinessScore = Math.floor(Math.random() * 30) + 70; // 70-99%
    const roastText = roasts[Math.floor(Math.random() * roasts.length)];
    
    const filters = ['unibrow', 'giant-forehead', 'crooked-teeth', 'pimples', 'wasted'];
    const selectedFilters = filters.slice(0, Math.floor(Math.random() * 3) + 1);

    const result = {
      uglinessScore,
      roastText,
      filters: selectedFilters,
      timestamp: Date.now()
    };

    setRoastResult(result);
    setIsAnalyzing(false);
    navigate('/result');
  }, [capturedImage, setCurrentPhoto, setRoastResult, navigate]);

  React.useEffect(() => {
    if (mode === 'camera' && !capturedImage) {
      startCamera();
    }
    return () => stopCamera();
  }, [mode, capturedImage, startCamera, stopCamera]);

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl mb-4"
        >
          🤖
        </motion.div>
        <motion.h2
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-2xl font-bold text-white mb-4"
        >
          AI is analyzing your face...
        </motion.h2>
        <div className="w-64 bg-white/20 rounded-full h-2 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3 }}
            className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full"
          />
        </div>
        <p className="text-purple-200 text-center">
          Scanning for ugly features... 🔍<br/>
          Preparing roast... 🔥
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className="p-2 bg-white/10 rounded-full"
        >
          <SafeIcon icon={FiArrowLeft} className="text-white text-xl" />
        </motion.button>
        <h1 className="text-xl font-bold text-white">
          {mode === 'camera' ? 'Take Selfie' : 'Upload Photo'}
        </h1>
        <div className="w-10" />
      </div>

      {/* Camera/Upload Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-sm">
          {capturedImage ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
            </motion.div>
          ) : mode === 'camera' ? (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-2xl shadow-lg transform scale-x-[-1]"
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-2xl pointer-events-none" />
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square bg-white/10 rounded-2xl border-2 border-dashed border-white/30 flex flex-col items-center justify-center cursor-pointer"
            >
              <SafeIcon icon={FiUpload} className="text-4xl text-white mb-4" />
              <p className="text-white text-center">
                Tap to upload photo<br/>
                <span className="text-sm text-purple-200">JPG, PNG supported</span>
              </p>
            </motion.div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-8 w-full max-w-sm space-y-4">
          {capturedImage ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={analyzePhoto}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 px-6 rounded-full flex items-center justify-center gap-3 shadow-lg"
              >
                <SafeIcon icon={FiZap} className="text-xl" />
                Roast This Face!
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={retakePhoto}
                className="w-full bg-white/10 text-white font-medium py-3 px-6 rounded-full flex items-center justify-center gap-2"
              >
                <SafeIcon icon={FiRotateCcw} className="text-lg" />
                {mode === 'camera' ? 'Retake' : 'Choose Different Photo'}
              </motion.button>
            </>
          ) : mode === 'camera' && isStreaming ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={capturePhoto}
              className="w-20 h-20 bg-white rounded-full border-4 border-red-500 mx-auto flex items-center justify-center"
            >
              <SafeIcon icon={FiCamera} className="text-2xl text-red-500" />
            </motion.button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default CameraPage;