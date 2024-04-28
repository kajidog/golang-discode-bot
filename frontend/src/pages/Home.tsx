import {
    NativeSelect,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from "@mui/material";
  import { ChangeEvent, useEffect, useState } from "react";
  import { GetGuilds, GetGuildMembers } from "../../wailsjs/go/main/App";
  import { SynthesizeAudio, FetchSpeakers } from "../../wailsjs/go/main/App";
  import { EventsOn, EventsOff } from "../../wailsjs/runtime/runtime";
  
  let audioContext: any;
  
  const initializeAudioContext = () => {
    audioContext = new AudioContext();
  };
  
  type MessageEvent = {
    username: string;
    content: string;
    id: string;
    speaker: string;
  };
  
  function findObjectByKey<T, K extends keyof T>(
    items: T[],
    key: K,
    value: T[K]
  ): T | undefined {
    return items.find((item) => item[key] === value);
  }
  
  function getObjectByPath<T>(
    items: T[],
    path: string,
    value: any
  ): T | undefined {
    const pathParts = path.split(".");
    return items.find((item) => getValueByPath(item, pathParts) === value);
  }
  
  function getValueByPath<T>(obj: T, pathParts: string[]): any {
    let current: any = obj;
    for (const part of pathParts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[part];
    }
    return current;
  }
  
  const playAudio = async (text: string, speaker: string) => {
    if (!audioContext) {
      console.warn("AudioContext is not initialized!");
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
  
  function App() {
    const [members, setMembers] = useState<any[]>([]);
    const [guilds, setGuilds] = useState<any[]>([]);
    const [selected, setSelected] = useState<string>("");
    const [messages, setMessages] = useState<MessageEvent[]>([]);
    const [voice, setVoice] = useState<any[]>([]);
    const [selectID, setSelectID] = useState<{ [key: string]: string }>(() => {
      const selectID = localStorage.getItem("selectID");
      if (selectID) {
        return JSON.parse(selectID);
      }
      return {};
    });
    const [speaker, setSpeaker] = useState<{ [key: string]: string }>(() => {
      const speaker = localStorage.getItem("speaker");
      if (speaker) {
        return JSON.parse(speaker);
      }
      return {};
    });
    const [queue, setQueue] = useState<MessageEvent[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
  
    ///____________________________________
    ///
    // タスクをキューに追加する関数
    const enqueueTask = (task: MessageEvent) => {
      setQueue((prevQueue) => [...prevQueue, task]);
    };
  
    // キューからタスクを実行する関数
    const processQueue = async () => {
      if (queue.length > 0 && !isProcessing) {
        setIsProcessing(true);
        const currentTask = queue[0];
  
        try {
          if (currentTask) {
            await playAudio(currentTask.content, String(currentTask.speaker || "1"));
          }
        } catch (error) {
          console.error("Task failed:", currentTask, error);
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
  
    ///____________________________________
    ///
  
    // サーバ変更
    const handleChangeServer = (e: ChangeEvent<HTMLSelectElement>) => {
      setSelected(e.target.value);
    };
  
    // メッセージ監視
    useEffect(() => {
      FetchSpeakers().then(setVoice);
      GetGuilds().then(setGuilds);
    }, []);
  
    useEffect(() => {
      EventsOn("messageReceived", (message) => {
        const member = getObjectByPath(members, "user.id", message.id);
        const speaker = selectID[member?.user?.id];
  
        enqueueTask({ ...message, speaker });
        setMessages((prevMessages) => [...prevMessages, { ...message, speaker }]);
      });
  
      return () => {
        EventsOff("messageReceived");
      };
    }, [selectID, members, speaker]);
  
    const handleChangeCharacter = (id: string, speaker: string) => {
      setSpeaker((value) => {
        const next = { ...value, [id]: speaker };
        localStorage.setItem("speaker", JSON.stringify(next));
  
        return next;
      });
      setSelectID((value) => {
        const next = {
          ...value,
          [id]:
            findObjectByKey(voice, "speaker_uuid", speaker)?.styles[0].id || "",
        };
        localStorage.setItem("selectID", JSON.stringify(next));
        return next;
      });
    };
    const handleChangeSelectId = (id: string, speaker: string) => {
      localStorage.setItem("selectID", JSON.stringify(selectID));
      setSelectID((value) => ({ ...value, [id]: speaker }));
    };
  
    // メンバー情報取得
    useEffect(() => {
      selected !== "" &&
        GetGuildMembers(selected)
          .then(setMembers)
          .catch((err) => {
            setMembers([{}]);
          });
      selected === "" && setMembers([]);
    }, [selected]);
  
    // テーブル
    const mapMember = (
      <Paper style={{ width: "100%" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ユーザー名</TableCell>
                <TableCell>読み上げ音声</TableCell>
                <TableCell>スタイル</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member) => (
                <TableRow
                  key={member?.user?.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {member?.user?.global_name || member?.user?.username}
                  </TableCell>
                  <TableCell>
                    <NativeSelect
                      value={speaker[member.user.id]}
                      onChange={(e) => {
                        handleChangeCharacter(
                          member?.user?.id,
                          e.target.value || ""
                        );
                      }}
                      inputProps={{
                        name: "キャラクター",
                        id: "uncontrolled-server",
                      }}
                    >
                      <option value="">読み上げなし</option>
  
                      {voice.map((voice) => (
                        <option
                          value={voice?.speaker_uuid}
                          key={voice?.speaker_uuid}
                        >
                          {voice.name}
                        </option>
                      ))}
                    </NativeSelect>
                  </TableCell>
                  <TableCell>
                    <NativeSelect
                      onChange={(e) => {
                        handleChangeSelectId(
                          member?.user?.id,
                          e.target.value || ""
                        );
                      }}
                      value={selectID[member?.user.id]}
                      inputProps={{
                        name: "スタイル",
                        id: "uncontrolled-server",
                      }}
                    >
                      <option value="">None</option>
  
                      {speaker[member?.user?.id] &&
                        (
                          findObjectByKey(
                            voice,
                            "speaker_uuid",
                            speaker[member?.user?.id]
                          )?.styles || [{ name: "不明", id: "1" }]
                        ).map((style: any) => (
                          <option value={style.id}>{style.name}</option>
                        ))}
                    </NativeSelect>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  
    return (
      <div>
        <div className="p-5">
          <NativeSelect
            defaultValue={selected}
            onChange={handleChangeServer}
            inputProps={{
              name: "サーバー",
              id: "uncontrolled-server",
            }}
          >
            <option value="">None</option>
            {guilds.map((guild) => (
              <option value={guild?.id} key={guild.id}>
                {guild?.name}
              </option>
            ))}
          </NativeSelect>
        </div>
  
        <div className="p-5">{mapMember}</div>
        <div>
          {messages.map(({ username, content, speaker }) => (
            <div key={content}>
              {username}: {content}: {speaker}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default App;
  