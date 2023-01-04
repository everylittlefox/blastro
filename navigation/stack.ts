import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { BlastroLog } from '../services/BlastroRepoService'

export type RootStackParamList = {
  'entries-list': { log: string }
  'sign-in': undefined
  loading: undefined
  'logs-list': undefined
  'select-repo': undefined
  'create-update-log': { blastroLog: BlastroLog; entry?: any }
}

export const Stack = createNativeStackNavigator<RootStackParamList>()
