import React, { useEffect } from 'react'
import appApi from '../../../api/appAPI'
import HistoryItem from '../../../components/wallet/HistoryItem'


const History = () => {
  const [data, setData] = React.useState<any[]>([])
  const [page, setPage] = React.useState<number>(1)
  useEffect(() => {
    const fetchData = async () => {
      const res = await appApi.getUserHistory(1)
      setData(res.data)
    }
    fetchData()
  }, [])


  console.log(data)
  
  return (
    <div>
      {
        data.length > 0 ? data.map((item, index) => 
          <HistoryItem data={item} />
        ) : <></>
      }
    </div>
  )
}

export default History