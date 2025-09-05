import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql',
  documents: [
    'graphql/**/*.graphql',
    'app/**/*.tsx'
  ],
  generates: {
    'generated/graphql.tsx': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ],
      config: {
        reactApolloVersion: 3,
        withHooks: true,
        withHOC: false
      }
    }
  },
  // hooks: {
  //   afterAllFileWrite: ['pnpm lint --fix']
  // }
}

export default config