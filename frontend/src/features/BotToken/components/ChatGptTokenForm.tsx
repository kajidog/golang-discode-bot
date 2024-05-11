import React from 'react';
import { Button, TextField, Typography, css } from '@mui/material';
import { useChatGPT } from '../hooks/useChatGPT';

const style = {
  tabContent: css({
    padding: '1rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '.5rem',
  }),
  form: css({
    paddingTop: '.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }),
  submit: css({
    paddingTop: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '.5rem',
  }),
};

interface ChatGptTokenForm {
  next: () => void;
}

export const ChatGptTokenForm: React.FC<ChatGptTokenForm> = (props) => {
  const { handleChangeGptToken, errors, register } = useChatGPT();

  return (
    <div css={style.tabContent}>
      <Typography variant="body1">GPTを使用する場合はトークンを入力</Typography>
      <form
        onSubmit={async (e) => {
          await handleChangeGptToken(e);
          props.next();
        }}
      >
        <div css={style.form}>
          <TextField
            variant="filled"
            fullWidth
            id="gpt-form-token"
            label="gpt-token"
            error={!!errors.gptToken?.message}
            helperText={errors.gptToken?.message}
            {...register('gptToken')}
          />
        </div>
        <div css={style.submit}>
          <Button variant="outlined" color="secondary" type="submit">
            設定
          </Button>
          <Button variant="outlined" onClick={props.next} color="primary">
            スキップ
          </Button>
        </div>
      </form>
    </div>
  );
};
export default ChatGptTokenForm;
