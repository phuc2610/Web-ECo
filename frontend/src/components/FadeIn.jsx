import React from 'react';
import { motion } from 'framer-motion';

const FadeIn = ({ children, delay = 0, duration = 0.25, className = "", direction = "right" }) => {
  const getDirectionalVariants = () => {
    switch (direction) {
      case "up":
        return { y: 30, opacity: 0 };
      case "down":
        return { y: -30, opacity: 0 };
      case "left":
        return { x: 30, opacity: 0 };
      case "right":
        return { x: -30, opacity: 0 };
      default:
        return { x: -30, opacity: 0 };
    }
  };

  const getDirectionalAnimate = () => {
    switch (direction) {
      case "up":
        return { y: 0, opacity: 1 };
      case "down":
        return { y: 0, opacity: 1 };
      case "left":
        return { x: 0, opacity: 1 };
      case "right":
        return { x: 0, opacity: 1 };
      default:
        return { x: 0, opacity: 1 };
    }
  };

  return (
    <motion.div
      initial={getDirectionalVariants()}
      animate={getDirectionalAnimate()}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
