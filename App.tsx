import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable
} from 'react-native'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { useUser, useSession, signIn, signOut } from './auth'
import * as githubApi from './services/githubApi'

const queryClient = new QueryClient()

export default function App() {
  const user = useUser()

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        {user ? (
          <View style={{ flex: 1, paddingTop: 80 }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'baseline',
                paddingHorizontal: 16
              }}
            >
              <Text style={{ fontSize: 20 }}>{user.displayName}</Text>
              <Button onPress={signOut} title="logout" />
            </View>
            <Repos />
          </View>
        ) : (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Button onPress={() => signIn()} title="log in with Github" />
          </View>
        )}
        <StatusBar style="auto" />
      </SafeAreaView>
    </QueryClientProvider>
  )
}

const Repos: React.FC = () => {
  const { data, isLoading, error } = useQuery(['repos'], () =>
    githubApi.getRepos()
  )

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>loading</Text>
      </View>
    )

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})
