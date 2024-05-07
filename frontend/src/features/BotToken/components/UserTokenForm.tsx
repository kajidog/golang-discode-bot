import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { BrowserLink } from "../../../components/Link";
import { useBot } from "../../../app/bot/BotProvider";
import { EventsOff, EventsOn } from "../../../../wailsjs/runtime/runtime";
import { LoadingButton } from "@mui/lab";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { css } from "@emotion/react";
import { extractCodeFromUrl } from "../../../utils/urls";
import { useOauthCodeCheck } from "../hooks/useOauthCodeCheck";

const style = {
  tabContent: css({
    padding: "1rem 0",
    display: "flex",
    flexDirection: "column",
    gap: ".5rem",
  }),
  box: css({
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: "1rem",
    gap: "1.5rem",
  }),
  manual: css({
    width: "100%",
  }),
  submit: css({
    width: "100%",
    display: "flex",
    flexDirection: "column",
  }),
};

interface UserTokenForm {
  next: () => void;
}

export const UserTokenForm: React.FC<UserTokenForm> = (props) => {
  const { clientId, redirectURI } = useBot();
  const [toggle, setToggle] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { code, setCode, result, checkOauthCode } = useOauthCodeCheck();

  useEffect(() => {
    if (result) {
      console.log(result);
      setIsSuccess(true);
    }
  }, [result]);

  useEffect(() => {
    setIsSuccess(false);
  }, [code]);

  // Goからコード渡されるの待機
  useEffect(() => {
    EventsOn("codeReceived", (message) => {
      // 受信処理
      alert(message);
      const code = extractCodeFromUrl(String(message), "code");
      if (code) {
        setCode(code);
        checkOauthCode();
      }
    });

    return () => {
      //副作用リフレッシュ
      EventsOff("codeReceived");
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
          color={isSuccess ? "success" : "secondary"}
          disabled={code.length < 1}
          onClick={isSuccess ? props.next : handleClickVerifyButton}
        >
          {isSuccess ? "成功！次へ" : "検証"}
        </LoadingButton>
      </div>
    </>
  );

  return (
    <div css={style.tabContent}>
      <Typography variant="body1">アプリで使用するユーザーを連携</Typography>
      <div css={style.box}>
        <div onClick={() => setToggle(true)}>
          <BrowserLink
            href={`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=code&scope=identify+guilds`}
          >
            <LoadingButton
              fullWidth
              loading={toggle}
              variant="outlined"
              color="primary"
              endIcon={<OpenInNewIcon fontSize="small" />}
              loadingPosition="end"
            >
              Discord 認証
            </LoadingButton>
          </BrowserLink>
        </div>
        {toggle && TokenManualInput}
      </div>
    </div>
  );
};
export default UserTokenForm;
