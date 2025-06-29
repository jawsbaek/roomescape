import { useGameStore } from "@/stores/gameStore";
import { Howl, Howler } from "howler";
import { useCallback, useEffect, useRef } from "react";

interface SoundConfig {
  src: string;
  volume?: number;
  loop?: boolean;
  sprite?: { [key: string]: [number, number] };
}

interface GameSounds {
  backgroundMusic: SoundConfig;
  clickSound: SoundConfig;
  successSound: SoundConfig;
  errorSound: SoundConfig;
  collectSound: SoundConfig;
  unlockSound: SoundConfig;
  hintSound: SoundConfig;
  ambientSounds: { [theme: string]: SoundConfig };
}

const GAME_SOUNDS: GameSounds = {
  backgroundMusic: {
    src: "/sounds/background-music.mp3",
    volume: 0.5,
    loop: true,
  },
  clickSound: {
    src: "/sounds/click.mp3",
    volume: 0.7,
  },
  successSound: {
    src: "/sounds/success.mp3",
    volume: 0.8,
  },
  errorSound: {
    src: "/sounds/error.mp3",
    volume: 0.6,
  },
  collectSound: {
    src: "/sounds/collect.mp3",
    volume: 0.7,
  },
  unlockSound: {
    src: "/sounds/unlock.mp3",
    volume: 0.8,
  },
  hintSound: {
    src: "/sounds/hint.mp3",
    volume: 0.6,
  },
  ambientSounds: {
    mystery: {
      src: "/sounds/ambient/mystery.mp3",
      volume: 0.3,
      loop: true,
    },
    horror: {
      src: "/sounds/ambient/horror.mp3",
      volume: 0.4,
      loop: true,
    },
    adventure: {
      src: "/sounds/ambient/adventure.mp3",
      volume: 0.3,
      loop: true,
    },
    "sci-fi": {
      src: "/sounds/ambient/sci-fi.mp3",
      volume: 0.3,
      loop: true,
    },
    puzzle: {
      src: "/sounds/ambient/puzzle.mp3",
      volume: 0.2,
      loop: true,
    },
  },
};

