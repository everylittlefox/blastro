import AsyncStorage from '@react-native-async-storage/async-storage'
import Repo from '../types/repo'

const STORAGE_KEY = 'blastro:selected_repo'

export const set = async (repo: Repo) =>
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(repo))

export const get = async () => {
  const json = await AsyncStorage.getItem(STORAGE_KEY)

  if (json) {
    try {
      return JSON.parse(json) as Repo
    } catch (error) {
      return null
    }
  }

  return null
}

export const clear = async () => await AsyncStorage.removeItem(STORAGE_KEY)
