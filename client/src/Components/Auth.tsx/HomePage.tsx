import { Stack, Typography } from '@mui/material'
import { Link} from 'react-router-dom'

function HomePage() {
  return (
    <Stack alignItems="center" width="100%">
      <img alt='ЯТЬ' src='pictures/logo.jpg' width="20%" />
      <Typography fontWeight="bold" variant='h3'>ГлаголЪ</Typography>
      <Link style={{fontSize: '18px'}} to="/login">Войти</Link>
      <Link style={{fontSize: '18px'}} to="/registration">Регистрация</Link>
    </Stack>
  )
}

export default HomePage
