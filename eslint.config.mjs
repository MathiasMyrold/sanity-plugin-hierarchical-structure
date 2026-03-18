import {FlatCompat} from '@eslint/eslintrc'

const compat = new FlatCompat()

export default [
  ...compat.extends('sanity'),
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]
