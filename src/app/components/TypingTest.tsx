'use client';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';

const WORD_POOLS = {
  easy: [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what'
  ],
  medium: [
    'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like',
    'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
    'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look',
    'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two'
  ],
  hard: [
    'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
    'any', 'these', 'give', 'day', 'most', 'us', 'program', 'function', 'variable', 'string',
    'number', 'array', 'object', 'class', 'method', 'return', 'import', 'export', 'const', 'let',
    'interface', 'type', 'asynchronous', 'callback', 'promise', 'middleware', 'optimization', 'constructor'
  ]
};

const TIME_OPTIONS = [15, 30, 60];

export function TypingTest() {
  const { data: session } = useSession();
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedTime, setSelectedTime] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [settings, setSettings] = useState({
    wordCount: 50,
    difficulty: 'medium',
    soundEnabled: true
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    const savedWordCount = localStorage.getItem('typing_wordCount');
    const savedDifficulty = localStorage.getItem('typing_difficulty');
    const savedSound = localStorage.getItem('typing_soundEnabled');

    const newSettings = {
      wordCount: savedWordCount ? parseInt(savedWordCount) : 50,
      difficulty: (savedDifficulty as 'easy' | 'medium' | 'hard') || 'medium',
      soundEnabled: savedSound === 'true'
    };

    setSettings(newSettings);
    generateTestWords(newSettings.wordCount, newSettings.difficulty);
  }, []);

  const generateTestWords = (count: number, diff: 'easy' | 'medium' | 'hard') => {
    const pool = WORD_POOLS[diff] || WORD_POOLS.medium;
    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomWord = pool[Math.floor(Math.random() * pool.length)];
      words.push(randomWord);
    }
    setText(words.join(' '));
  };

  const playSound = (isError: boolean) => {
    if (!settings.soundEnabled) return;

    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const oscillator = audioCtx.current.createOscillator();
    const gainNode = audioCtx.current.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(isError ? 150 : 440, audioCtx.current.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioCtx.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.current.destination);

    oscillator.start();
    oscillator.stop(audioCtx.current.currentTime + 0.1);
  };

  const getWPM = () => {
    const elapsed = selectedTime - timeLeft;
    if (elapsed <= 0) return 0;
    const minutes = elapsed / 60;
    return Math.round((correctKeystrokes / 5) / minutes);
  };

  const getRawWPM = () => {
    const elapsed = selectedTime - timeLeft;
    if (elapsed <= 0) return 0;
    const minutes = elapsed / 60;
    return Math.round((totalKeystrokes / 5) / minutes);
  };

  const getAccuracy = () => {
    if (totalKeystrokes === 0) return 100;
    return Math.round((correctKeystrokes / totalKeystrokes) * 100);
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

  useEffect(() => {
    if (isFinished && session?.user && currentIndex > 0) {
      const saveResult = async () => {
        try {
          await axios.post('/api/results', {
            wpm: getWPM(),
            accuracy: getAccuracy(),
            time: selectedTime,
          });
        } catch (err) {
          console.error('Failed to save result', err);
        }
      };
      saveResult();
    }
  }, [isFinished, session]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const value = e.target.value;

    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }

    if (value.length < userInput.length) {
      setTotalKeystrokes(prev => prev + 1);
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

    const charIndex = value.length - 1;
    const isCorrect = value[charIndex] === text[charIndex];

    setTotalKeystrokes(prev => prev + 1);
    if (isCorrect) {
      setCorrectKeystrokes(prev => prev + 1);
    }

    playSound(!isCorrect);
    setUserInput(value);
    setCurrentIndex(value.length);

    if (!isCorrect) {
      setErrors(prev => new Set([...prev, charIndex]));
    } else {
      setErrors(prev => {
        const newErrors = new Set(prev);
        newErrors.delete(charIndex);
        return newErrors;
      });
    }

    if (value.length === text.length) {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    generateTestWords(settings.wordCount, settings.difficulty as 'easy' | 'medium' | 'hard');
    setUserInput('');
    setCurrentIndex(0);
    setErrors(new Set());
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
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

      <div
        onClick={handleContainerClick}
        className="w-full mb-8 p-8 rounded-2xl cursor-text relative transition-all"
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1)',
          opacity: isFinished ? 0.5 : 1
        }}
      >
        <div
          className="text-2xl leading-relaxed tracking-wider select-none relative"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {text.split('').map((char, index) => {
            let color = '#646669';

            if (index < currentIndex) {
              color = errors.has(index) ? '#ca4754' : '#d1d0c5';
            }

            return (
              <span
                key={index}
                className="relative"
                style={{
                  color,
                  transition: 'color 0.1s ease'
                }}
              >
                {index === currentIndex && !isFinished && (
                  <span
                    className="absolute -left-[1px] top-[10%] bottom-[10%] w-[2px] bg-[#ef4444] animate-pulse"
                    style={{ zIndex: 10 }}
                  />
                )}
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
            Raw
          </div>
          <div className="text-4xl tabular-nums" style={{ color: '#ffffff', fontFamily: "'JetBrains Mono', monospace" }}>
            {getRawWPM()}
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

      <div className="mt-8 text-center" style={{ color: '#6b7280' }}>
        <p className="text-sm">Click anywhere on the typing area to start typing</p>
        <p className="text-xs mt-2 italic">Settings: {settings.difficulty} difficulty, {settings.wordCount} words, audio {settings.soundEnabled ? 'on' : 'off'}</p>
      </div>
    </div>
  );
}
