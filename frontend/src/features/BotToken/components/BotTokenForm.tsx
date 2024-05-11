import React, { useEffect } from 'react';
import { Button, Skeleton, TextField, Typography, css } from '@mui/material';
import { BrowserLink } from '../../../components/Link';
import { useBotTokenForm } from '../hooks/useBotTokenForm';
import LoadingButton from '@mui/lab/LoadingButton';

const style = {
  tabContent: css({
    padding: '1rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '.5rem',
  }),
  form: css({
    paddingTop: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }),
  submit: css({
    paddingTop: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
  }),
};

interface BotTokenForm {
  next: () => void;
}

export const BotTokenForm: React.FC<BotTokenForm> = (props) => {
  const { handleSubmit, errors, register, loading } = useBotTokenForm({
    next: props.next,
  });

  const formInput =
    loading === null ? (
      <div css={style.form}>
        <Skeleton animation="wave" variant="rectangular" height={40} />
        <Skeleton animation="wave" variant="rectangular" height={40} />
        <Skeleton animation="wave" variant="rectangular" height={40} />
        <Skeleton animation="wave" variant="rectangular" height={40} />
      </div>
    ) : (
      <div css={style.form}>
        <TextField
          variant="filled"
          fullWidth
          id="bot-form-token"
          label="bot-token"
          error={!!errors.token?.message}
          helperText={errors.token?.message}
          {...register('token')}
        />
        <TextField
          variant="filled"
          fullWidth
          id="bot-form-client-id"
          label="client-id"
          error={!!errors.clientId?.message}
          helperText={errors.clientId?.message}
          {...register('clientId')}
        />
        <TextField
          variant="filled"
          fullWidth
          id="bot-form-client-secret"
          label="client-secret"
          error={!!errors.clientSecret?.message}
          helperText={errors.clientSecret?.message}
          {...register('clientSecret')}
        />
        <TextField
          variant="filled"
          fullWidth
          id="bot-form-redirect-uri"
          label="redirect-uri"
          error={!!errors.redirectURI?.message}
          helperText={errors.redirectURI?.message}
          {...register('redirectURI')}
        />
      </div>
    );

  return (
    <div css={style.tabContent}>
      <Typography variant="body1">
        使用するDiscordアプリを設定します。
      </Typography>
      <Typography variant="body2">
        管理者は
        <BrowserLink href="https://discord.com/developers/applications">
          こちら
        </BrowserLink>
        から確認
      </Typography>
      <form
        onSubmit={async (e) => {
          await handleSubmit(e);
        }}
      >
        {formInput}
        <div css={style.submit}>
          <LoadingButton
            loading={loading === null || loading}
            variant="outlined"
            color="secondary"
            type="submit"
          >
            検証
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};
export default BotTokenForm;
