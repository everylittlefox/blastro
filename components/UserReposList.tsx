import { View, FlatList, Pressable, Text } from 'react-native'
import { useQuery } from 'react-query'
import * as githubApi from '../services/githubApi'
import Loading from './Loading'

const Repos: React.FC = () => {
  const { data, isLoading, error } = useQuery(['repos'], () =>
    githubApi.getRepos()
  )

  if (isLoading)
    return <Loading />

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
        <Pressable style={{ padding: 16 }}>
          <Text>{item.name}</Text>
        </Pressable>
      )}
    />
  ) : null
}

export default Repos
