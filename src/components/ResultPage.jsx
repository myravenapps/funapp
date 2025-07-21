import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShare2, FiRotateCcw, FiHome, FiDownload, FiCopy } = FiIcons;

function ResultPage({ photo, result }) {
  const navigate = useNavigate();
  const resultRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);

  if (!photo || !result) {
    navigate('/');
    return null;
  }

  const shareResult = async () => {
    setIsSharing(true);
    
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#1e1b4b',
        scale: 2
      });
      
      canvas.toBlob(async (blob) => {
        const shareText = `I got ${result.uglinessScore}% ugliness score! 🤡 Try the Ugly Face Detector: ${window.location.origin}`;
        
        if (navigator.share && navigator.canShare({ files: [new File([blob], 'roast.png', { type: 'image/png' })] })) {
          await navigator.share({
            title: 'Ugly Face Detector Result',
            text: shareText,
            files: [new File([blob], 'roast.png', { type: 'image/png' })]
          });
        } else {
          // Fallback: download image
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'ugly-face-roast.png';
          a.click();
          URL.revokeObjectURL(url);
          
          // Copy text to clipboard
          await navigator.clipboard.writeText(shareText);
          alert('Image downloaded and text copied to clipboard!');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Sharing failed:', error);
      alert('Sharing failed, but you can screenshot this result!');
    }
    
    setIsSharing(false);
  };

  const copyText = async () => {
    const shareText = `I got ${result.uglinessScore}% ugliness score! 🤡 ${result.roastText} Try it: ${window.location.origin}`;
    await navigator.clipboard.writeText(shareText);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Result Card */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          ref={resultRef}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm bg-gradient-to-br from-red-900/80 to-purple-900/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/10"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-2"
            >
              🤡
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1">Analysis Complete!</h1>
            <p className="text-red-200">AI Roast Results</p>
          </div>

          {/* Photo with Filters */}
          <div className="relative mb-6">
            <img
              src={photo}
              alt="Your face"
              className="w-full rounded-2xl shadow-lg"
            />
            
            {/* Overlay Filters */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              {result.filters.includes('wasted') && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-red-500 font-bold text-4xl transform -rotate-12">
                    WASTED
                  </div>
                </div>
              )}
              
              {result.filters.includes('unibrow') && (
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-3 bg-black rounded-full opacity-80" />
                </div>
              )}
              
              {result.filters.includes('pimples') && (
                <>
                  <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-red-500 rounded-full" />
                  <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-red-400 rounded-full" />
                  <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-red-600 rounded-full" />
                </>
              )}
            </div>

            {/* Ugliness Score Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
            >
              <div className="text-center">
                <div className="text-lg font-bold">{result.uglinessScore}%</div>
                <div className="text-xs">UGLY</div>
              </div>
            </motion.div>
          </div>

          {/* Roast Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-black/30 rounded-xl p-4 mb-6"
          >
            <p className="text-white text-center font-medium leading-relaxed">
              {result.roastText}
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center">
              <div className="text-2xl">👹</div>
              <div className="text-xs text-white">Goblin Level</div>
              <div className="text-sm font-bold text-red-300">{Math.floor(result.uglinessScore * 0.8)}%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">😱</div>
              <div className="text-xs text-white">Scare Factor</div>
              <div className="text-sm font-bold text-yellow-300">{Math.floor(result.uglinessScore * 0.9)}%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">🤮</div>
              <div className="text-xs text-white">Nausea Risk</div>
              <div className="text-sm font-bold text-green-300">{Math.floor(result.uglinessScore * 0.7)}%</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareResult}
          disabled={isSharing}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-6 rounded-full flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
        >
          <SafeIcon icon={FiShare2} className="text-xl" />
          {isSharing ? 'Creating Shareable Image...' : 'Share Your Roast'}
        </motion.button>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyText}
            className="bg-white/10 text-white font-medium py-3 px-4 rounded-full flex items-center justify-center gap-2"
          >
            <SafeIcon icon={FiCopy} className="text-lg" />
            Copy Text
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/camera?mode=camera')}
            className="bg-white/10 text-white font-medium py-3 px-4 rounded-full flex items-center justify-center gap-2"
          >
            <SafeIcon icon={FiRotateCcw} className="text-lg" />
            Try Again
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="w-full bg-white/5 text-white font-medium py-3 px-6 rounded-full flex items-center justify-center gap-2"
        >
          <SafeIcon icon={FiHome} className="text-lg" />
          Back to Home
        </motion.button>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 text-center"
      >
        <p className="text-purple-300 text-sm">
          🤡 Ugly Face Detector - Where AI meets savage roasts!
        </p>
      </motion.div>
    </div>
  );
}

export default ResultPage;