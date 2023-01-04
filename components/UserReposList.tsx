import { View, FlatList, Pressable, Text } from 'react-native'
import { useQuery } from 'react-query'
import * as githubApi from '../services/githubApi'
import Repo from '../types/repo'
import ListSeparator from './ListSeparator'
import Loading from './Loading'

type Props = {
  filter?: (r: Repo) => boolean
  onSelectRepo?: (r: Repo) => void
}

const UserReposList: React.FC<Props> = ({ filter, onSelectRepo }) => {
  const { data, isLoading, error, isError } = useQuery(
    ['repos'],
    () => githubApi.getRepos(),
    filter ? { select: (data) => data?.filter(filter) } : undefined
  )

  if (isError)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{String(error)}</Text>
      </View>
    )

  if (isLoading) return <Loading />

  return data ? (
    <FlatList
      style={{ flex: 1, paddingHorizontal: 16, }}
      data={data}
      keyExtractor={(d) => d.id.toString()}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onSelectRepo && onSelectRepo(item)}
          style={{
            paddingVertical: 16,
            paddingHorizontal: 18,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: 'lightgray',
            borderRadius: 16
          }}
        >
          <Text>{item.name}</Text>
        </Pressable>
      )}
    />
  ) : null
}

export default UserReposList
