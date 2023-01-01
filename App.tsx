import { StatusBar } from 'expo-status-bar'
import { useEffect, } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { useUser, useSession, signIn } from './auth'

export default function App() {
  const user = useUser()

  return (
    <View style={styles.container}>
      {user ? (
        <Text>logged in: {user.displayName}</Text>
      ) : (
        <Button onPress={() => signIn()} title="log in with Github" />
      )}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
