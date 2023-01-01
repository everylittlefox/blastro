import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import Repo from '../types/repo'
import * as repoStorage from '../services/repoStorage'

const selectedRepoAtom = atom<Repo | null>(null)

export default function useSelectedRepo() {
  const [repo, setRepo] = useAtom(selectedRepoAtom)

  useEffect(() => {
    if (!repo) {
      repoStorage.get().then((repo) => {
        repo && setRepo(repo)
      })
    } else repoStorage.set(repo)
  }, [repo])

  return { repo, setRepo }
}
