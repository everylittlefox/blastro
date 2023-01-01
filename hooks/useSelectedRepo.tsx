import { atom, useAtom } from 'jotai'
import Repo from '../types/repo'

const selectedRepoAtom = atom<Repo | null>(null)

export default function useSelectedRepo() {
  const [repo, setRepo] = useAtom(selectedRepoAtom)
  return { repo }
}
