import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { BrowserLink } from "../../../components/Link";
import { useBot } from "../../../app/bot/BotProvider";
import { EventsOff, EventsOn } from "../../../../wailsjs/runtime/runtime";
import { LoadingButton } from "@mui/lab";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { css } from "@emotion/react";
import { extractCodeFromUrl } from "../../../utils/urls";

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
  const [userToken, setUserToken] = useState("");

  useEffect(() => {
    EventsOn("codeReceived", (message) => {
      alert(message);
      const code = extractCodeFromUrl(String(message), "code");
      if (code) {
        setUserToken(code);
      }
    });

    return () => {
      EventsOff("codeReceived");
    };
  }, []);

  const handleChangeUserToken = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUserToken(e.target.value);
  };
  const TokenManualInput = (
    <>
      <div css={style.manual}>
        <TextField
          fullWidth
          onChange={handleChangeUserToken}
          value={userToken}
          label="トークンを手入力"
          variant="filled"
        />
      </div>
      <div css={style.submit}>
        <LoadingButton
          variant="outlined"
          color="secondary"
          type="submit"
          disabled={userToken.length < 1}
        >
          検証
        </LoadingButton>
      </div>
    </>
  );

  return (
    <div css={style.tabContent}>
      <Typography variant="body1">アプリで使用するユーザーを設定</Typography>
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
