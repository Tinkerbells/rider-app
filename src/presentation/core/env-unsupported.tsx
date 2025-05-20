import { useMemo } from 'react'
import { isColorDark, isRGB, retrieveLaunchParams } from '@telegram-apps/sdk-react'

export function EnvUnsupported() {
  const [platform, isDark] = useMemo(() => {
    try {
      const lp = retrieveLaunchParams()
      const { bg_color: bgColor } = lp.tgWebAppThemeParams
      return [lp.tgWebAppPlatform, bgColor && isRGB(bgColor) ? isColorDark(bgColor) : false]
    }
    catch {
      return ['android', false]
    }
  }, [])

  return (
    <div></div>
  )
}
