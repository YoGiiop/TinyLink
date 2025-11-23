import React from 'react'
import CreateLinkForm from '../components/CreateLinkForm'

export default function Home(){
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold mb-4">Shorten URLs instantly!</h1>
      <CreateLinkForm />
    </div>
  )
}
