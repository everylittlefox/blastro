import { getRepoContents } from './githubApi'

export default function repoService(owner: string, name: string) {
  return {
    async isAstroRepo(): Promise<boolean | null> {
      const contents = await getRepoContents(owner, name)

      return contents
        ? contents.some((rc) => rc.name === 'astro.config.mjs')
        : null
    }
  }
}
