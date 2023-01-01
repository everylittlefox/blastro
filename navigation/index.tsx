import { NavigationContainer } from '@react-navigation/native'
import HomeScreen from '../screens/HomeScreen'
import LoadingScreen from '../screens/LoadingScreen'
import PostsListScreen from '../screens/PostsListScreen'
import SelectRepoScreen from '../screens/SelectRepoScreen'
import SignInScreen from '../screens/SignInScreen'
import { Stack } from './stack'

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'loading'}>
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen
          options={{ headerShown: false }}
          name="sign-in"
          component={SignInScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="loading"
          component={LoadingScreen}
        />
        <Stack.Screen name='posts-list' component={PostsListScreen} />
        <Stack.Screen name='select-repo' component={SelectRepoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
