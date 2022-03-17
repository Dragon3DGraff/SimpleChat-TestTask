import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useRegister } from 'hooks/useRegister'
import { useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { RegisterData } from 'services'

export const RegisterDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {control, register, handleSubmit, formState: { errors } } = useForm()

  const { isLoading, isRegistered, sendRegister, error} = useRegister()

  const closeHandler = () => {
    setIsOpen(false)
  }

  const onSubmit: SubmitHandler<RegisterData> = ({email, password, confirmPassword}) => {

    sendRegister({email, password, confirmPassword})

  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Регистрация</Button>
      {isOpen &&(
        <Dialog open={isOpen} onClose={closeHandler}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Регистрация</DialogTitle>

            <DialogContent>
              <Stack spacing={1}>
                <Stack alignItems='top' direction="row" justifyContent="flex-end" spacing={1}>
                  <Typography>Электронная почта</Typography>
                  <Controller
                    control={control}
                    defaultValue=''
                    name="email"
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
                </Stack>
                <Stack alignItems='top' direction="row" justifyContent="flex-end" spacing={1}>
                  <Typography>Слово заветное</Typography>
                  <Controller
                    control={control}
                    defaultValue=''
                    name="confirmPassword"
                    render={
                      ({ field }) =>
                        (
                          <TextField
                            error={!!errors?.password?.message}
                            helperText={errors?.password?.message}
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
                </Stack>
                {error && <Typography alignSelf="center" color='error'>{error.message}</Typography>}
              </Stack>

            </DialogContent>

            <DialogActions>

              <Button onClick={closeHandler}>Отмена</Button>
              <LoadingButton loading={isLoading} type="submit">Регистрация</LoadingButton>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </>
  )
}