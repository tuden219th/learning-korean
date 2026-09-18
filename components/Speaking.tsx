"use client";

import { useEffect, useRef, useState } from "react";
import type { SpeakingActivity } from "../types/content";

export default function Speaking({ activity }: { activity: SpeakingActivity }) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => {
    recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  async function startRecording() {
    setError(null);
    if (!("MediaRecorder" in window) || !navigator.mediaDevices?.getUserMedia) {
      setError("Trình duyệt này không hỗ trợ ghi âm.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => event.data.size > 0 && chunksRef.current.push(event.data);
      recorder.onstop = () => {
        const url = URL.createObjectURL(new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" }));
        setAudioUrl((previous) => {
          if (previous) URL.revokeObjectURL(previous);
          return url;
        });
        stream.getTracks().forEach((track) => track.stop());
      };
      recorderRef.current = recorder;
      streamRef.current = stream;
      recorder.start();
      setRecording(true);
    } catch {
      setError("Không thể dùng microphone. Hãy cấp quyền và thử lại.");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  function clearRecording() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
  }

  return (
    <section className="p-4 border rounded space-y-4" aria-labelledby={`${activity.id}-title`}>
      <h3 id={`${activity.id}-title`} className="text-lg font-semibold">{activity.title}</h3>
      <p>{activity.prompt}</p>
      <p className="text-sm text-zinc-600">Mẫu tham khảo: {activity.reference}</p>
      <div className="flex flex-wrap gap-2">
        <button className="px-3 py-2 border rounded" onClick={recording ? stopRecording : startRecording}>
          {recording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
        </button>
        {audioUrl && <button className="px-3 py-2 border rounded" onClick={clearRecording}>Xóa bản ghi</button>}
      </div>
      {audioUrl && <audio controls src={audioUrl} className="w-full" />}
      {error && <p role="alert" className="text-red-700">{error}</p>}
    </section>
  );
}