import { motion } from "framer-motion";

export default function PageTitle({ children }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-3xl font-bold text-[#2ECC71] mb-8"
    >
      {children}
    </motion.h1>
  );
}
