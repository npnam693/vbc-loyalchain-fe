import React, { useEffect, useState } from 'react'
import './myOrder.scss'
import appApi from '../../../api/appAPI'
import { Segmented, Tooltip } from 'antd'
import { AppstoreOutlined, BarsOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import MyOrderItem from '../../../components/marketplace/MyOrderItem';
import { useAppSelector } from '../../../state/hooks';
import Order from '../../../components/marketplace/Order';

interface IDataOrder {
    pendingOrders: any[],
    inprogressOrders: any[],
    completedOrders: any[],
} 
const MyOrder = () => {
    const [dataFetch, setdataFetch] =  useState<IDataOrder>({
        pendingOrders: [],
        inprogressOrders: [],
        completedOrders: []
    })
    const [pageName, setPageName] = useState<string>('inprogressOrder')
    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(true)

    const userState = useAppSelector(state => state.userState)

    useEffect(() => {
        console.log("UE MYORDER CHẠY ROI")
        setLoading(true)
        const fetchData = async () => {
            let res;
            if (pageName === 'pendingOrder') {
                res = await appApi.getUserOrder({status: 0, page})
                res.data.length !== 0 && setdataFetch({...dataFetch, pendingOrders: res.data})
            }
            if (pageName === 'inprogressOrder') {
                res = await appApi.getUserOrder({status: 1, page})
                res.data.length !== 0 &&  setdataFetch({...dataFetch, inprogressOrders: res.data})
            }
            if (pageName === 'completedOrder') {
                res = await appApi.getUserOrder({status: 2, page})
                res.data.length !== 0 &&  setdataFetch({...dataFetch, completedOrders: res.data})
            }
            if (res?.data.length === 0) setPage(page - 1)
            setLoading(false)
        }
        fetchData()
    }, [pageName, userState, userState.balance, userState.wallet,page])

  return (
    <div className='app-myOrder'>      
        <p className="title">Marketplace / My Order</p>
        <div className='myorder-pane'>
            <Segmented 
                onChange={(value) => {setPageName(String(value)); setPage(1)}}
                options={[
                {
                    label: 'In progress Order',
                    value: 'inprogressOrder',
                    icon: <AppstoreOutlined rev={""}/>,
                },
                {
                    label: 'Pending Order',
                    value: 'pendingOrder',
                    icon: <BarsOutlined rev={""}/>,
                },
                {
                    label: 'Completed Order',
                    value: 'completedOrder',
                    icon: <BarsOutlined rev={""}/>,
                },
            ]}/>

        <div className="pagination-container">
            <Tooltip placement="bottom" title={"Previous page"}>
                <LeftOutlined rev={""} className="pagination-btn"  style= {{fontSize: '1.8rem'}} 
                    onClick={() => setPage(page - 1) }
                />
            </Tooltip>
            <div className="pagination-current"> {page} </div>
            <Tooltip placement="bottom" title={"Next page"}>
                <RightOutlined rev={""} className="pagination-btn" style= {{fontSize: '1.8rem'}} 
                    onClick={() => {setPage(page + 1)}}/>
            </Tooltip>
        </div>
        </div>
        <div className='list-order'>
            {
                loading ? Array(12).fill(0).map((item, index) => <Order data={{}} skeleton />) :        
                <>
                {
                    pageName === 'inprogressOrder' &&
                    dataFetch.inprogressOrders.map((item, index) => (
                        <MyOrderItem data = {item}/>
                        ))
                    }
                {
                    pageName === 'pendingOrder' &&
                    dataFetch.pendingOrders.map((item, index) => (
                        <MyOrderItem data={item} isPendingOrder/>
                        ))
                    }
                {
                    pageName === 'completedOrder' &&
                    dataFetch.completedOrders.map((item, index) => (
                        <MyOrderItem data={item} />
                        ))
                    }    
                </>
            }
        </div>
  </div>
  )
}

export default MyOrder