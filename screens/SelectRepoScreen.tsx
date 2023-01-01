import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, Button, Modal, TextInput, Pressable } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import FA from '@expo/vector-icons/FontAwesome'
import { useUser } from '../auth'
import { RootStackParamList } from '../navigation/stack'
import UserReposList from '../components/UserReposList'
import Repo from '../types/repo'

type Props = NativeStackScreenProps<RootStackParamList, 'select-repo'>

export default function SelectRepoScreen({ navigation }: Props) {
  const { user } = useUser()
  const [modalVisible, setModalVisible] = useState(false)
  const [filter, setFilter] = useState('')
  const filterRepos = useCallback(
    (repo: Repo) => repo.name.toLowerCase().includes(filter.toLowerCase()),
    [filter]
  )

  useEffect(() => {
    if (!user) navigation.replace('sign-in')
  }, [user])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => setModalVisible(true)}
        title="choose Astro project"
      />
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 18 }}>
            <View style={{ paddingVertical: 36 }}>
              <Pressable onPress={() => setModalVisible(false)}>
                <FA name="long-arrow-left" color="gray" size={24} />
              </Pressable>
            </View>
            <Text style={{ paddingTop: 30, fontSize: 24 }}>projects</Text>
            <View
              style={{
                paddingVertical: 16
              }}
            >
              <TextInput
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderWidth: 1,
                  borderColor: 'lightgray',
                  fontSize: 20,
                  borderRadius: 4
                }}
                cursorColor="gray"
                value={filter}
                onChangeText={setFilter}
              />
            </View>
          </View>
          <UserReposList filter={filterRepos} />
        </View>
      </Modal>
    </View>
  )
}
