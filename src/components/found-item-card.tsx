import type { FoundItemWithProfile } from "./types/foundItem";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { useState } from "react";
import ModalItem from "./Modal-item";

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

const FoundItemCard = ({
  item,
  index,
}: {
  item: FoundItemWithProfile;
  index: number;
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={index}
        className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={() => setShowModal(true)}
      >
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-40 object-cover rounded-lg"
          />
        )}
        <h2 className="text-lg font-bold">{item.title}</h2>
        <p className="text-gray-600">{item.description}</p>
        <span className="text-xs text-gray-400">Found: {item.date_found}</span>
        {item.user_profiles?.full_name && (
          <span className="text-xs text-gray-500">
            Posted by: {item.user_profiles.full_name}
          </span>

        )}
        {item.claimed_by && item.is_claimed && (
          <span className="text-xs text-gray-500">
            Claimed by: {item.claimed_by}
          </span>
        )}
      </motion.div>

      <ModalItem
        item={item}
        type="found"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default FoundItemCard;
