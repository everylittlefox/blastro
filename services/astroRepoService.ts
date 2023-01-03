import { getRepoContents } from './githubApi'

export default class AstroRepoService {
  owner: string
  name: string
  checkPages: boolean

  constructor(owner: string, name: string, checkPages = true) {
    this.owner = owner
    this.name = name
    this.checkPages = checkPages
  }

  private async hasBlastro() {
    const contents = await this.getRepoContents('src')

    return contents && contents.some((rc) => rc.name === 'blastro')
  }

  private async logsWithCorrespondingPages() {
    const logDirs = await this.getLogDirs()

    if (logDirs?.length) {
      const self = this
      const logPages = await Promise.all(
        logDirs.map((log) =>
          (async () => {
            try {
              await self.getRepoContents(`src/pages/${log}/index.astro`)

              return log
            } catch {
              return null
            }
          })()
        )
      )

      return logPages.filter(Boolean).map(l => l as string)
    }

    return null
  }

  private async getLogDirs() {
    if (await this.hasBlastro()) {
      const contents = await this.getRepoContents('src/blastro')

      return contents ? contents.map((c) => c.name) : null
    }

    return null
  }

  private async getRepoContents(path: string) {
    return await getRepoContents(this.owner, this.name, path)
  }

  async getLogs() {
    if (this.checkPages) {
      return await this.logsWithCorrespondingPages()
    }

    return await this.getLogDirs()
  }
}

export async function isAstroRepo(
  owner: string,
  name: string
): Promise<boolean | null> {
  const contents = await getRepoContents(owner, name)

  return contents && contents.some((rc) => rc.name === 'astro.config.mjs')
}
