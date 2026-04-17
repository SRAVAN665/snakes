import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'NEURAL_SYNTH_V1.wav', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 2, title: 'DEEP_LEARN_PROTOCOL.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
  { id: 3, title: 'ALGORITHMIC_PULSE.flac', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.warn("Autoplay blocked:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="w-full h-full flex flex-row items-center px-4 lg:px-10 justify-between gap-4 font-sans">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={nextTrack}
        crossOrigin="anonymous"
      />

      {/* Now Playing info */}
      <div className="w-[140px] md:w-[200px] flex-shrink-0">
        <h3 className="text-sm text-geo-cyan font-bold">{currentTrack.title}</h3>
        <p className="text-[11px] text-geo-dim mt-1 truncate">Now Streaming | Lossless</p>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <button onClick={prevTrack} className="w-[44px] h-[44px] rounded-full border border-geo-border bg-transparent text-white flex items-center justify-center cursor-pointer hover:border-geo-cyan transition-colors">
          &#171;
        </button>
        <button 
          onClick={togglePlay} 
          className="w-[54px] h-[54px] rounded-full bg-geo-cyan text-geo-bg border-none flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
        >
          {isPlaying ? <span className="font-bold text-xl">&#10074;&#10074;</span> : <span className="font-bold text-xl pl-1">&#9658;</span>}
        </button>
        <button onClick={nextTrack} className="w-[44px] h-[44px] rounded-full border border-geo-border bg-transparent text-white flex items-center justify-center cursor-pointer hover:border-geo-cyan transition-colors">
          &#187;
        </button>
      </div>

      {/* Playback Progress */}
      <div className="hidden md:flex flex-grow max-w-[500px] flex-col justify-center px-4 mx-4">
        <div className="flex justify-between items-center text-[10px] text-geo-dim mb-2 font-mono">
          <span>00:00</span>
          <span>...</span>
        </div>
        <div className="h-[4px] bg-geo-border relative w-full overflow-hidden">
          <div className="h-full bg-geo-cyan transition-all duration-[linear]" style={{ width: isPlaying ? '100%' : '15%', transitionDuration: isPlaying ? '300s' : '0s' }}></div>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 w-[100px] flex-shrink-0">
        <span 
          className="text-[12px] text-geo-dim cursor-pointer font-bold" 
          onClick={() => setIsMuted(!isMuted)}
        >
          VOL
        </span>
        <div className="h-[4px] bg-geo-border relative w-[60px] flex-grow inline-block">
          <input 
            type="range" 
            min="0" max="1" step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="h-full bg-geo-magenta pointer-events-none" style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}></div>
        </div>
      </div>
    
    </div>
  );
}
