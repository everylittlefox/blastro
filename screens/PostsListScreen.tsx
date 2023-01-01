import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useUser } from '../auth'
import { RootStackParamList } from '../navigation/stack'
import useSelectedRepo from '../hooks/useSelectedRepo'

type Props = NativeStackScreenProps<RootStackParamList, 'posts-list'>

export default function PostsListScreen({ navigation }: Props) {
  const { user } = useUser()
  const { repo } = useSelectedRepo()

  useEffect(() => {
    if (!user) navigation.replace('sign-in')
  }, [user])

  useEffect(() => {
    if (!repo) navigation.replace('select-repo')
    else navigation.setOptions({ title: repo.name })
  }, [repo])

  return repo ? <View style={{ flex: 1 }}></View> : null
}
