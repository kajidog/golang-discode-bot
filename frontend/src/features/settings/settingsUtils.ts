import { useEffect, useState } from 'react';
import {
  LoadSettings,
  SaveSettings,
} from '../../../wailsjs/go/settings/Settings';
import { EventsOff, EventsOn } from '../../../wailsjs/runtime/runtime';

export const useSetting = <T>(type: string) => {
  const [settings, setSettings] = useState<{ [key: string]: T } | null>(null);
  const [setting, setSetting] = useState<T | null | undefined>();
  useEffect(() => {
    LoadSettings();
  }, []);

  useEffect(() => {
    EventsOn('settingLoaded', (res: { [key: string]: T }) => {
      setSettings(res);
      setSetting(res?.[type] ?? null);
    });
    return () => {
      EventsOff('settingLoaded');
    };
  }, []);
  const saveConfig = () => {
    setSettings((v) => ({ ...v, [type]: setting! }));
  };
  const change = (next: T) => {
    setSetting(next);
  };
  return {
    setting,
    save: saveConfig,
    change,
  };
};
