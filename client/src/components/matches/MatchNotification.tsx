import { Job } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

interface MatchNotificationProps {
  isVisible: boolean;
  job: Job | null;
  onClose: () => void;
  onSendMessage: () => void;
}

const MatchNotification = ({ isVisible, job, onClose, onSendMessage }: MatchNotificationProps) => {
  return (
    <AnimatePresence>
      {isVisible && job && (
        <motion.div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                <i className="fas fa-check-circle text-5xl text-primary"></i>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">It's a Match!</h3>
            <p className="text-neutral-600 mb-6">
              You and <span className="font-semibold">{job.company}</span> have shown interest in each other.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                className="bg-primary hover:bg-primary/90 text-white font-medium px-5 py-3 rounded-lg flex-1"
                onClick={onSendMessage}
              >
                Send Message
              </button>
              <button 
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium px-5 py-3 rounded-lg flex-1"
                onClick={onClose}
              >
                Continue Swiping
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MatchNotification;
