import { useEffect } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { View, Button } from 'react-native'
import { useSignIn, useUser } from '../auth'
import { RootStackParamList } from '../navigation/stack'
import Loading from '../components/Loading'

type Props = NativeStackScreenProps<RootStackParamList, 'sign-in'>

export default function SignInScreen({ navigation }: Props) {
  const { user, loading } = useUser()
  const signIn = useSignIn()

  useEffect(() => {
    if (user) navigation.replace('select-repo')
  }, [user])

  if (loading) return <Loading />

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => signIn()} title="log in with Github" />
    </View>
  )
}
