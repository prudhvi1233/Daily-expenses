import React, { useState, useEffect, useRef, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { MdMic, MdClose, MdCheck, MdErrorOutline, MdRefresh, MdRecordVoiceOver } from 'react-icons/md';
import { format } from 'date-fns';
import { formatTime12Hour } from '../utils/formatTime';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Medical', 'Education', 'Entertainment', 'Recharge', 'Bills', 'Home', 'Fuel', 'Others'];

const STEPS = {
  READY: 'READY',
  AMOUNT: 'AMOUNT',
  CATEGORY: 'CATEGORY',
  DESCRIPTION: 'DESCRIPTION',
  TIME: 'TIME',
  CONFIRM: 'CONFIRM',
  SAVING: 'SAVING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
};

const VoiceExpenseModal = ({ onClose }) => {
  const { addExpense } = useContext(ExpenseContext);
  
  const [step, setStep] = useState(STEPS.READY);
  const [isListening, setIsListening] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [lastHeard, setLastHeard] = useState('');
  
  // Accumulated data
  const [expenseData, setExpenseData] = useState({
    amount: '',
    category: '',
    description: '',
    timeStr: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm')
  });

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStep(STEPS.ERROR);
      setErrorMsg("Voice input isn't supported on this device/browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setErrorMsg('');
      setLastHeard('');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        setStep(STEPS.ERROR);
        setErrorMsg('Microphone permission is required for voice expenses.');
      } else if (event.error === 'no-speech') {
        setErrorMsg("I didn't hear anything.");
      } else {
        setErrorMsg("Couldn't understand that.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Pre-load voices for SpeechSynthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Process transcript when listening stops and we have a final transcript
  useEffect(() => {
    if (!isListening && transcript) {
      setLastHeard(transcript);
      processTranscript(transcript.toLowerCase().trim(), transcript.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  const speak = (text, onEnd) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // clear previous
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a female voice
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('samantha') || 
        v.name.toLowerCase().includes('zira') ||
        v.name.toLowerCase().includes('victoria')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      setIsAssistantSpeaking(true);

      utterance.onend = () => {
        setIsAssistantSpeaking(false);
        if (onEnd) onEnd();
      };
      
      utterance.onerror = () => {
        setIsAssistantSpeaking(false);
        if (onEnd) onEnd();
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      if (onEnd) onEnd(); // Fallback
    }
  };

  const startListeningFor = (targetStep, specificData = null) => {
    setStep(targetStep);
    setTranscript('');
    setErrorMsg('');
    setLastHeard('');
    
    let prompt = "";
    if (targetStep === STEPS.AMOUNT) prompt = "How much did you spend?";
    else if (targetStep === STEPS.CATEGORY) prompt = "What category is this?";
    else if (targetStep === STEPS.DESCRIPTION) prompt = "What was it for?";
    else if (targetStep === STEPS.TIME) prompt = "What time was the expense?";
    else if (targetStep === STEPS.CONFIRM && specificData) {
      prompt = `I understood ₹${specificData.amount} for ${specificData.description} at ${formatTime12Hour(specificData.time)}. Should I save this expense?`;
    }
    
    if (prompt) {
      setIsListening(false);
      speak(prompt, () => {
        try {
          recognitionRef.current?.start();
        } catch (e) {
          console.log('Recognition already started');
        }
      });
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.log('Recognition already started');
      }
    }
  };

  const processTranscript = (text, originalText) => {
    if (step === STEPS.AMOUNT) {
      // Extract number
      const match = text.match(/\d+(\.\d+)?/);
      if (match) {
        const amount = parseFloat(match[0]);
        setExpenseData(prev => ({ ...prev, amount }));
        startListeningFor(STEPS.CATEGORY);
      } else {
        setErrorMsg("Couldn't understand that.");
      }
    } 
    else if (step === STEPS.CATEGORY) {
      // Find matching category
      let foundCat = null;
      for (const cat of CATEGORIES) {
        if (text.includes(cat.toLowerCase())) {
          foundCat = cat;
          break;
        }
      }
      
      if (foundCat) {
        setExpenseData(prev => ({ ...prev, category: foundCat }));
        startListeningFor(STEPS.DESCRIPTION);
      } else {
        setErrorMsg("Couldn't identify that category. Please say Food, Travel, Shopping, etc.");
      }
    }
    else if (step === STEPS.DESCRIPTION) {
      if (text.length > 0) {
        setExpenseData(prev => ({ ...prev, description: originalText.charAt(0).toUpperCase() + originalText.slice(1) }));
        startListeningFor(STEPS.TIME);
      } else {
        setErrorMsg("Couldn't understand that.");
      }
    }
    else if (step === STEPS.TIME) {
      if ((text.includes('now') || text.includes('today')) && !text.match(/\d/)) {
        const newData = { 
          ...expenseData, 
          timeStr: 'Now',
          time: format(new Date(), 'HH:mm') 
        };
        setExpenseData(newData);
        startListeningFor(STEPS.CONFIRM, newData);
      } else {
        // Robust time parsing that handles "3 16 pm", "3:16", "316", "1300"
        let digitsMatch = text.match(/\d+/g);
        if (digitsMatch) {
          let digits = digitsMatch.join('');
          let hours = 0;
          let mins = 0;
          
          if (digits.length === 3) {
            hours = parseInt(digits.substring(0, 1), 10);
            mins = parseInt(digits.substring(1), 10);
          } else if (digits.length === 4) {
            hours = parseInt(digits.substring(0, 2), 10);
            mins = parseInt(digits.substring(2), 10);
          } else if (digits.length <= 2) {
            hours = parseInt(digits, 10);
            mins = 0;
          } else {
            hours = parseInt(digits.substring(0, 2), 10);
            mins = parseInt(digits.substring(2, 4), 10);
          }

          let ampm = null;
          if (text.includes('pm') || text.includes('p.m.')) ampm = 'pm';
          if (text.includes('am') || text.includes('a.m.')) ampm = 'am';
          
          // Smart default logic for PM if missing AM/PM but hours are PM-likely
          if (!ampm && hours >= 1 && hours <= 11) {
            ampm = 'pm';
          }
          
          if (ampm === 'pm' && hours < 12) hours += 12;
          if (ampm === 'am' && hours === 12) hours = 0;
          
          if (hours <= 23 && mins <= 59) {
            const timeFormatted = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
            const newData = {
              ...expenseData,
              timeStr: text,
              time: timeFormatted
            };
            setExpenseData(newData);
            startListeningFor(STEPS.CONFIRM, newData);
          } else {
            setErrorMsg("Couldn't understand that.");
          }
        } else {
          setErrorMsg("Couldn't understand that.");
        }
      }
    }
    else if (step === STEPS.CONFIRM) {
      if (text.includes('yes') || text.includes('save') || text.includes('confirm') || text.includes('yeah') || text.includes('yep')) {
        handleSave(expenseData);
      } else if (text.includes('no') || text.includes('cancel') || text.includes('stop') || text.includes('abort')) {
        onClose();
      } else {
        setErrorMsg("I didn't understand. Please say yes to save or no to cancel.");
        speak("I didn't understand. Please say yes to save or no to cancel.", () => {
          try {
            recognitionRef.current?.start();
          } catch (e) {
            // ignore
          }
        });
      }
    }
  };

  const handleSave = async (dataToSave) => {
    setStep(STEPS.SAVING);
    try {
      await addExpense({
        amount: dataToSave.amount,
        category: dataToSave.category,
        description: dataToSave.description || dataToSave.category,
        paymentMethod: 'Cash',
        date: dataToSave.date,
        time: dataToSave.time
      });
      setStep(STEPS.SUCCESS);
      speak("Expense added successfully.", () => {
        setTimeout(() => {
          onClose();
        }, 1500);
      });
    } catch (err) {
      setStep(STEPS.ERROR);
      setErrorMsg('We couldn\'t save your expense. Please try again.');
    }
  };

  const getStepNumber = () => {
    switch (step) {
      case STEPS.AMOUNT: return 1;
      case STEPS.CATEGORY: return 2;
      case STEPS.DESCRIPTION: return 3;
      case STEPS.TIME: return 4;
      case STEPS.CONFIRM: return 5;
      default: return 0;
    }
  };

  const currentStepNum = getStepNumber();

  return (
    <div className="glass-panel p-6 w-full max-w-[90vw] sm:max-w-md mx-auto relative overflow-hidden animate-fade-in shadow-2xl flex flex-col items-center border border-white/10 rounded-2xl bg-[#0f172a]/95 backdrop-blur-xl">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors p-2 rounded-full hover:bg-white/10 z-10"
      >
        <MdClose size={24} />
      </button>
      
      {/* Header and Progress Indicator */}
      {(currentStepNum > 0 && step !== STEPS.SAVING && step !== STEPS.SUCCESS && step !== STEPS.ERROR) && (
        <div className="w-full text-center mb-8">
          <h2 className="text-xl font-bold text-white mb-2">Add Expense by Voice</h2>
          <p className="text-slate-400 text-sm mb-4">Step {currentStepNum} of 5</p>
          
          <div className="flex items-center justify-between max-w-[260px] mx-auto px-2 relative">
            <div className="absolute left-[10%] right-[10%] h-[2px] bg-slate-700 top-1/2 -translate-y-1/2 z-0"></div>
            {[1, 2, 3, 4, 5].map(idx => (
              <div 
                key={idx}
                className={`relative z-10 w-3 h-3 rounded-full transition-colors duration-300 ${
                  idx < currentStepNum ? 'bg-blue-500' :
                  idx === currentStepNum ? 'bg-blue-400 ring-4 ring-blue-500/30' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          
          <div className="flex justify-between max-w-[280px] mx-auto mt-2 text-[9px] sm:text-[10px] text-slate-500 font-medium">
            <span className={currentStepNum >= 1 ? 'text-blue-400' : ''}>Amount</span>
            <span className={currentStepNum >= 2 ? 'text-blue-400' : ''}>Category</span>
            <span className={currentStepNum >= 3 ? 'text-blue-400' : ''}>Desc</span>
            <span className={currentStepNum >= 4 ? 'text-blue-400' : ''}>Time</span>
            <span className={currentStepNum >= 5 ? 'text-blue-400' : ''}>Confirm</span>
          </div>
        </div>
      )}

      <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[220px]">
        {/* Dynamic States */}
        {step === STEPS.READY && (
          <div className="text-center w-full">
            <h3 className="text-2xl font-bold text-white mb-2">Voice Expense</h3>
            <p className="text-slate-400 mb-8">Tap to start</p>
            <button 
              onClick={() => startListeningFor(STEPS.AMOUNT)}
              className="w-24 h-24 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-transform hover:scale-105 active:scale-95"
            >
              <MdMic size={48} />
            </button>
          </div>
        )}

        {(step === STEPS.AMOUNT || step === STEPS.CATEGORY || step === STEPS.DESCRIPTION || step === STEPS.TIME || step === STEPS.CONFIRM) && (
          <div className="w-full flex flex-col items-center animate-fade-in">
            
            {/* Title / Question */}
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-8 text-center px-4">
              {step === STEPS.AMOUNT && "How much did you spend?"}
              {step === STEPS.CATEGORY && "What category is this?"}
              {step === STEPS.DESCRIPTION && "What was it for?"}
              {step === STEPS.TIME && "What time was it?"}
              {step === STEPS.CONFIRM && "Should I save this expense?"}
            </h3>

            {/* Microphone Area */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-8">
              {isListening && (
                <>
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-2 bg-blue-500/30 rounded-full animate-pulse"></div>
                </>
              )}
              
              <div className={`w-20 h-20 rounded-full flex items-center justify-center z-10 transition-colors ${
                isAssistantSpeaking ? 'bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.5)]' :
                isListening ? 'bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.5)]' :
                'bg-slate-800 border border-slate-700'
              }`}>
                {isAssistantSpeaking ? <MdRecordVoiceOver size={36} className="text-white" /> : <MdMic size={36} className={isListening ? 'text-white' : 'text-slate-400'} />}
              </div>
            </div>

            {/* Status Text & "You Said" Bubble */}
            <div className="min-h-[120px] w-full flex flex-col items-center justify-start pb-2">
              {isAssistantSpeaking ? (
                <p className="text-indigo-400 font-medium">Assistant is speaking...</p>
              ) : isListening ? (
                <>
                  <p className="text-blue-400 font-medium mb-3">Listening...</p>
                  {transcript && (
                    <div className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 max-w-[90%] text-center shadow-lg">
                      <p className="text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">You said</p>
                      <p className="text-white italic text-sm sm:text-base">"{transcript}"</p>
                    </div>
                  )}
                </>
              ) : errorMsg ? (
                <div className="flex flex-col items-center animate-fade-in">
                  <p className="text-rose-400 text-sm mb-2 text-center">{errorMsg}</p>
                  {lastHeard && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl py-2 px-4 mb-3 max-w-[90%] text-center">
                      <p className="text-[10px] text-rose-300/70 mb-0.5 uppercase">Heard</p>
                      <p className="text-rose-200 italic text-sm line-through decoration-rose-500/50">"{lastHeard}"</p>
                    </div>
                  )}
                  <button 
                    onClick={() => startListeningFor(step, step === STEPS.CONFIRM ? expenseData : null)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <MdRefresh size={18} /> Try Again
                  </button>
                </div>
              ) : (
                <div className="flex gap-1.5 items-center justify-center">
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                </div>
              )}
            </div>

            {/* Confirmation Data Summary (Only shown on CONFIRM step) */}
            {step === STEPS.CONFIRM && (
              <div className="w-full mt-4 bg-black/20 border border-white/5 rounded-xl p-4 animate-fade-in">
                <div className="space-y-2">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400 text-sm whitespace-nowrap">Amount</span>
                    <span className="font-bold text-white text-right">₹{expenseData.amount}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400 text-sm whitespace-nowrap">Category</span>
                    <span className="font-bold text-white text-right">{expenseData.category}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400 text-sm whitespace-nowrap">Description</span>
                    <span className="font-bold text-white text-right truncate max-w-[150px]" title={expenseData.description}>{expenseData.description}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400 text-sm whitespace-nowrap">Time</span>
                    <span className="font-bold text-white text-right capitalize">{formatTime12Hour(expenseData.time)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === STEPS.SAVING && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-blue-400 font-medium">Saving expense...</p>
          </div>
        )}

        {step === STEPS.SUCCESS && (
          <div className="text-center w-full animate-fade-in py-6">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <MdCheck size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Expense Added</h3>
            
            <div className="bg-black/20 rounded-xl p-4 inline-block min-w-[200px]">
              <p className="text-xl font-bold text-emerald-400 mb-1">₹{expenseData.amount}</p>
              <p className="text-slate-300 font-medium">{expenseData.description}</p>
              <p className="text-xs text-slate-500 mt-2">Today · {formatTime12Hour(expenseData.time)}</p>
            </div>
          </div>
        )}

        {step === STEPS.ERROR && (
          <div className="text-center py-8 w-full animate-fade-in">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdErrorOutline size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Oops!</h3>
            <p className="text-slate-400 mb-8 px-4 text-sm">{errorMsg}</p>
            <div className="flex justify-center">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors border border-white/10"
              >
                Close Assistant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceExpenseModal;
