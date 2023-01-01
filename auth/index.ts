import { startAsync } from 'expo-auth-session'
import { atom, useAtom } from 'jotai'
import firebaseAuth from './firebase'
import {
  GithubAuthProvider,
  signInWithCredential,
  User
} from 'firebase/auth'
import github from '../constants/github'
import { useEffect } from 'react'
import * as tokenStorage from '../services/tokenStorage'

const REDIRECT_URL = 'https://auth.expo.io/@everylittlefox/blastro'

const userAtom = atom<User | null>(null)

export const useUser = () => {
  const [user, setUser] = useAtom(userAtom)

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(async (state) => {
      if (!!state) {
        const token = await tokenStorage.get()
        if (token) {
          await signIn(token)
          return
        }
      }
      setUser(state)
    })
  }, [])

  return user
}

export const useSession = () => {
  return useAtom(userAtom)
}

export const isOnline = atom((get) => get(userAtom) !== null)

export const signIn = async (token?: string) => {
  let t = token

  if (!t) {
    const response = (await startAsync({
      authUrl: authUrlWithId(github.id)
    })) as any

    if (response.params && response.params.code) {
      const { access_token } = await createTokenWithCode(response.params.code)
      t = access_token

      if (t) {
        tokenStorage.set(t!)
        signIn(t)
      }
    }

    return
  }

  const credential = GithubAuthProvider.credential(t)
  await signInWithCredential(firebaseAuth, credential)
}

export const signOut = async () => {
  await tokenStorage.clear()
  await firebaseAuth.signOut()
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
