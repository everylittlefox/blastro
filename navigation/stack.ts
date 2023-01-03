import { createNativeStackNavigator } from '@react-navigation/native-stack'

export type RootStackParamList = {
  'entries-list': { log: string }
  'sign-in': undefined
  loading: undefined
  'logs-list': undefined
  'select-repo': undefined
}

export const Stack = createNativeStackNavigator<RootStackParamList>()
