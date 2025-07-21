import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCamera, FiUpload, FiUsers, FiZap } = FiIcons;

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md w-full"
      >
        {/* Logo */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-4"
        >
          🤡
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold text-white mb-2"
        >
          Ugly Face Detector
        </motion.h1>

        <motion.p
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="text-xl text-purple-200 mb-8"
        >
          AI-Powered Roast Machine 🔥
        </motion.p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
          >
            <SafeIcon icon={FiZap} className="text-2xl text-yellow-400 mx-auto mb-1" />
            <p className="text-sm text-white">Instant AI Analysis</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
          >
            <SafeIcon icon={FiUsers} className="text-2xl text-pink-400 mx-auto mb-1" />
            <p className="text-sm text-white">Roast Your Friends</p>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/camera?mode=camera')}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 px-6 rounded-full flex items-center justify-center gap-3 shadow-lg"
          >
            <SafeIcon icon={FiCamera} className="text-xl" />
            Take Selfie & Get Roasted
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/camera?mode=upload')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-6 rounded-full flex items-center justify-center gap-3 shadow-lg"
          >
            <SafeIcon icon={FiUpload} className="text-xl" />
            Upload Photo
          </motion.button>
        </div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30"
        >
          <p className="text-yellow-200 text-sm">
            ⚠️ Warning: Our AI has no chill. Prepare to be roasted! 🔥
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HomePage;