// client/src/components/CreateLinkForm.jsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { createLink } from '../api'
import copy from 'copy-to-clipboard'
import { addToast } from '../hooks/useToasts'

const schema = yup.object({
  originalUrl: yup
    .string()
    .url('Enter a valid URL')
    .required('Required'),
  code: yup
    .string()
    .nullable()
    .transform((v) => (v === '' ? null : v))
    .matches(/^[A-Za-z0-9]{6,8}$/, '6–8 characters, A–Z, a–z, 0–9')
    .optional(),
})

export default function CreateLinkForm({ onCreated }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      originalUrl: '',
      code: '',
    },
  })

  const [serverError, setServerError] = useState(null)
  const [result, setResult] = useState(null)

  const onSubmit = async (values) => {
    setServerError(null)
    setResult(null)

    try {
      const payload = {
        originalUrl: values.originalUrl,
      }
      if (values.code) payload.code = values.code

      const link = await createLink(payload)
      setResult(link)
      addToast('Short link created')
      reset({ originalUrl: '', code: '' })
      onCreated?.(link)
    } catch (err) {
      const status = err.response?.status
      const msg = err.response?.data?.message

      if (status === 409) {
        setServerError('That code is already in use. Please choose another.')
      } else if (msg) {
        setServerError(msg)
      } else {
        setServerError('Something went wrong. Please try again.')
      }
    }
  }

  const handleCopy = () => {
    if (!result?.shortUrl) return
    copy(result.shortUrl)
    addToast('Short URL copied!')
  }

  return (
    <div className="card space-y-3">
      <h3 className="font-medium text-sm">Create a short link</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Long URL
          </label>
          <input
            type="url"
            placeholder="https://example.com/very/long/url"
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            {...register('originalUrl')}
          />
          {errors.originalUrl && (
            <p className="text-xs text-red-600">{errors.originalUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-700">
            Custom short code (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. docs123"
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            {...register('code')}
          />
          <p className="text-[11px] text-slate-500">
            6–8 characters, letters and numbers only.
          </p>
          {errors.code && (
            <p className="text-xs text-red-600">{errors.code.message}</p>
          )}
        </div>

        {serverError && (
          <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? 'Creating…' : 'Create link'}
        </button>
      </form>

      {result && (
        <div className="mt-3 border-t border-slate-100 pt-3 space-y-1 text-sm">
          <p className="text-xs font-medium text-slate-500">Created link</p>
          <button
            type="button"
            onClick={handleCopy}
            className="text-left text-blue-600 hover:underline break-all"
          >
            {result.shortUrl}
          </button>
          <p className="text-xs text-slate-500">
            Original:{' '}
            <a
              href={result.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {result.originalUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
