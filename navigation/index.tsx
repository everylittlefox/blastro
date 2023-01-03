import { NavigationContainer } from '@react-navigation/native'
import { Button } from 'react-native'
import { useSignOut, useUser } from '../auth'
import useSelectedRepo from '../hooks/useSelectedRepo'
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

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {loading ? (
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
                    <Button {...props} title="logout" onPress={signOut} />
                  )
                }}
                name="logs-list"
                component={LogsListScreen}
              />
              <Stack.Screen name="entries-list" component={LogEntriesScreen} />
            </>
          ) : (
            <Stack.Screen name="select-repo" component={SelectRepoScreen} />
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
