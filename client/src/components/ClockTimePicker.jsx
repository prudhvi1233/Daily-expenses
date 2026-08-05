import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAccessTime } from 'react-icons/md';

const ClockTimePicker = ({ value, onChange, className }) => {
  // value is expected in "HH:mm" (24-hour) format
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('hours'); // 'hours' or 'minutes'
  
  // Parse initial value
  const parseTime = (timeStr) => {
    if (!timeStr) return { h: 12, m: 0, isPm: false };
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    const isPm = h >= 12;
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return { h, m, isPm };
  };

  const [time, setTime] = useState(parseTime(value));

  // Sync state if value prop changes from outside
  useEffect(() => {
    if (value && !isOpen) {
      setTime(parseTime(value));
    }
  }, [value, isOpen]);

  const clockRef = useRef(null);

  const handleClockInteract = (e) => {
    if (!clockRef.current) return;
    
    // Get mouse/touch coordinates
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = angle + 90;
    if (angle < 0) angle += 360;

    if (mode === 'hours') {
      let h = Math.round(angle / 30);
      if (h === 0) h = 12;
      setTime(prev => ({ ...prev, h }));
    } else {
      let m = Math.round(angle / 6) % 60;
      setTime(prev => ({ ...prev, m }));
    }
  };

  const handlePointerDown = (e) => {
    handleClockInteract(e);
    // Add event listeners for dragging
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    handleClockInteract(e);
  };

  const handlePointerUp = (e) => {
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
    
    // Auto switch to minutes after selecting hour (only on pointer up, not during drag)
    if (mode === 'hours') {
      setTimeout(() => setMode('minutes'), 300);
    }
  };

  const handleConfirm = () => {
    let finalH = time.h;
    if (time.isPm && finalH !== 12) finalH += 12;
    if (!time.isPm && finalH === 12) finalH = 0;
    
    const hh = finalH.toString().padStart(2, '0');
    const mm = time.m.toString().padStart(2, '0');
    onChange(`${hh}:${mm}`);
    setIsOpen(false);
  };

  // Generate numbers for the dial
  const renderNumbers = () => {
    const items = [];
    const total = 12; // 12 numbers around the dial
    
    for (let i = 1; i <= total; i++) {
      let num = mode === 'hours' ? i : (i === 12 ? 0 : i * 5);
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const radius = 95; // distance from center
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      const isActive = mode === 'hours' ? (time.h === num) : (time.m === num || (time.m === 0 && num === 60));

      items.push(
        <div
          key={num}
          className={`absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
            isActive ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-slate-600 dark:text-slate-300'
          }`}
          style={{ transform: `translate(${x + 120}px, ${y + 120}px)` }}
        >
          {mode === 'minutes' ? num.toString().padStart(2, '0') : num}
        </div>
      );
    }
    return items;
  };

  // Calculate hand properties
  const handAngle = mode === 'hours' 
    ? (time.h * 30)
    : (time.m * 6);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setTime(parseTime(value)); // Reset to current value on open
          setMode('hours');
          setIsOpen(true);
        }}
        className={`w-full flex items-center gap-2 bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 hover:border-blue-500/50 transition-all outline-none ${className || ''}`}
      >
        <MdAccessTime size={20} className="text-slate-500 dark:text-slate-400" />
        <span>
          {time.h.toString().padStart(2, '0')}:{time.m.toString().padStart(2, '0')} {time.isPm ? 'PM' : 'AM'}
        </span>
      </button>

      {/* Modal/Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            
            {/* Picker Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[320px] glass-panel bg-white/90 dark:bg-[#1a1c23]/90 rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-blue-600/10 dark:bg-blue-500/10 p-6 flex justify-between items-center">
                <div className="flex items-baseline text-4xl font-bold text-slate-800 dark:text-white cursor-pointer select-none">
                  <span 
                    onClick={() => setMode('hours')}
                    className={`transition-colors ${mode === 'hours' ? 'text-blue-600 dark:text-blue-400' : 'opacity-50 hover:opacity-100'}`}
                  >
                    {time.h.toString().padStart(2, '0')}
                  </span>
                  <span className="opacity-50 mx-1">:</span>
                  <span 
                    onClick={() => setMode('minutes')}
                    className={`transition-colors ${mode === 'minutes' ? 'text-blue-600 dark:text-blue-400' : 'opacity-50 hover:opacity-100'}`}
                  >
                    {time.m.toString().padStart(2, '0')}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1 text-sm font-bold bg-black/5 dark:bg-black/20 p-1 rounded-lg">
                  <button 
                    type="button"
                    onClick={() => setTime(prev => ({ ...prev, isPm: false }))}
                    className={`px-3 py-1 rounded-md transition-all ${!time.isPm ? 'bg-blue-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
                  >
                    AM
                  </button>
                  <button 
                    type="button"
                    onClick={() => setTime(prev => ({ ...prev, isPm: true }))}
                    className={`px-3 py-1 rounded-md transition-all ${time.isPm ? 'bg-blue-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
                  >
                    PM
                  </button>
                </div>
              </div>

              {/* Clock Body */}
              <div className="p-8 flex justify-center items-center">
                <div 
                  ref={clockRef}
                  onPointerDown={handlePointerDown}
                  className="w-[240px] h-[240px] rounded-full bg-slate-100 dark:bg-black/30 relative cursor-pointer touch-none select-none shadow-inner border border-black/5 dark:border-white/5"
                >
                  {/* Center Dot */}
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 bg-blue-500 rounded-full z-10 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  
                  {/* Clock Hand */}
                  <div 
                    className="absolute bottom-1/2 left-1/2 w-[2px] h-[95px] bg-blue-500 origin-bottom -ml-[1px] transition-transform duration-200 ease-out z-0"
                    style={{ 
                      transform: `rotate(${handAngle}deg)`
                    }}
                  >
                    {/* Hand End Circle */}
                    <div className="absolute -top-3 -left-[11px] w-6 h-6 rounded-full bg-blue-500 opacity-20"></div>
                  </div>

                  {/* Numbers */}
                  {renderNumbers()}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 flex justify-end gap-2 border-t border-black/10 dark:border-white/10">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleConfirm}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClockTimePicker;
