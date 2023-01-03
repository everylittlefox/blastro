import React, { useEffect, useRef } from 'react'
import { View, Text, FlatList, Pressable } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/stack'
import useSelectedRepo from '../hooks/useSelectedRepo'
import { useUser } from '../auth'
import BlastroRepoService from '../services/BlastroRepoService'
import { useQuery } from 'react-query'
import Loading from '../components/Loading'
import ListSeparator from '../components/ListSeparator'
import { decodeBase64 } from '../lib/helpers'
import { RepoContents } from '../types/repoContents'

type Props = NativeStackScreenProps<RootStackParamList, 'entries-list'>

export default function LogEntriesScreen({ navigation, route }: Props) {
  const { user } = useUser()
  const { repo } = useSelectedRepo()
  const astroRepoService = useRef(
    new BlastroRepoService(user!.login, repo!.name)
  )
  const { data, isLoading, error } = useQuery(
    [user?.login, 'logs', route.params.log, 'entries'],
    () => astroRepoService.current.getLogEntries(route.params.log)
  )
  const { data: properties, error: ppError } = useQuery(
    [user?.login, 'logs', route.params.log, 'properties'],
    () => astroRepoService.current.getLogProperties(route.params.log)
  )
  const entries = data as RepoContents[]

  useEffect(() => {
    navigation.setOptions({ title: route.params.log })
  }, [route.params.log])

  useEffect(() => {
    console.log(ppError)
  }, [ppError])

  useEffect(() => {
    console.log(properties)
  }, [properties])

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
            <Text>{decodeBase64(item.content)}</Text>
          </Pressable>
        )}
      />
      {/* <Text style={{ fontSize: 18 }}>{route.params.log}</Text> */}
    </View>
  )
}
