import type { LostItem } from "./types/lostItem";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.1, 0.1, 0.1, 1], // cubic-bezier (easeOut)
    },
  }),
};
const LostItemCard = ({ item, index }: { item: LostItem; index: number }) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2"
    >
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-40 object-cover rounded-lg"
          loading="lazy"
        />
      )}
      <h2 className="text-lg font-bold">{item.title}</h2>
      <p className="text-gray-600">{item.description}</p>
      <span className="text-xs text-gray-400">Lost: {item.date_lost}</span>
    </motion.div>
  );
};

export default LostItemCard;
