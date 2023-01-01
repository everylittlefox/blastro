import { createNativeStackNavigator } from '@react-navigation/native-stack'

export type RootStackParamList = {
  home: undefined
  'sign-in': undefined
  loading: undefined
}

export const Stack = createNativeStackNavigator<RootStackParamList>()
