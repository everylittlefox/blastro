import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Button, FlatList, Pressable } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/stack'
import useSelectedRepo from '../hooks/useSelectedRepo'
import { useUser } from '../auth'
import AstroRepoService from '../services/astroRepoService'
import { useQuery } from 'react-query'
import Loading from '../components/Loading'
import ListSeparator from '../components/ListSeparator'

type Props = NativeStackScreenProps<RootStackParamList, 'entries-list'>

export default function LogEntriesScreen({ navigation, route }: Props) {
  const { user } = useUser()
  const { repo } = useSelectedRepo()
  const astroRepoService = useRef(new AstroRepoService(user!.login, repo!.name))
  const {
    data: entries,
    isLoading,
    error
  } = useQuery([user?.login, 'logs', route.params.log], () =>
    astroRepoService.current.getLogEntries(route.params.log)
  )

  useEffect(() => {
    navigation.setOptions({ title: route.params.log })
  }, [route.params.log])

  if (isLoading) return <Loading />

  if (error)
    return (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Text>{String(error)}</Text>
      </View>
    )

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.sha}
        ItemSeparatorComponent={ListSeparator}
        renderItem={({ item }) => (
          <Pressable style={{ paddingVertical: 16, paddingHorizontal: 18 }}>
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
          </Pressable>
        )}
      />
      {/* <Text style={{ fontSize: 18 }}>{route.params.log}</Text> */}
    </View>
  )
}
