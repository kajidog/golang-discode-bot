import React from "react";
import { BotTokenForm } from "../features/BotToken/BotTokenForm";
import { css } from "@emotion/react";

const style = css`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TokenSetting: React.FC = () => {
  return (
    <div css={style}>
      <BotTokenForm />
    </div>
  );
};

export default TokenSetting;
