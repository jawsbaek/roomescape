import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";

interface PulseAnimationProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  scale?: [number, number];
  duration?: number;
  repeat?: number;
}

const DEFAULT_SCALE: [number, number] = [1, 1.1];

export function PulseAnimation({
  children,
  scale = DEFAULT_SCALE,
  duration = 1,
  repeat = Infinity,
  ...props
}: PulseAnimationProps) {
  return (
    <motion.div
      animate={{
        scale: scale,
      }}
      transition={{
        duration,
        repeat,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
