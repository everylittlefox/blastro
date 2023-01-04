import React, { useCallback, useState } from 'react'
import { View, Text, Button, Modal, TextInput, Pressable } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import FA from '@expo/vector-icons/FontAwesome'
import { useUser } from '../auth'
import { RootStackParamList } from '../navigation/stack'
import UserReposList from '../components/UserReposList'
import Repo from '../types/repo'
import { isAstroRepo } from '../services/BlastroRepoService'
import useSelectedRepo from '../hooks/useSelectedRepo'
import * as repoStorage from '../services/repoStorage'

type Props = NativeStackScreenProps<RootStackParamList, 'select-repo'>

export default function SelectRepoScreen({ navigation }: Props) {
  const { user } = useUser()
  const { setRepo } = useSelectedRepo()
  const [filter, setFilter] = useState('')
  const filterRepos = useCallback(
    (repo: Repo) => repo.name.toLowerCase().includes(filter.toLowerCase()),
    [filter]
  )
  const handleSelectRepo = async (repo: Repo) => {
    if (user) {
      const isAstro = await isAstroRepo(user.login, repo.name)

      if (!isAstro) {
        alert(`${repo.name} is not an Astro project.`)
      } else {
        setRepo(repo)
        await repoStorage.set(repo)
      }
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
        <TextInput
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: 'lightgray',
            fontSize: 18,
            borderRadius: 4
          }}
          cursorColor="gray"
          value={filter}
          onChangeText={setFilter}
          placeholder="search repos..."
        />
      </View>
      <UserReposList filter={filterRepos} onSelectRepo={handleSelectRepo} />
    </View>
  )
}
