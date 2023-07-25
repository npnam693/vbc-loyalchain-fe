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
    const [render, setRender ] = useState<boolean>(false)
    const [next, setNext] = useState<boolean>(false)
    const userState = useAppSelector(state => state.userState)
    const fetchData = async () => {
        let res;
        if (pageName === 'pendingOrder') {
            res = await appApi.getUserOrder({status: 0, page})
            if (res.data.length < 12) {
                setdataFetch({...dataFetch, pendingOrders: res.data})
                setNext(false)
            } else if (res.data.length === 0) {
                setNext(false)
                setPage(page - 1)                
            } else {
                setdataFetch({...dataFetch, pendingOrders: res.data})
                setNext(true)
            }
        }
        if (pageName === 'inprogressOrder') {
            res = await appApi.getUserOrder({status: 1, page})
            res.data.length !== 0 &&  setdataFetch({...dataFetch, inprogressOrders: res.data})
            if (res.data.length < 12) {
                setdataFetch({...dataFetch, inprogressOrders: res.data})
                setNext(false)
            } else if (res.data.length === 0) {
                setNext(false)
                setPage(page - 1)                
            } else {
                setdataFetch({...dataFetch, inprogressOrders: res.data})
                setNext(true)
            }
        }
        if (pageName === 'completedOrder') {
            res = await appApi.getUserOrder({status: 2, page})
            if (res.data.length < 12) {
                setdataFetch({...dataFetch, completedOrders: res.data})
                setNext(false)
            } else if (res.data.length === 0) {
                setNext(false)
                setPage(page - 1)                
            } else {
                setdataFetch({...dataFetch, completedOrders: res.data})
                setNext(true)
            }
        }
        setLoading(false)
    }
    
    useEffect(() => {
        setLoading(true)
        fetchData()
    }, [pageName, page])

    useEffect(() => {
        fetchData()
    }, [render])



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
            ]} className='segmented'/>

            <div className="pagination-container">
                <Tooltip placement="bottom" title={page > 1 ? "Previous page" : "This is end."}>
                    <LeftOutlined rev={""} className="pagination-btn"  style= {{fontSize: '1.8rem'}} 
                        onClick={() => (page > 1 && !loading) && setPage(page - 1) }
                    />
                </Tooltip>
                <div className="pagination-current"> {page} </div>
                <Tooltip placement="bottom" title={next ? "Next page" : "This is end."}>
                    <RightOutlined rev={""} className="pagination-btn" style= {{fontSize: '1.8rem'}} 
                        onClick={() => {next && !loading && setPage(page + 1)}}/>
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
                        <MyOrderItem data = {item} rerender={() => setRender(!render)}/>
                        ))
                    }
                {
                    pageName === 'pendingOrder' &&
                    dataFetch.pendingOrders.map((item, index) => (
                        <MyOrderItem data={item} isPendingOrder rerender={() => setRender(!render)}/>
                        ))
                    }
                {
                    pageName === 'completedOrder' &&
                    dataFetch.completedOrders.map((item, index) => (
                        <MyOrderItem data={item} rerender={() => setRender(!render)} />
                        ))
                    }    
                </>
            }
        </div>
  </div>
  )
}

export default MyOrder