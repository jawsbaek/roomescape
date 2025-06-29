import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";

interface ScaleOnHoverProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  scale?: number;
  tapScale?: number;
  duration?: number;
}

export function ScaleOnHover({
  children,
  scale = 1.05,
  tapScale = 0.95,
  duration = 0.2,
  ...props
}: ScaleOnHoverProps) {
  return (
    <motion.div
      whileHover={{
        scale,
        transition: { duration },
      }}
      whileTap={{
        scale: tapScale,
        transition: { duration: 0.1 },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
