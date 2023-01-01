import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/stack'
import useSelectedRepo from '../hooks/useSelectedRepo'

type Props = NativeStackScreenProps<RootStackParamList, 'posts-list'>

export default function PostsListScreen({ navigation }: Props) {
  const { repo } = useSelectedRepo()

  useEffect(() => {
    if (repo) navigation.setOptions({ title: repo.name })
  }, [repo])

  return repo ? <View style={{ flex: 1 }}></View> : null
}
