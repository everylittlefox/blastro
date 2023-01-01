import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'blastro:github_token'

export const set = async (value: string) =>
  await AsyncStorage.setItem(STORAGE_KEY, value)

export const get = async () => await AsyncStorage.getItem(STORAGE_KEY)

export const clear = async () => await AsyncStorage.removeItem(STORAGE_KEY)
