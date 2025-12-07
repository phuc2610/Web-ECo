import React from 'react';
import { motion } from 'framer-motion';
import SmoothScroll from './SmoothScroll';

const AnimatedRoute = ({ children, className = "" }) => {
  return (
    <SmoothScroll>
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -50, scale: 0.98 }}
        transition={{
          duration: 0.25,
          ease: [0.25, 0.46, 0.45, 0.94],
          staggerChildren: 0.1
        }}
        className={className}
      >
        {children}
      </motion.div>
    </SmoothScroll>
  );
};

export default AnimatedRoute;
