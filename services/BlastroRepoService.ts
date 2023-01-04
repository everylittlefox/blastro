import { decodeBase64 } from '../lib/helpers'
import { RepoContents } from '../types/repoContents'
import { getRepoContents } from './githubApi'

export type LogProperty = {
  name: string
  type: 'string' | 'number' | 'date'
  defaultValue?: string
}

export type BlastroLog = { title: string; properties: LogProperty[] }

export type BlastroProperties = BlastroLog[]

export default class BlastroRepoService {
  owner: string
  name: string
  checkPages: boolean

  constructor(owner: string, name: string, checkPages = true) {
    this.owner = owner
    this.name = name
    this.checkPages = checkPages
  }

  async getLogs() {
    if (this.checkPages) {
      return await this.logsWithCorrespondingPages()
    }

    return await this.getLogDirs()
  }

  async getBlastroProperties() {
    if (await this.hasBlastro()) {
      try {
        const contents = (await this.getRepoContents(
          'src/blastro/blastro.json'
        )) as RepoContents

        if (contents && contents.content) {
          const blastroJson = decodeBase64(contents.content)

          return JSON.parse(blastroJson) as BlastroProperties
        }
      } catch (e) {
        console.log(e)
        return null
      }
    }

    return null
  }

  async getLogProperties(title: string) {
    const blastroProperties = await this.getBlastroProperties()

    return blastroProperties
      ? blastroProperties.find((lp) => lp.title === title)
      : null
  }

  async getLogEntries(log: string) {
    let entries = await this.getRepoContents('src/blastro/' + log)

    if (entries && 'map' in entries) {
      entries = entries.filter(
        (e) =>
          e.type === 'file' &&
          e.name.substring(e.name.length - 3, e.name.length) === '.md'
      )

      return await Promise.all(entries.map((e) => this.getRepoContents(e.path)))
    }

    return null
  }

  private async hasBlastro() {
    const contents = await this.getRepoContents('src')

    return (
      contents &&
      'some' in contents &&
      contents.some((rc) => rc.name === 'blastro')
    )
  }

  private async logsWithCorrespondingPages() {
    const logDirs = await this.getLogDirs()

    if (logDirs?.length && 'map' in logDirs) {
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

      return logPages.filter(Boolean).map((l) => l as string)
    }

    return null
  }

  private async getLogDirs() {
    if (await this.hasBlastro()) {
      const contents = await this.getRepoContents('src/blastro')

      return contents && 'map' in contents ? contents.map((c) => c.name) : null
    }

    return null
  }

  private async getRepoContents(path: string) {
    return await getRepoContents(this.owner, this.name, path)
  }
}

export async function isAstroRepo(
  owner: string,
  name: string
): Promise<boolean | null> {
  const contents = await getRepoContents(owner, name)

  return (
    contents &&
    'some' in contents &&
    contents.some((rc) => rc.name === 'astro.config.mjs')
  )
}
