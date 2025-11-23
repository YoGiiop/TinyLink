import React, {useEffect, useState} from 'react'
import { api } from '../api'
import dayjs from 'dayjs'

export default function AnalyticsPanel({linkId}){
  const [data, setData] = useState(null)

  useEffect(()=>{
    if(!linkId) return
    api.get(`/links/${linkId}/analytics`).then(r=>setData(r.data)).catch(console.error)
  },[linkId])

  if(!data) return <p>Loading analytics...</p>

  return (
    <div className="card space-y-2">
      <h3 className="font-medium">Analytics</h3>
      <p>Total Clicks: {data.totalClicks}</p>
      <p>Unique: {data.unique}</p>
      <p>Last Click: {data.lastClick?dayjs(data.lastClick).format('YYYY-MM-DD HH:mm'):'—'}</p>
    </div>
  )
}
