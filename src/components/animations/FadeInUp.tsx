import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInUpProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
}

export function FadeInUp({
  children,
  delay = 0,
  duration = 0.6,
  distance = 20,
  ...props
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: distance,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -distance,
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
