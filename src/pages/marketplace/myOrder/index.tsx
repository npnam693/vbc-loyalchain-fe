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
            Promise.all([appApi.getUserOrder({status: 0}), appApi.getUserOrder({status: 1}), await appApi.getUserOrder({status: 2})]) 
            .then(res => {
                setdataFetch({
                    pendingOrders: res[0]?.data, 
                    inprogressOrders: res[1]?.data,
                    completedOrders: res[2]?.data, 
                })
            })
            .catch(err => console.log(err))
        }
        fetchData()
    
    }, [userState])

    console.log(dataFetch)
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
        </div>
  </div>
  )
}

export default MyOrder