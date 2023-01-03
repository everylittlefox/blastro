import React, { useCallback, useEffect, useRef } from 'react'
import { View, Text, FlatList, Pressable } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/stack'
import useSelectedRepo from '../hooks/useSelectedRepo'
import { useUser } from '../auth'
import AstroRepoService from '../services/astroRepoService'
import { useQuery } from 'react-query'
import Loading from '../components/Loading'
import ListSeparator from '../components/ListSeparator'

type Props = NativeStackScreenProps<RootStackParamList, 'logs-list'>

export default function LogsListScreen({ navigation }: Props) {
  const { user } = useUser()
  const { repo } = useSelectedRepo()
  const astroRepoService = useRef(new AstroRepoService(user!.login, repo!.name))
  const {
    data: logs,
    isLoading,
    error
  } = useQuery([user?.login, 'logs'], () => astroRepoService.current.getLogs())

  const handleSelectRepo = useCallback(
    (log: string) => {
      navigation.push('entries-list', { log })
    },
    [navigation]
  )

  useEffect(() => {
    if (repo) navigation.setOptions({ title: repo.name })
  }, [repo])

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
        data={logs}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={ListSeparator}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelectRepo(item)}
            style={{ paddingVertical: 16, paddingHorizontal: 18 }}
          >
            <Text style={{ fontSize: 18 }}>{item}</Text>
          </Pressable>
        )}
      />
    </View>
  )
}
