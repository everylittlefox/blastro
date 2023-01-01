import axios from 'axios'
import { pick } from '../lib/helpers'
import Repo from '../types/repo'
import * as tokenStorage from './tokenStorage'

const baseURL = 'https://api.github.com'
const api = axios.create({ baseURL })

export const getRepos = async (): Promise<Repo[] | null> => {
  const token = await tokenStorage.get()

  if (token) {
    const data = (
      await api.get('/user/repos', {
        headers: {
          Authorization: `bearer ${token}`
        }
      })
    ).data as any[]

    return data.map((d) => pick(d, ['id', 'name']))
  }

  return null
}
