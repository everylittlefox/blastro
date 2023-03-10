import React, { useCallback, useEffect, useRef } from 'react'
import { View, Text, FlatList, Pressable } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/stack'
import useSelectedRepo from '../hooks/useSelectedRepo'
import { useUser } from '../auth'
import BlastroRepoService from '../services/BlastroRepoService'
import { useQuery } from 'react-query'
import Loading from '../components/Loading'
import ListSeparator from '../components/ListSeparator'

type Props = NativeStackScreenProps<RootStackParamList, 'logs-list'>

export default function LogsListScreen({ navigation }: Props) {
  const { user } = useUser()
  const { repo } = useSelectedRepo()
  const astroRepoService = useRef(
    new BlastroRepoService(user!.login, repo!.name)
  )
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
        style={{ padding: 16 }}
        data={logs}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item }) => (
          <Pressable
            style={{
              paddingVertical: 16,
              paddingHorizontal: 18,
              backgroundColor: 'white',
              borderRadius: 16
            }}
            onPress={() => handleSelectRepo(item)}
          >
            <Text style={{ fontSize: 16 }}>{item}</Text>
          </Pressable>
        )}
      />
    </View>
  )
}
