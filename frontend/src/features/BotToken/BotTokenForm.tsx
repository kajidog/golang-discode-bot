import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tokenSchema } from "./schemas";
import { useBot } from "../../app/bot/BotProvider";
import {
  Button,
  Link,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  css,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BrowserLink } from "../../components/Link";

const style = {
  page: css({
    padding: "0rem 1rem",
    minWidth: "30rem",
  }),
  tabContent: css({
    padding: "1rem 0",
    display: "flex",
    flexDirection: "column",
    gap: ".5rem",
  }),
  form: css({
    paddingTop: ".5rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  }),
};

interface BotTokenForm {}
export const BotTokenForm: React.FC<BotTokenForm> = () => {
  const { setToken, token } = useBot();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(tokenSchema),
    defaultValues: { token: token ?? "" },
  });
  const setBotToken = async (value: { token: string }) => {
    try {
      await setToken(value.token);
      console.log("su");

      navigate("/");
    } catch (err) {
      setError(
        "token",
        {
          message: String(err),
        },
        {
          shouldFocus: true,
        }
      );
    }
  };

  return (
    <Paper elevation={3} css={style.page}>
      <Tabs
        scrollButtons="auto"
        variant="fullWidth"
        aria-label="scrollable auto tabs example"
        value="token"
      >
        <Tab label="Bot_Token" value="token" />
      </Tabs>
      <div css={style.tabContent}>
        <Typography variant="body1">
          使用するDiscordアプリのトークンを入力
        </Typography>
        <Typography variant="body2">
          管理者の人は
          <BrowserLink href="https://discord.com/developers/applications">
            こちら
          </BrowserLink>
          から確認できます
        </Typography>
        <form onSubmit={handleSubmit(setBotToken)}>
          <div css={style.form}>
            <TextField
              variant="outlined"
              fullWidth
              id="bot-form-token"
              label="トークン"
              error={!!errors.token?.message}
              helperText={errors.token?.message}
              {...register("token")}
              defaultValue={token ?? ""}
            />
            <Button variant="outlined" color="secondary" type="submit">
              検証
            </Button>
          </div>
        </form>
      </div>
    </Paper>
  );
};
export default BotTokenForm;
