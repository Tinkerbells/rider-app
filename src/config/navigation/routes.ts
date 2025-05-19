import { route } from 'react-router-typesafe-routes'

export const root = route({
  path: '',
  children: {
    horses: route({
      path: 'horses',
    }),
    tasks: route({
      path: 'tasks',
    }),
  },
})
