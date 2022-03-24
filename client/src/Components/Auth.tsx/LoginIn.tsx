import { Box, Button, LinearProgress, Stack, TextField, Typography } from '@mui/material'
import { useLogin } from 'hooks/useLogin'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { LoginData } from 'services'

export const LoginIn = () => {
  const {control, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()

  const { isLoading, sendLogin, error} = useLogin()

  const onSubmit: SubmitHandler<LoginData> = body => {
    sendLogin(body)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <Stack alignItems="center" spacing={1}>
        <Typography variant='h4'>Вход</Typography>
        <Controller
          control={control}
          defaultValue=''
          name="email"
          render={
            ({ field }) =>
              (
                <TextField
                  autoComplete="username"
                  error={!!errors?.email?.message}
                  helperText={errors?.email?.message}
                  label='Электронная почта'
                  size='small'
                  type='email'
                  {...field}
                />
              )
          }
          rules={{
            required: 'Нужно указать',
          }} />

        <Controller
          control={control}
          defaultValue=''
          name="password"
          render={
            ({ field }) =>
              (
                <TextField
                  autoComplete="current-password"
                  error={!!errors?.password?.message}
                  helperText={errors?.password?.message}
                  label='Слово заветное'
                  size='small'
                  type='password'
                  {...field}
                />
              )
          }
          rules={{
            required: 'Без слова заветного не пущу',
            validate: {
              simbols: value =>
                /^[A-Za-z0-9_!?-]{6,30}$/i.test(value) || 'Неверные символы',
              // count: value => /^{6,30}$/i.test(value) || 'коротковато'
            },
          }} />

        {/* TODO восстановить пароль */}

        {error && <Typography alignSelf="center" color='error'>{error.message}</Typography>}
        <Box>{isLoading && <LinearProgress />}</Box>

        <Stack direction="row" spacing={1}>
          <Button onClick={() => navigate('/')}>Отмена</Button>
          <Button type="submit" variant='contained'>Войти</Button>
        </Stack>
      </Stack>

    </form>
  )
}