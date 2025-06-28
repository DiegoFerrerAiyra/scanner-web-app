import { App } from 'aws-cdk-lib'

import { LoadEnvironment } from './envs'
import { PersistentStack } from '../lib/persistent-stack'
import { GlobalStack } from '../lib/global-stack'

const Domain = 'Backoffice'
const envCfg = LoadEnvironment()
const app = new App()

const global = new GlobalStack(app,Domain, {
    ...envCfg,
    env: {account: envCfg.env?.account, region: 'us-east-1'},
    crossRegionReferences: true,
})

new PersistentStack(app, Domain, {
    ...envCfg,
    crossRegionReferences: true,
    GlobalStack: global.exported,
})
