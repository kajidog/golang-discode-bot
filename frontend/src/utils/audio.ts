import { SynthesizeAudio } from '../../wailsjs/go/app/App';

let audioContext: any;

const initializeAudioContext = () => {
  audioContext = new AudioContext();
};
export const playAudio = async (text: string, speaker: string) => {
  if (!audioContext) {
    console.warn('AudioContext is not initialized!');
    initializeAudioContext();
  }

  const audioData: any = await SynthesizeAudio(text, speaker);
  const binaryData: ArrayBuffer = Uint8Array.from(atob(audioData), (c) =>
    c.charCodeAt(0)
  ).buffer;
  // // ArrayBufferとしてaudioDataをデコード
  const audioBuffer = await audioContext.decodeAudioData(binaryData);

  // AudioBufferSourceNodeを作成して音声を再生
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();

  return new Promise<void>((resolve) => {
    source.onended = () => {
      resolve();
    };
  });
};
