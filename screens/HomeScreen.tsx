import React, { useEffect } from 'react'
import { View, Button, Text } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useSignOut, useUser } from '../auth'
import UserReposList from '../components/UserReposList'
import { RootStackParamList } from '../navigation/stack'

type Props = NativeStackScreenProps<RootStackParamList, 'home'>

export default function HomeScreen({ navigation }: Props) {
  const { user } = useUser()
  const signOut = useSignOut()

  useEffect(() => {
    if (!user) navigation.replace('sign-in')
  }, [user])

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'baseline',
          padding: 16
        }}
      >
        <Text style={{ fontSize: 20 }}>{user?.name}</Text>
        <Button onPress={signOut} title="logout" />
      </View>
      <UserReposList />
    </View>
  )
}