export function useGameSound() {
  const { soundEnabled, musicVolume, sfxVolume, currentRoom } = useGameStore();
  const soundsRef = useRef<{ [key: string]: Howl }>({});
  const currentMusicRef = useRef<Howl | null>(null);
  const currentAmbientRef = useRef<Howl | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // 타임아웃 정리 함수
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);

  // 사운드 초기화
  useEffect(() => {
    // 전역 볼륨 설정
    Howler.volume(soundEnabled ? 1 : 0);

    // 기본 사운드들 미리 로드
    const loadSound = (key: string, config: SoundConfig) => {
      if (!soundsRef.current[key]) {
        soundsRef.current[key] = new Howl({
          src: [config.src],
          volume: config.volume || 1,
          loop: config.loop || false,
          sprite: config.sprite,
          preload: true,
        });
      }
    };

    // 효과음들 로드
    loadSound("click", GAME_SOUNDS.clickSound);
    loadSound("success", GAME_SOUNDS.successSound);
    loadSound("error", GAME_SOUNDS.errorSound);
    loadSound("collect", GAME_SOUNDS.collectSound);
    loadSound("unlock", GAME_SOUNDS.unlockSound);
    loadSound("hint", GAME_SOUNDS.hintSound);

    // 배경음악 로드
    if (!currentMusicRef.current) {
      currentMusicRef.current = new Howl({
        src: [GAME_SOUNDS.backgroundMusic.src],
        volume: (GAME_SOUNDS.backgroundMusic.volume || 1) * musicVolume,
        loop: true,
        preload: true,
      });
    }

    return () => {
      // 컴포넌트 언마운트 시 모든 사운드 정지
      clearAllTimeouts();
      const sounds = soundsRef.current;
      Object.values(sounds).forEach((sound) => {
        sound.stop();
        sound.unload();
      });
      currentMusicRef.current?.stop();
      currentMusicRef.current?.unload();
      currentAmbientRef.current?.stop();
      currentAmbientRef.current?.unload();
    };
  }, [musicVolume, soundEnabled, clearAllTimeouts]);

  // 볼륨 설정 업데이트
  useEffect(() => {
    Howler.volume(soundEnabled ? 1 : 0);

    if (currentMusicRef.current) {
      currentMusicRef.current.volume(musicVolume);
    }

    Object.entries(soundsRef.current).forEach(([key, sound]) => {
      if (key !== "backgroundMusic") {
        const soundKey = key as keyof typeof GAME_SOUNDS;
        const originalConfig = GAME_SOUNDS[soundKey] as SoundConfig;
        const originalVolume = originalConfig?.volume || 1;
        sound.volume(originalVolume * sfxVolume);
      }
    });
  }, [soundEnabled, musicVolume, sfxVolume]);

  // 현재 방에 따른 앰비언트 사운드 변경
  useEffect(() => {
    clearAllTimeouts();

    if (currentRoom?.theme) {
      const ambientConfig = GAME_SOUNDS.ambientSounds[currentRoom.theme];
      if (ambientConfig) {
        if (currentAmbientRef.current) {
          currentAmbientRef.current.fade(currentAmbientRef.current.volume(), 0, 1000);
          const stopTimeout = setTimeout(() => {
            currentAmbientRef.current?.stop();
          }, 1000);
          timeoutsRef.current.push(stopTimeout);
        }

        currentAmbientRef.current = new Howl({
          src: [ambientConfig.src],
          volume: 0,
          loop: true,
          preload: true,
        });

        currentAmbientRef.current.play();
        currentAmbientRef.current.fade(
          0,
          (ambientConfig.volume || 1) * musicVolume,
          2000,
        );
      }
    } else if (currentAmbientRef.current) {
      currentAmbientRef.current.fade(currentAmbientRef.current.volume(), 0, 1000);
      const stopTimeout = setTimeout(() => {
        currentAmbientRef.current?.stop();
      }, 1000);
      timeoutsRef.current.push(stopTimeout);
    }

    // 클린업 함수에서 현재 effect의 timeout들을 정리
    return () => {
      clearAllTimeouts();
    };
  }, [currentRoom?.theme, musicVolume, clearAllTimeouts]);

  // 사운드 재생 함수들
  const playSound = useCallback(
    (soundKey: string, options?: { volume?: number; rate?: number }) => {
      if (!soundEnabled) return;

      const sound = soundsRef.current[soundKey];
      if (sound) {
        if (options?.volume !== undefined) {
          sound.volume(options.volume * sfxVolume);
        }
        if (options?.rate !== undefined) {
          sound.rate(options.rate);
        }
        sound.play();
      }
    },
    [soundEnabled, sfxVolume],
  );

  const playBackgroundMusic = useCallback(() => {
    if (!soundEnabled || !currentMusicRef.current) return;

    if (!currentMusicRef.current.playing()) {
      currentMusicRef.current.play();
    }
  }, [soundEnabled]);

  const stopBackgroundMusic = useCallback(() => {
    if (currentMusicRef.current?.playing()) {
      currentMusicRef.current.fade(currentMusicRef.current.volume(), 0, 1000);
      const stopTimeout = setTimeout(() => {
        currentMusicRef.current?.stop();
      }, 1000);
      timeoutsRef.current.push(stopTimeout);
    }
  }, []);

  const pauseBackgroundMusic = useCallback(() => {
    if (currentMusicRef.current?.playing()) {
      currentMusicRef.current.pause();
    }
  }, []);

  const resumeBackgroundMusic = useCallback(() => {
    if (currentMusicRef.current && !currentMusicRef.current.playing()) {
      currentMusicRef.current.play();
    }
  }, []);

  // 게임 이벤트별 사운드 재생 함수들
  const playClickSound = useCallback(() => playSound("click"), [playSound]);
  const playSuccessSound = useCallback(() => playSound("success"), [playSound]);
  const playErrorSound = useCallback(() => playSound("error"), [playSound]);
  const playCollectSound = useCallback(() => playSound("collect"), [playSound]);
  const playUnlockSound = useCallback(() => playSound("unlock"), [playSound]);
  const playHintSound = useCallback(() => playSound("hint"), [playSound]);

  // 사운드 시퀀스 재생 (여러 사운드를 순차적으로)
  const playSoundSequence = useCallback(
    (
      sounds: Array<{
        key: string;
        delay: number;
        options?: { volume?: number; rate?: number };
      }>,
    ) => {
      sounds.forEach(({ key, delay, options }) => {
        const timeout = setTimeout(() => {
          playSound(key, options);
        }, delay);
        timeoutsRef.current.push(timeout);
      });
    },
    [playSound],
  );

  return {
    // 기본 사운드 제어
    playSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,

    // 게임 이벤트 사운드
    playClickSound,
    playSuccessSound,
    playErrorSound,
    playCollectSound,
    playUnlockSound,
    playHintSound,

    // 고급 기능
    playSoundSequence,

    // 상태
    isPlaying: currentMusicRef.current?.playing() || false,
    soundEnabled,
  };
}
