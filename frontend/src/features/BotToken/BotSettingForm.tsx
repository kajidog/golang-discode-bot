import React, { useState } from "react";
import { Box, Paper, Step, StepLabel, Stepper, css } from "@mui/material";
import { BotTokenForm } from "./components/BotTokenForm";
import { UserTokenForm } from "./components/UserTokenForm";

const style = {
  page: css({
    padding: "0rem 1rem",
    minWidth: "30rem",
  }),
};

const steps = ["ボット設定", "ユーザー連携", "ChatGPT設定"];

interface BotSettingForm {}
export const BotSettingForm: React.FC<BotSettingForm> = () => {
  const [step, setStep] = useState(0);

  return (
    <Paper elevation={3} css={style.page}>
      <Box sx={{ width: "100%", paddingTop: "1rem" }}>
        <Stepper activeStep={step} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {step === 0 && <BotTokenForm next={() => setStep(1)} />}
      {step === 1 && <UserTokenForm next={() => setStep(2)} />}
    </Paper>
  );
};
export default BotSettingForm;
