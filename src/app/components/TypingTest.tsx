'use client';

import { useState, useEffect, useRef } from 'react';
import { RotateCcw, Clock } from 'lucide-react';
import { useSession } from 'next-auth/react';

const WORD_POOL = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'program', 'function', 'variable', 'string', 'number', 'array', 'object', 'class',
  'method', 'return', 'import', 'export', 'const', 'let', 'interface', 'type'
];

const WORD_COUNT = 50;
const TIME_OPTIONS = [15, 30, 60];

function generateWords(): string {
  const words: string[] = [];
  for (let i = 0; i < WORD_COUNT; i++) {
    const randomWord = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    words.push(randomWord);
  }
  return words.join(' ');
}

export function TypingTest() {
  const { data: session } = useSession();
  const [text, setText] = useState(generateWords());
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedTime, setSelectedTime] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to calculate WPM
  const getWPM = () => {
    const elapsed = selectedTime - timeLeft;
    if (elapsed === 0) return 0;
    const minutes = elapsed / 60;
    const wordsTyped = currentIndex / 5;
    return Math.round(wordsTyped / minutes);
  };

  // Helper function to calculate Accuracy
  const getAccuracy = () => {
    if (currentIndex === 0) return 100;
    const correctChars = currentIndex - errors.size;
    return Math.round((correctChars / currentIndex) * 100);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!startTime) {
      setTimeLeft(selectedTime);
    }
  }, [selectedTime, startTime]);

  useEffect(() => {
    if (startTime && !isFinished) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = selectedTime - elapsed;

        if (remaining <= 0) {
          setTimeLeft(0);
          setIsFinished(true);
          clearInterval(interval);
        } else {
          setTimeLeft(remaining);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [startTime, isFinished, selectedTime]);

  // Save result when finished
  useEffect(() => {
    if (isFinished && session?.user) {
      const saveResult = async () => {
        try {
          await fetch('/api/results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              wpm: getWPM(),
              accuracy: getAccuracy(),
              time: selectedTime,
            }),
          });
        } catch (err) {
          console.error('Failed to save result', err);
        }
      };
      saveResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, session]); // Only run when isFinished changes to true

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const value = e.target.value;

    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }

    if (value.length < userInput.length) {
      const charIndex = userInput.length - 1;
      setErrors(prev => {
        const newErrors = new Set(prev);
        newErrors.delete(charIndex);
        return newErrors;
      });
      setUserInput(value);
      setCurrentIndex(value.length);
      return;
    }

    if (value.length > text.length) return;

    setUserInput(value);
    const newIndex = value.length;
    setCurrentIndex(newIndex);

    const charIndex = newIndex - 1;
    if (value[charIndex] !== text[charIndex]) {
      setErrors(prev => new Set([...prev, charIndex]));
    } else {
      setErrors(prev => {
        const newErrors = new Set(prev);
        newErrors.delete(charIndex);
        return newErrors;
      });
    }

    if (newIndex === text.length) {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setText(generateWords());
    setUserInput('');
    setCurrentIndex(0);
    setErrors(new Set());
    setStartTime(null);
    setTimeLeft(selectedTime);
    setIsFinished(false);
    inputRef.current?.focus();
  };

  const handleContainerClick = () => {
    if (!isFinished) inputRef.current?.focus();
  };

  return (
    <div className="w-full text-white max-w-5xl mx-auto px-4 py-8">
      {/* Time Selector */}
      <div className="flex justify-center gap-4 mb-8">
        {TIME_OPTIONS.map((time) => (
          <button
            key={time}
            onClick={() => {
              setSelectedTime(time);
              handleRestart();
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTime === time
              ? 'bg-red-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            {time}s
          </button>
        ))}
      </div>

      {/* Typing Area */}
      <div
        onClick={handleContainerClick}
        className="w-full mb-8 p-8 rounded-2xl cursor-text relative transition-all"
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)', // Red tint
          border: '1px solid rgba(239, 68, 68, 0.2)',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1)',
          opacity: isFinished ? 0.5 : 1
        }}
      >
        <div
          className="text-3xl leading-relaxed tracking-wide select-none"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {text.split('').map((char, index) => {
            let color = '#4b5563'; // Default color for untyped characters
            let decoration = '';

            if (index < currentIndex) {
              color = errors.has(index) ? '#ef4444' : '#e5e7eb'; // Red for error, light gray for correct
            }

            if (index === currentIndex && !isFinished) {
              decoration = '2px solid #ef4444'; // Cursor
            }

            return (
              <span
                key={index}
                style={{
                  color,
                  borderBottom: decoration,
                  transition: 'color 0.1s ease'
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInput}
          className="absolute opacity-0 pointer-events-none"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          disabled={isFinished}
        />
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-center gap-8 mb-4">
        <div className="text-center">
          <div className="text-sm uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>
            WPM
          </div>
          <div className="text-4xl tabular-nums" style={{ color: '#ef4444', fontFamily: "'JetBrains Mono', monospace" }}>
            {getWPM()}
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>
            Accuracy
          </div>
          <div className="text-4xl tabular-nums" style={{ color: '#ffffff', fontFamily: "'JetBrains Mono', monospace" }}>
            {getAccuracy()}%
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm uppercase tracking-wider mb-1" style={{ color: '#9ca3af' }}>
            Time
          </div>
          <div className="text-4xl tabular-nums flex items-center gap-2" style={{ color: '#ffffff', fontFamily: "'JetBrains Mono', monospace" }}>
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Restart Button */}
      <div className="flex justify-center">
        <button
          onClick={handleRestart}
          className="mt-4 px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
          style={{
            backgroundColor: '#ef4444',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
          }}
        >
          <RotateCcw size={20} />
          Restart
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center" style={{ color: '#6b7280' }}>
        <p className="text-sm">Click anywhere on the typing area to start typing</p>
      </div>
    </div>
  );
}
