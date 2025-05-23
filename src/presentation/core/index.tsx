// Include Telegram UI styles first to allow our code override the package CSS.
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { retrieveLaunchParams } from '@telegram-apps/sdk-react'

import './index.css'
// Mock the environment in case, we are outside Telegram.
import './mock-env.ts'
import { init } from './init.ts'
import { Root } from './root.tsx'
import { EnvUnsupported } from './env-unsupported.tsx'

const root = ReactDOM.createRoot(document.getElementById('root')!)

try {
  const launchParams = retrieveLaunchParams()
  const { tgWebAppPlatform: platform } = launchParams
  const debug = (launchParams.tgWebAppStartParam || '').includes('platformer_debug')
    || import.meta.env.DEV

  // Configure all application dependencies.
  // eslint-disable-next-line antfu/no-top-level-await
  await init({
    debug,
    eruda: debug && ['ios', 'android'].includes(platform),
    mockForMacOS: platform === 'macos',
  })
    .then(() => {
      root.render(
        <StrictMode>
          <Root />
        </StrictMode>,
      )
    })
}
catch (e) {
  console.error(e)
  root.render(<EnvUnsupported />)
}
