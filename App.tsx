import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AppMode, GenerationSize, AppState } from './types';
import { STRANGER_THINGS_PROMPT } from './constants';
import * as geminiService from './services/geminiService';
import ChristmasLights from './components/ChristmasLights';
import VHSOverlay from './components/VHSOverlay';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    mode: AppMode.GENERATE,
    status: 'idle',
    originalImage: null,
    result: null,
    error: null,
    editPrompt: '',
    generationSize: GenerationSize.OneK,
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, []);

  const safePlayAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((error) => {
          // Auto-play was prevented or operation interrupted.
          // This is often benign (e.g., user clicked pause immediately).
          console.log("Audio playback prevented/interrupted:", error.message);
          setIsMusicPlaying(false);
        });
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      safePlayAudio();
    } else {
      audio.pause();
      setIsMusicPlaying(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState((prev) => ({
          ...prev,
          originalImage: reader.result as string,
          status: 'idle',
          result: null,
          error: null,
        }));
        // Play sound effect (optional/mock)
        const audio = new Audio('https://www.soundjay.com/mechanical/sounds/mechanical-clank-1.mp3');
        audio.volume = 0.2;
        audio.play().catch(() => {});
        
        // Auto-start background music if not playing (user interaction occurred)
        if (audioRef.current && audioRef.current.paused) {
          safePlayAudio();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState((prev) => ({
          ...prev,
          originalImage: reader.result as string,
          status: 'idle',
          result: null,
          error: null,
        }));
        // Auto-start background music
        if (audioRef.current && audioRef.current.paused) {
           safePlayAudio();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setState((prev) => ({
      ...prev,
      originalImage: null,
      result: null,
      error: null,
      status: 'idle'
    }));
  };

  const processImage = async () => {
    if (!state.originalImage) return;

    setState((prev) => ({ ...prev, status: 'processing', error: null }));

    try {
      if (state.mode === AppMode.GENERATE) {
        // Feature: Generate images with Nano Banana Pro (Gemini 3 Pro Image)
        const imageUrl = await geminiService.generatePoster(
          state.originalImage,
          STRANGER_THINGS_PROMPT,
          state.generationSize
        );
        setState((prev) => ({
          ...prev,
          status: 'success',
          result: { imageUrl },
        }));
      } else if (state.mode === AppMode.EDIT) {
        // Feature: Nano banana powered app (Editing)
        if (!state.editPrompt) throw new Error("Please enter a prompt to edit.");
        const imageUrl = await geminiService.editImage(
          state.originalImage,
          state.editPrompt
        );
        setState((prev) => ({
          ...prev,
          status: 'success',
          result: { imageUrl },
        }));
      } else if (state.mode === AppMode.ANALYZE) {
        // Feature: Analyze images
        const text = await geminiService.analyzeImage(state.originalImage);
        setState((prev) => ({
          ...prev,
          status: 'success',
          result: { text },
        }));
      }
    } catch (err: any) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: err.message || "Something went wrong in the Upside Down.",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-stBlack text-gray-200 font-mono relative overflow-x-hidden">
      <ChristmasLights />
      <VHSOverlay />
      
      {/* Background Audio - Using reliable sources */}
      <audio ref={audioRef} loop>
          <source src="https://actions.google.com/sounds/v1/horror/horror_ambience.ogg" type="audio/ogg" />
          <source src="https://ia800501.us.archive.org/11/items/StrangerThingsThemeSong/Stranger%20Things%20Theme%20Song.mp3" type="audio/mpeg" />
      </audio>

      {/* Audio Toggle */}
      <button 
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 text-stRed opacity-50 hover:opacity-100 transition-opacity p-2 border border-stRed/30 rounded-full"
        title={isMusicPlaying ? "Mute Atmosphere" : "Enable Atmosphere"}
      >
        {isMusicPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        )}
      </button>

      {/* Background Particles/Atmosphere */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-64 md:h-64 bg-red-900 rounded-full blur-[80px] md:blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-stRed rounded-full blur-[100px] md:blur-[120px] opacity-40 animate-flicker"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-10 md:py-20 flex flex-col items-center max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-flicker w-full">
          <h1 className="font-title text-5xl sm:text-6xl md:text-8xl text-stRed drop-shadow-[0_0_15px_rgba(224,6,31,0.8)] mb-2 md:mb-4 tracking-widest break-words leading-tight">
            THE UPSIDE DOWN
          </h1>
          <p className="text-stTeal font-serif italic text-sm md:text-xl tracking-wider">
            PORTAL GENERATOR • SEASON 5
          </p>
        </div>

        {/* Navigation / Mode Switcher */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-10 w-full">
          {[
            { id: AppMode.GENERATE, label: 'CREATE POSTER' },
            { id: AppMode.EDIT, label: 'EDIT REALITY' },
            { id: AppMode.ANALYZE, label: 'INVESTIGATE' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setState(prev => ({ ...prev, mode: item.id, result: null, error: null }))}
              className={`
                px-4 py-2 md:px-6 md:py-3 border-2 transition-all duration-300 transform hover:scale-105 uppercase font-bold tracking-widest text-xs md:text-base flex-1 md:flex-none whitespace-nowrap
                ${state.mode === item.id 
                  ? 'border-stRed bg-red-900/30 text-stRed shadow-[0_0_15px_rgba(224,6,31,0.5)]' 
                  : 'border-gray-700 text-gray-500 hover:border-stTeal hover:text-stTeal'}
              `}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="w-full bg-black/80 border border-gray-800 p-4 md:p-8 rounded-lg shadow-2xl relative min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center backdrop-blur-sm">
          
          {/* UPLOAD STATE */}
          {!state.originalImage && (
            <div 
              className="w-full h-64 md:h-96 border-4 border-dashed border-stRed/40 hover:border-stRed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group bg-gradient-to-b from-transparent to-red-900/10 p-4 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-4xl md:text-6xl mb-2 md:mb-4 group-hover:scale-110 transition-transform">👹</div>
              <h2 className="font-serif text-lg md:text-2xl text-stRed mb-2 group-hover:text-red-400">DRAG YOUR SELFIE INTO THE UPSIDE DOWN</h2>
              <p className="text-gray-500 text-xs md:text-sm">Or click to open the rift</p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </div>
          )}

          {/* PREVIEW & ACTIONS STATE */}
          {state.originalImage && !state.result && (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-700">
              <div className="relative mb-6 md:mb-8 group max-w-full">
                 <img 
                  src={state.originalImage} 
                  alt="Original" 
                  className="max-h-[300px] md:max-h-[400px] w-full object-contain rounded border-2 border-gray-700 shadow-xl opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <button 
                  onClick={reset}
                  className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 border border-black shadow-md z-10"
                >
                  ✕
                </button>
              </div>

              {/* Mode Specific Controls */}
              <div className="w-full max-w-lg space-y-4 md:space-y-6">
                
                {state.mode === AppMode.GENERATE && (
                  <div className="flex flex-col gap-2 md:gap-4">
                    <label className="text-stTeal text-xs md:text-sm font-bold uppercase tracking-wider">Select Quality Level</label>
                    <div className="flex justify-between bg-gray-900 p-1 rounded border border-gray-700">
                      {Object.values(GenerationSize).map((size) => (
                        <button
                          key={size}
                          onClick={() => setState(prev => ({ ...prev, generationSize: size }))}
                          className={`flex-1 py-2 rounded text-xs md:text-sm font-bold transition-colors ${state.generationSize === size ? 'bg-stRed text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {state.mode === AppMode.EDIT && (
                  <div className="flex flex-col gap-2 md:gap-4">
                     <label className="text-stTeal text-xs md:text-sm font-bold uppercase tracking-wider">What should change?</label>
                    <input
                      type="text"
                      value={state.editPrompt}
                      onChange={(e) => setState(prev => ({ ...prev, editPrompt: e.target.value }))}
                      placeholder="e.g., Add a retro filter..."
                      className="w-full bg-gray-900 border border-stRed/50 text-white p-3 md:p-4 rounded focus:outline-none focus:border-stRed focus:ring-1 focus:ring-stRed placeholder-gray-600 text-sm md:text-base"
                    />
                  </div>
                )}

                {state.mode === AppMode.ANALYZE && (
                  <p className="text-center text-gray-400 italic text-sm md:text-base px-4">
                    Ready to investigate this image for paranormal activity?
                  </p>
                )}

                <button
                  onClick={processImage}
                  disabled={state.status === 'processing'}
                  className={`
                    w-full py-3 md:py-4 text-lg md:text-xl font-bold uppercase tracking-[0.2em] relative overflow-hidden group
                    bg-stRed text-black hover:bg-red-600 transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-[0_0_10px_rgba(224,6,31,0.4)]
                  `}
                >
                  {state.status === 'processing' ? (
                    <span className="animate-pulse">Breaching Portal...</span>
                  ) : (
                    <span>
                      {state.mode === AppMode.GENERATE ? 'Generate Poster' : 
                       state.mode === AppMode.EDIT ? 'Warp Reality' : 'Analyze Evidence'}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* RESULT STATE */}
          {state.result && (
             <div className="w-full flex flex-col items-center animate-in zoom-in duration-500">
                {state.result.imageUrl && (
                  <div className="relative mb-6 w-full flex justify-center">
                    <img 
                      src={state.result.imageUrl} 
                      alt="Result" 
                      className="max-h-[400px] md:max-h-[600px] w-full object-contain rounded border-4 border-stRed shadow-[0_0_30px_rgba(224,6,31,0.6)]"
                    />
                     <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  </div>
                )}

                {state.result.text && (
                  <div className="bg-gray-900/90 border-l-4 border-stRed p-4 md:p-6 max-w-2xl rounded shadow-lg mb-6 overflow-y-auto max-h-[300px]">
                     <h3 className="text-stRed font-title text-xl md:text-2xl mb-2 md:mb-4 tracking-wider">INVESTIGATION REPORT</h3>
                     <p className="whitespace-pre-wrap leading-relaxed font-serif text-sm md:text-lg">{state.result.text}</p>
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                  <button 
                    onClick={reset}
                    className="w-full md:w-auto px-8 py-3 border border-gray-600 hover:border-white text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-center"
                  >
                    Close Rift
                  </button>
                  {state.result.imageUrl && (
                    <a 
                      href={state.result.imageUrl} 
                      download="stranger-things-poster.png"
                      className="w-full md:w-auto px-8 py-3 bg-stTeal text-black hover:bg-cyan-300 transition-colors uppercase font-bold tracking-widest shadow-[0_0_15px_rgba(0,255,255,0.4)] text-center"
                    >
                      Download {state.generationSize}
                    </a>
                  )}
                </div>
             </div>
          )}

          {/* Error Message */}
          {state.error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded max-w-lg text-center text-sm md:text-base">
              <p className="font-bold mb-2">⚠ PORTAL ERROR</p>
              {state.error}
              <button onClick={() => setState(prev => ({ ...prev, error: null, status: 'idle' }))} className="block mx-auto mt-4 text-xs underline">Try Again</button>
            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="mt-10 md:mt-16 text-center text-gray-600 text-xs md:text-sm tracking-widest uppercase">
          <div className="animate-pulse mb-2 text-stRed">Coming 2026</div>
          <div className="flex justify-center items-center gap-2 mb-2">
             <span className="font-bold text-red-700 text-lg md:text-xl">N</span>
             <span>Netflix © 1985-2025</span>
          </div>
          <div className="text-gray-500 text-[10px] md:text-xs opacity-70">
            Developed by Tarunjit Biswas
          </div>
        </footer>

      </main>
    </div>
  );
};

export default App;