import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useRegister } from 'hooks/useRegister'
import { useEffect, useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { RegisterData } from 'services'
import { useNavigate } from 'react-router-dom'

export const Registration = () => {
  const [isSucceddDialogOpen, setIsSucceddDialogOpen] = useState(false)

  const navigate = useNavigate()

  const {control, handleSubmit, formState: { errors } } = useForm({
    defaultValues:{
      'email': '',
      'password': '',
      'confirmPassword': '',
      'name': '',
    }
  })

  const { isLoading, isRegistered, sendRegister, error} = useRegister()

  const onSubmit: SubmitHandler<RegisterData> = (data) => {

    sendRegister(data)
  }

  useEffect(() => {isRegistered && setIsSucceddDialogOpen(true)},[isRegistered])

  const onCloseHandle = () => {
    setIsSucceddDialogOpen(false)
    navigate('/login')
  }

  return (
    <>
      <Stack alignItems="center">
        <form onSubmit={handleSubmit(onSubmit)}>

          <Stack spacing={1}>
            <Typography variant='h4'>Регистрация</Typography>

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
              name="name"
              render={
                ({ field }) =>
                  (
                    <TextField
                      autoComplete="username"
                      error={!!errors?.name?.message}
                      helperText={errors?.name?.message}
                      label='Имя'
                      size='small'
                      {...field}
                    />
                  )
              }
              rules={{
                required: 'Имя своё назови, странник',
              }} />

            <Controller
              control={control}
              defaultValue=''
              name="password"
              render={
                ({ field }) =>
                  (
                    <TextField
                      autoComplete="new-password"
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

            <Controller
              control={control}
              defaultValue=''
              name="confirmPassword"
              render={
                ({ field }) =>
                  (
                    <TextField
                      autoComplete="new-password"
                      error={!!errors?.password?.message}
                      helperText={errors?.password?.message}
                      label='Ещё разок'
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
            {error && <Typography alignSelf="center" color='error'>{error.message}</Typography>}

            <Stack direction="row">
              <Button onClick={() => navigate('/')}>Отмена</Button>
              <LoadingButton loading={isLoading} type="submit" variant='contained'>Регистрация</LoadingButton>
            </Stack>

            <Button onClick={() => navigate('/login')}>
              У меня есть логин
            </Button>

          </Stack>

        </form>
      </Stack>

      <Dialog open={isSucceddDialogOpen}>
        <DialogTitle>Регистрация прошла успешно!</DialogTitle>
        <DialogContent>Теперь можно войти</DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={onCloseHandle}>Отлично!</Button>
        </DialogActions>
      </Dialog>

    </>
  )
}