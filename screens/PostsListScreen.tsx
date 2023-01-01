import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useUser } from '../auth'
import { RootStackParamList } from '../navigation/stack'

type Props = NativeStackScreenProps<RootStackParamList, 'posts-list'>

export default function PostsListScreen({ navigation }: Props) {
  const { user } = useUser()

  useEffect(() => {
    if (!user) navigation.replace('sign-in')
  }, [user])

  return (
    <View style={{ flex: 1 }}>
      <Text>posts list screen</Text>
    </View>
  )
}
