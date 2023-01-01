import { startAsync } from 'expo-auth-session'
import { atom, useAtom } from 'jotai'
import github from '../constants/github'
import * as tokenStorage from '../services/tokenStorage'
import * as githubApi from '../services/githubApi'
import User from '../types/user'
import { useEffect, } from 'react'

const REDIRECT_URL = 'https://auth.expo.io/@everylittlefox/blastro'

const userAtom = atom<User | null>(null)
const useSetUser = () => useAtom(userAtom)[1]

const userLoadingAtom = atom(false)

export const useUser = () => {
  const [user] = useAtom(userAtom)
  const [loading, setLoading] = useAtom(userLoadingAtom)
  const signIn = useSignIn()

  useEffect(() => {
    setLoading(true)
    tokenStorage.get().then((token) => {
      if (!token) setLoading(false)
      else signIn(token)
    })
  }, [])

  return { user, loading }
}

export const useSignIn = () => {
  const setUser = useSetUser()
  const setUserLoading = useAtom(userLoadingAtom)[1]

  const signIn = async (token?: string) => {
    let t = token

    setUserLoading(true)
    if (!t) {
      const response = (await startAsync({
        authUrl: authUrlWithId(github.id)
      })) as any

      if (response.params && response.params.code) {
        const { access_token } = await createTokenWithCode(response.params.code)
        t = access_token

        if (t) {
          await tokenStorage.set(t!)
          signIn(t)
        }
      }

      return
    }

    const user = await githubApi.getUser()
    setUser(user)
    setUserLoading(false)
  }

  return signIn
}

export const useSignOut = () => {
  const setUser = useSetUser()
  const setUserLoading = useAtom(userLoadingAtom)[1]

  return async () => {
    setUserLoading(true)
    await tokenStorage.clear()
    setUser(null)
    setUserLoading(false)
  }
}

function authUrlWithId(id: string) {
  return (
    `https://github.com/login/oauth/authorize` +
    `?client_id=${id}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URL)}`
  )
}

async function createTokenWithCode(code: string) {
  const url =
    `https://github.com/login/oauth/access_token` +
    `?client_id=${github.id}` +
    `&client_secret=${github.secret}` +
    `&code=${code}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return res.json()
}
