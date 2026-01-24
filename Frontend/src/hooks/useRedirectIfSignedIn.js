import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useRedirectIfSignedIn(redirectTo = '/index') {
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('isSignedIn') === 'true') {
      navigate(redirectTo)
    }
  }, [navigate, redirectTo])
}
