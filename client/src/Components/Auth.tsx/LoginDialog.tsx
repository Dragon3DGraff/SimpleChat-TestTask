import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import { Fragment, useState } from 'react'

export const LoginDialog = () => {
  const [isOpen, setIsOpen] = useState(false)

  const closeHandler = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Войти</Button>

      <Dialog open={isOpen} onClose={closeHandler}>
        <DialogTitle>Вход</DialogTitle>

        <DialogContent>
          <Stack spacing={1}>
            <Stack alignItems='center' direction="row" justifyContent="flex-end" spacing={1}>
              <Typography>Имя</Typography>
              <TextField size='small' />
            </Stack>
            <Stack alignItems='center' direction="row" justifyContent="flex-end" spacing={1}>
              <Typography>Слово заветное</Typography>
              <TextField size='small' />
            </Stack>

          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeHandler}>Отмена</Button>
          <Button>Войти</Button>
        </DialogActions>
      </Dialog>

    </>
  )
}