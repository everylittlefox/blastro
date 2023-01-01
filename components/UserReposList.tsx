import { View, FlatList, Pressable, Text } from 'react-native'
import { useQuery } from 'react-query'
import * as githubApi from '../services/githubApi'
import Repo from '../types/repo'
import Loading from './Loading'

type Props = {
  filter?: (r: Repo) => boolean
  onSelectRepo?: (repoId: number) => void
}

const UserReposList: React.FC<Props> = ({ filter }) => {
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
      style={{ flex: 1 }}
      data={data}
      keyExtractor={(d) => d.id.toString()}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: 1,
            backgroundColor: 'lightgray',
            marginHorizontal: 8
          }}
        />
      )}
      renderItem={({ item }) => (
        <Pressable style={{ paddingVertical: 16, paddingHorizontal: 18 }}>
          <Text>{item.name}</Text>
        </Pressable>
      )}
    />
  ) : null
}

export default UserReposList
