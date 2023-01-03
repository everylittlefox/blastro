import axios from 'axios'
import { pick } from '../lib/helpers'
import Repo from '../types/repo'
import { RepoContents } from '../types/repoContents'
import User from '../types/user'
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

export const getUser = async (): Promise<User | null> => {
  const token = await tokenStorage.get()

  if (token) {
    const data = (
      await api.get('/user', {
        headers: {
          Authorization: `bearer ${token}`
        }
      })
    ).data

    return {
      id: data.id,
      login: data.login,
      avatar: data.avatar_url,
      name: data.name
    }
  }

  return null
}

export const getRepoContents = async (
  owner: string,
  repoName: string,
  path = ''
): Promise<RepoContents[] | null> => {
  const token = await tokenStorage.get()

  if (token) {
    const data = (
      await api.get(`/repos/${owner}/${repoName}/contents/${path}`, {
        headers: {
          Authorization: `bearer ${token}`
        }
      })
    ).data

    const fields = ['name', 'path', 'url', 'sha', 'type']
    return 'map' in data
      ? data.map((d: any) => pick(d, fields))
      : pick(data, fields)
  }

  return null
}
