'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { FSRS, generatorParameters, type Card, type RecordLog } from 'ts-fsrs';
import type { FsrsWorkerRequest, FsrsWorkerResponse } from '@/workers/fsrs.worker';

/**
 * useFsrsScheduler Hook
 * Cung cấp cầu nối bất đồng bộ giữa React Component và FSRS Web Worker:
 * - Tự động khởi tạo và dọn dẹp Web Worker
 * - Cơ chế fallback tự động về Main Thread nếu môi trường không hỗ trợ Web Worker (SSR/Test)
 * - Tối ưu hóa INP < 25ms khi người dùng chấm điểm thẻ (Again, Hard, Good, Easy)
 */
export function useFsrsScheduler() {
  const workerRef = useRef<Worker | null>(null);
  const pendingRequests = useRef<Map<string, (result: RecordLog) => void>>(new Map());
  const [isReady, setIsReady] = useState(false);
  const fallbackFsrsRef = useRef<FSRS | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') {
      fallbackFsrsRef.current = new FSRS(generatorParameters());
      setIsReady(true);
      return;
    }

    try {
      const worker = new Worker(
        new URL('../workers/fsrs.worker.ts', import.meta.url),
        { type: 'module' }
      );

      worker.onmessage = (event: MessageEvent<FsrsWorkerResponse>) => {
        const { id, nextStates, error } = event.data;
        const resolver = pendingRequests.current.get(id);
        if (resolver) {
          pendingRequests.current.delete(id);
          if (!error && nextStates) {
            resolver(nextStates);
          }
        }
      };

      worker.onerror = (err) => {
        console.warn('[FSRS Worker Error, falling back to main thread]', err);
        fallbackFsrsRef.current = new FSRS(generatorParameters());
      };

      workerRef.current = worker;
      setIsReady(true);

      return () => {
        worker.terminate();
        workerRef.current = null;
      };
    } catch (e) {
      console.warn('[FSRS Worker Init Failed, falling back to main thread]', e);
      fallbackFsrsRef.current = new FSRS(generatorParameters());
      setIsReady(true);
    }
  }, []);

  const calculateNextReview = useCallback(
    (card: Card, now: number = Date.now()): Promise<RecordLog> => {
      return new Promise((resolve) => {
        if (workerRef.current) {
          const requestId =
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : `${Date.now()}-${Math.random()}`;

          pendingRequests.current.set(requestId, resolve);

          workerRef.current.postMessage({
            id: requestId,
            card,
            now,
          } as FsrsWorkerRequest);
        } else {
          if (!fallbackFsrsRef.current) {
            fallbackFsrsRef.current = new FSRS(generatorParameters());
          }
          const result = fallbackFsrsRef.current.repeat(card, new Date(now));
          resolve(result);
        }
      });
    },
    []
  );

  return { calculateNextReview, isReady };
}
