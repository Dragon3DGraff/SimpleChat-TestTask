import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import { Fragment, useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

interface IFormFields {
  login: string
  password: string
}

export const LoginDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {control, register, handleSubmit, formState: { errors } } = useForm()

  const closeHandler = () => {
    setIsOpen(false)
  }

  const onSubmit: SubmitHandler<IFormFields> = body => {
    console.log('onSubmit')
    // login({
    //   username: body.email,
    //   password: body.password,
    // })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Войти</Button>
      <Dialog open={isOpen} onClose={closeHandler}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Вход</DialogTitle>

          <DialogContent>
            <Stack spacing={1}>
              <Stack alignItems='top' direction="row" justifyContent="flex-end" spacing={1}>
                <Typography>Имя</Typography>
                <Controller
                  control={control}
                  defaultValue=''
                  name="login"
                  render={
                    ({ field }) =>
                      (
                        <TextField
                          error={!!errors?.login?.message}
                          helperText={errors?.login?.message}
                          size='small'
                          {...field}
                        />
                      )
                  }
                  rules={{
                    required: 'Имя своё назови, странник',
                  }} />

              </Stack>
              <Stack alignItems='top' direction="row" justifyContent="flex-end" spacing={1}>
                <Typography>Слово заветное</Typography>
                <Controller
                  control={control}
                  defaultValue=''
                  name="password"
                  render={
                    ({ field }) =>
                      (
                        <TextField
                          error={!!errors?.password?.message}
                          helperText={errors?.password?.message}
                          size='small'
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
              </Stack>

            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={closeHandler}>Отмена</Button>
            <Button type="submit">Войти</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}