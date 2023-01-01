import { startAsync } from 'expo-auth-session'
import { atom, useAtom } from 'jotai'
import github from '../constants/github'
import * as tokenStorage from '../services/tokenStorage'
import * as githubApi from '../services/githubApi'
import User from '../types/user'
import { useEffect } from 'react'

const REDIRECT_URL = 'https://auth.expo.io/@everylittlefox/blastro'

const userAtom = atom<User | null>(null)
export const useUser = () => {
  const [user] = useAtom(userAtom)
  const signIn = useSignIn()

  useEffect(() => {
    tokenStorage.get().then((token) => {
      token && signIn(token)
    })
  }, [])

  return user
}
const useSetUser = () => useAtom(userAtom)[1]

export const isOnline = atom((get) => get(userAtom) !== null)

export const useSignIn = () => {
  const setUser = useSetUser()

  const signIn = async (token?: string) => {
    let t = token

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
  }

  return signIn
}

export const useSignOut = () => {
  const setUser = useSetUser()

  return async () => {
    await tokenStorage.clear()
    setUser(null)
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
