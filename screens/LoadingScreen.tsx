import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { useUser } from '../auth'
import Loading from '../components/Loading'
import { RootStackParamList } from '../navigation/stack'

type Props = NativeStackScreenProps<RootStackParamList, 'loading'>

export default function LoadingScreen({ navigation }: Props) {
  const { user, loading } = useUser()

  useEffect(() => {
    if (!loading) {
      if (user) navigation.replace('home')
      else navigation.replace('sign-in')
    }
  }, [user, loading])

  return loading ? <Loading /> : null
}
