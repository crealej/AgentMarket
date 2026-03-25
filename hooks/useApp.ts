import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

// Hook for fetching data with loading and error states
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

// Hook for pull-to-refresh
export function useRefresh(refetch: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  return { refreshing, onRefresh }
}

// Hook for form handling
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    if (validate) {
      const validationErrors = validate(values)
      if (validationErrors[field]) {
        setErrors(prev => ({ ...prev, [field]: validationErrors[field] }))
      }
    }
  }, [values, validate])

  const handleSubmit = useCallback((onSubmit: (values: T) => void | Promise<void>) => {
    return async () => {
      if (validate) {
        const validationErrors = validate(values)
        setErrors(validationErrors)
        if (Object.keys(validationErrors).length > 0) {
          return
        }
      }
      await onSubmit(values)
    }
  }, [values, validate])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
  }
}

// Hook for debounced value
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook for async operations with loading state
export function useAsync<T, E = string>() {
  const [state, setState] = useState<{
    loading: boolean
    error: E | null
    data: T | null
  }>({
    loading: false,
    error: null,
    data: null,
  })

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState({ loading: true, error: null, data: null })
    try {
      const result = await asyncFn()
      setState({ loading: false, error: null, data: result })
      return result
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred'
      setState({ loading: false, error: error as E, data: null })
      throw err
    }
  }, [])

  return { ...state, execute }
}
