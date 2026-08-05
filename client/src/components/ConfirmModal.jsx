import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[90%] max-w-sm glass-panel bg-white/90 dark:bg-[#1a1c23]/90 rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden p-6"
          >
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title || "Confirm Action"}</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{message || "Are you sure you want to proceed?"}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Use createPortal so the modal renders at the top level, avoiding getting trapped by parent CSS transforms or overflow:hidden
  return createPortal(modalContent, document.body);
};

export default ConfirmModal;
