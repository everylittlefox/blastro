import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import Repo from '../types/repo'
import * as repoStorage from '../services/repoStorage'

const selectedRepoAtom = atom<Repo | null>(null)

export default function useSelectedRepo() {
  const [repo, setRepo] = useAtom(selectedRepoAtom)

  // useEffect(() => {})

  useEffect(() => {
    repo && repoStorage.set(repo.name)
  }, [repo])

  return { repo, setRepo }
}
