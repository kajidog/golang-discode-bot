import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { BrowserLink } from '../../../components/Link';
import { useBot } from '../../../app/bot/BotProvider';
import { EventsOff, EventsOn } from '../../../../wailsjs/runtime/runtime';
import { LoadingButton } from '@mui/lab';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { css } from '@emotion/react';
import { extractCodeFromUrl } from '../../../utils/urls';
import { useOauthCodeCheck } from '../hooks/useOauthCodeCheck';
import { DISCORD_AUTHORIZE_URI } from '../../../context/discord';
const style = {
  tabContent: css({
    padding: '1rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '.5rem',
  }),
  box: css({
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: '1rem',
    gap: '1.5rem',
  }),
  manual: css({
    width: '100%',
  }),
  submit: css({
    width: '100%',
    display: 'flex',
    gap: '.5rem',
    flexDirection: 'column',
  }),
};

interface UserTokenForm {
  next: () => void;
  back?: () => void;
}

export const UserTokenForm: React.FC<UserTokenForm> = (props) => {
  const { clientId, redirectURI } = useBot();
  const [toggle, setToggle] = useState(false);
  const { code, setCode, isSuccess, checkOauthCode, errorMessage } =
    useOauthCodeCheck();

  // Goからコード渡されるの待機
  useEffect(() => {
    EventsOn('codeReceived', (message) => {
      // 受信処理
      const code = extractCodeFromUrl(String(message), 'code');
      if (code) {
        checkOauthCode(code);
      }
    });

    return () => {
      //副作用リフレッシュ
      EventsOff('codeReceived');
    };
  }, []);

  const handleClickVerifyButton = async () => {
    await checkOauthCode();
  };

  const handleChangeUserToken = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCode(e.target.value);
  };

  const TokenManualInput = (
    <>
      <div css={style.manual}>
        <TextField
          fullWidth
          onChange={handleChangeUserToken}
          value={code}
          label="コードを手入力"
          variant="filled"
        />
      </div>
      <div css={style.submit}>
        <LoadingButton
          variant="outlined"
          color={isSuccess ? 'success' : 'secondary'}
          disabled={code.length < 1}
          onClick={isSuccess ? props.next : handleClickVerifyButton}
        >
          {isSuccess ? '成功！次へ' : '検証'}
        </LoadingButton>
        <div>{errorMessage}</div>
      </div>
    </>
  );

  return (
    <div css={style.tabContent}>
      <Typography variant="body1">
        アプリで使用するユーザーを <strong>Discord</strong> で認証します
      </Typography>
      <div css={style.box}>
        <div onClick={() => setToggle(true)} style={{ width: '100%' }}>
          <BrowserLink
            href={DISCORD_AUTHORIZE_URI({
              clientId: clientId ?? '',
              redirectURI: redirectURI ?? '',
            })}
          >
            <LoadingButton
              fullWidth
              loading={!isSuccess && toggle}
              variant="outlined"
              color="primary"
              endIcon={<OpenInNewIcon fontSize="small" />}
              loadingPosition="end"
            >
              Discord 認証
            </LoadingButton>
          </BrowserLink>
        </div>
        <div css={style.submit}>
          {toggle && TokenManualInput}
          {props.back && (
            <LoadingButton
              variant="outlined"
              color="primary"
              onClick={props.back}
            >
              戻る
            </LoadingButton>
          )}
        </div>
      </div>
    </div>
  );
};
export default UserTokenForm;
