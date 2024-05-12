import { useEffect, useState } from 'react';

export const useQueue = <T>(
  taskCallback: (task: T) => Promise<void> | void
) => {
  const [queue, setQueue] = useState<T[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // タスクをキューに追加
  const enqueueTask = (task: T) => {
    setQueue((prevQueue) => [...prevQueue, task]);
  };

  // キューからタスクを実行
  const processQueue = async () => {
    if (queue.length > 0 && !isProcessing) {
      setIsProcessing(true);
      const currentTask = queue[0];

      try {
        if (currentTask) {
          await taskCallback(currentTask);
        }
      } catch (error) {
        console.error('Task failed:', currentTask, error);
      }

      // 現在のタスクをキューから削除し、次のタスクへ
      setQueue((prevQueue) => prevQueue.slice(1));
      setIsProcessing(false);
    }
  };

  // キューが更新されるたびに処理を試みる
  useEffect(() => {
    processQueue();
  }, [queue, isProcessing]);

  return { enqueueTask };
};
