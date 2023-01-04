import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableHighlight
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/stack'
import useSelectedRepo from '../hooks/useSelectedRepo'
import { useUser } from '../auth'
import BlastroRepoService from '../services/BlastroRepoService'
import { useQuery } from 'react-query'
import Loading from '../components/Loading'
import ListSeparator from '../components/ListSeparator'
import { decodeBase64, parseMarkdown } from '../lib/helpers'
import { RepoContents } from '../types/repoContents'
import { FontAwesome } from '@expo/vector-icons'

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
  const { data: blastroLog, error: ppError } = useQuery(
    [user?.login, 'logs', route.params.log, 'properties'],
    () => astroRepoService.current.getLogProperties(route.params.log)
  )
  const entries = data as RepoContents[]

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
        renderItem={({ item }) => {
          const md = parseMarkdown(decodeBase64(item.content))
          return (
            <Pressable
              onPress={() =>
                blastroLog &&
                navigation.push('create-update-log', {
                  blastroLog,
                  entry: {
                    title: item.name,
                    content: md.content,
                    properties: md.frontmatter
                  }
                })
              }
              style={{ paddingVertical: 16, paddingHorizontal: 18 }}
            >
              <Text style={{ fontSize: 18 }}>{item.name}</Text>
              <Text>{md.content}</Text>
            </Pressable>
          )
        }}
      />
      <TouchableHighlight
        onPress={() =>
          blastroLog &&
          navigation.push('create-update-log', {
            blastroLog
          })
        }
        style={{
          width: 64,
          height: 64,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: 16,
          right: 16,
          borderRadius: 64,
          backgroundColor: 'teal'
        }}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableHighlight>
    </View>
  )
}
