import React, { useEffect } from 'react'
import appApi from '../../../api/appAPI'
import HistoryItem from '../../../components/wallet/HistoryItem'
import { Tooltip } from 'antd'
import { LeftOutlined, LoadingOutlined, RightOutlined } from '@ant-design/icons'


const History = () => {
  const [data, setData] = React.useState<any[]>([])
  const [page, setPage] = React.useState<number>(1)
  const [loading, setLoading] = React.useState(true)
  const [nextPage, setNextPage] = React.useState<boolean>(false)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await appApi.getUserHistory(page)
      if(res.data.length < 12) {
        setNextPage(false)
        setData(res.data)

      } else if (res.data.length === 0) {
        setPage(page - 1)
      } else {
        setNextPage(true)
        setData(res.data)
      }
      setLoading(false)
    }
    fetchData()
  }, [page])


  return (
    <div>
      <div style={{height: '62vh', overflow:'scroll'}}>
        {
          !loading && data.length > 0 ? 
            data.map((item, index) => 
            <HistoryItem data={item} />
          ) : 
            <div style={{ 
              display:'flex', flexDirection:'row', alignItems:"center", justifyContent:'space-between',
              padding: "3px 20px 3px 14px",   margin: "5px 0", borderRadius: 3, 
              backgroundColor: 'rgba(219, 219, 219, 0.4)',
              height:"100%"
            }}
            >
              <LoadingOutlined rev="" style={{fontSize: '7rem', marginLeft:'auto', marginRight:'auto', color: '#ddd', fontWeight: 900}}/>
            </div>
        }
      </div>

           
        
      <div className="pagination-container">
            <Tooltip placement="bottom" title={page > 1 ? "Previous page" : "This is end"}>
                <LeftOutlined rev={""} className="pagination-btn"  style= {{fontSize: '1.8rem'}} 
                    onClick={() => page > 1 && setPage(page - 1) }
                />
            </Tooltip>
            <div className="pagination-current"> {page} </div>
            <Tooltip placement="bottom" title={nextPage ? "Next page" : "This is end."}>
                <RightOutlined rev={""} className="pagination-btn" style= {{fontSize: '1.8rem'}} 
                    onClick={() => {nextPage && setPage(page + 1)}}/>
            </Tooltip>
        </div>
    </div>
  )
}

export default History