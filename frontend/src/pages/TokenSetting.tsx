import React from "react";
import { BotSettingForm } from "../features/BotToken/BotSettingForm";
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
      <BotSettingForm />
    </div>
  );
};

export default TokenSetting;
