import { NavigationContainer } from '@react-navigation/native'
import { Button, Pressable, Text, View } from 'react-native'
import { useFonts, EBGaramond_400Regular } from '@expo-google-fonts/eb-garamond'
import { useSignOut, useUser } from '../auth'
import useSelectedRepo from '../hooks/useSelectedRepo'
import CreateUpdateLogScreen from '../screens/CreateUpdateLogScreen'
import LoadingScreen from '../screens/LoadingScreen'
import LogEntriesScreen from '../screens/LogEntriesListScreen'
import LogsListScreen from '../screens/LogsListScreen'
import SelectRepoScreen from '../screens/SelectRepoScreen'
import SignInScreen from '../screens/SignInScreen'
import { Stack } from './stack'

export default function AppNavigation() {
  const { user, loading } = useUser()
  const { repo } = useSelectedRepo()
  const signOut = useSignOut()
  const [fontsLoaded] = useFonts({ EBGaramond_400Regular })

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitle(props) {
            return <Text {...props} style={{ fontSize: 18 }} />
          },
          headerShadowVisible: false
        }}
      >
        {loading || !fontsLoaded ? (
          <Stack.Screen
            options={{ headerShown: false }}
            name="loading"
            component={LoadingScreen}
          />
        ) : user ? (
          repo ? (
            <>
              <Stack.Screen
                options={{
                  headerRight: (props) => (
                    <Pressable {...props} onPress={signOut}>
                      <Text>logout</Text>
                    </Pressable>
                  )
                }}
                name="logs-list"
                component={LogsListScreen}
              />
              <Stack.Screen name="entries-list" component={LogEntriesScreen} />
              <Stack.Screen
                name="create-update-log"
                component={CreateUpdateLogScreen}
              />
            </>
          ) : (
            <Stack.Screen
              name="select-repo"
              component={SelectRepoScreen}
              options={{ title: 'choose astro project' }}
            />
          )
        ) : (
          <Stack.Screen
            options={{ headerShown: false }}
            name="sign-in"
            component={SignInScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
