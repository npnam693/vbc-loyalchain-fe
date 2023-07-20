import React, { useEffect, useState } from 'react'
import './myOrder.scss'
import appApi from '../../../api/appAPI'
import { Segmented } from 'antd'
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import MyOrderItem from '../../../components/marketplace/MyOrderItem';
import { useAppSelector } from '../../../state/hooks';

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

    const userState = useAppSelector(state => state.userState)
    useEffect(() => {
        const fetchData = async () => {
            const pending = await appApi.getUserOrder({status: 0})
            const inprogress = await appApi.getUserOrder({status: 1})
            const completed = await appApi.getUserOrder({status: 2})
            setdataFetch({completedOrders: completed?.data, pendingOrders: pending?.data, inprogressOrders: inprogress?.data})
        }
        fetchData()
    }, [userState.address])
  return (
    <div className='app-myOrder'>      
        <p className="title">Marketplace / My Order</p>
        <Segmented 
            onChange={(value) => setPageName(String(value))}
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
        <div className='list-order'>
            {
                pageName === 'inprogressOrder' ?
                dataFetch.inprogressOrders.map((item, index) => (
                    <MyOrderItem data = {item}/>
                ))
                : pageName === 'pendingOrder' ?
                dataFetch.pendingOrders.map((item, index) => (
                    <MyOrderItem data={item} isPendingOrder/>
                )) :
                dataFetch.completedOrders.map((item, index) => (
                    <MyOrderItem data={item}/>
                ))
            }    
        </div>
  </div>
  )
}

export default MyOrder