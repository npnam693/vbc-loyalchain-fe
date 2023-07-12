import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Divider, Button, Slider, Drawer, Modal, InputNumber, Radio } from "antd";

import "./Marketplace.scss";
import Order from "../../components/marketplace/Order";
import SelectToken from "../../components/app/SelectToken";
import MarketPane from "../../components/marketplace/MarketPane";
import TableOrder from "../../components/marketplace/TableOrder";
import StatisticItem from "../../components/marketplace/StatisticItem";
import { CloseCircleOutlined, UploadOutlined } from "@ant-design/icons";
import appApi from "../../api/appAPI";
import { useAppSelector } from "../../state/hooks";

enum NETWORK {
  MBC = "MBC",
  AGD = "AGD",
  CROSS = "CROSS",
}




interface IFilterData {
  network: string,
  from: any,
  to: any,
  amountFrom:  [number, number],
  amountTo:  [number, number],
} 
const filterRawData : IFilterData = {
  network: "",
  from: "",
  to: "",
  amountFrom: [0, 10000],
  amountTo: [0, 10000],
};
export const showConfirmConnectWallet = () => {
  Modal.confirm({
    title: 'You need to connect a wallet to create order!',
    okText: 'Connect Wallet',
    cancelText: 'Cancel ',
    onOk() {
      console.log('OK');
    },
    onCancel() {
      console.log('Cancel');
    },
  })
};
const Marketplace = () => {
  const [isListMode, setIsListMode] = useState(false);
  const [selectState, setSelectState] = useState({
    selectFrom: false,
    selectTo: false
  });
  const [data, setData] = useState([])
  const [filter, setFilter] = useState({
    open: false,
    isFilterMode: true,
    filterData: filterRawData,
  });
  const appState = useAppSelector((state) => state.appState)
  // const [quantityFilter, setQuantityFilter] = useState({
  //   from: [0,0],
  //   to: [0,0]
  // });
  const navigate = useNavigate()

  console.log(filter)
  useEffect(() => {
    const fetchDataOrder = async () => {
      const tdata = await appApi.getAllOrders()
      if(tdata) setData(tdata.data)
      console.log(tdata)
    }
    fetchDataOrder()
  }, [])

  const toggleModeView = () => { setIsListMode(!isListMode) };
  
  
  const openFilter = () => {
    setFilter({
      open: true,
      isFilterMode: true,
      filterData: filter.filterData,
    });
  };
  const hdClickClearFilter = () => {
    setFilter({ ...filter, filterData: filterRawData });
  };

  const closeSelectToken = () => {setSelectState({selectFrom: false, selectTo: false}) };




  const setFilterNetwork = (network: string) => {
    setFilter({ ...filter, filterData: { ...filter.filterData, network } });
  }



  return (
    <div className="app-market">
      <Drawer
        className="app-market-filter"
        style={{ backgroundColor: "#eee" }}
        width={500}
        closable={false}
        onClose={() => setFilter({ ...filter, open: false })}
        open={filter.open}
      >
        {filter.open && (
          <>
            <div className="header">
              <div className="header--tab">
                <div
                  className={clsx("header--tab--item", {
                    "header--tab--item--show": filter.isFilterMode,
                  })}
                  onClick={() => setFilter({ ...filter, isFilterMode: true })}
                >
                  Filter
                </div>

                <div
                  className={clsx("header--tab--item", {
                    "header--tab--item--show": !filter.isFilterMode,
                  })}
                  onClick={() => setFilter({ ...filter, isFilterMode: false })}
                >
                  Sort
                </div>
              </div>

              <div className="header--option">
                <div
                  className="header--option--item"
                  onClick={hdClickClearFilter}
                >
                  Clear All
                </div>
                <div
                  onClick={() =>
                    setFilter({
                      open: !filter.open,
                      isFilterMode: true,
                      filterData: filter.filterData,
                    })
                  }
                >
                  <CloseCircleOutlined
                    className="close-icon"
                    rev={"size"}
                    size={30}
                  />
                </div>
              </div>
            </div>

            <Divider className="divider" />

            {filter.isFilterMode ? (
              <div className="content-filter">
                <div className="item">
                  <p className="item--title">Swap from</p>
                  <div className="item--token">
                    <p>Token</p>  
                    <Button
                      type="primary"
                      onClick={() => setSelectState({selectFrom: true, selectTo: false})}
                      style={filter.filterData.from && {padding: '0 20px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                    >
                      {
                        filter.filterData.from !== '' ?
                        <div style={{display:'flex', flexDirection:'row', alignItems:"center"}}>
                          <img src={filter.filterData.from.image} alt="token" style={{height: 24, marginRight: 12}}/>
                          <p style={{color: 'white', fontWeight: 600, fontSize: '1.6rem', minWidth: 0}}>{filter.filterData.from.symbol}</p>
                        </div>
                        :
                        'Select a token'
                      }
                    </Button>
                  </div>
                  <div className="item--token">
                    <p>Quantity</p>
                      <Slider
                      min={0}
                      max={10000}
                      range={{ draggableTrack: true }}
                      step={20}
                      value={filter.filterData.amountFrom}
                      defaultValue={[0, 100000]}
                      onChange={(value : [number, number]) => setFilter({ ...filter, filterData: {...filter.filterData, amountFrom: value}})}
                      style={{width: '80%'}}
                      railStyle={{
                        borderColor: "white",
                        backgroundColor: "#999",
                      }}
                    />
                  </div>

                  <div className = "item--amount">
                    <InputNumber
                      min={0}
                      max={10000}
                      style={{ width: "100px" }}
                      onChange={(value) => setFilter({ ...filter, filterData: { 
                        ...filter.filterData, 
                        amountFrom: [Number(value), filter.filterData.amountFrom[0] ]
                      }})}
                      value={filter.filterData.amountFrom[0]}
                      placeholder="Amount"
                    />
                    <InputNumber
                      min={0}
                      max={10000}
                      style={{ width: "100px" }}
                      onChange={(value) => setFilter({ ...filter, filterData: { 
                        ...filter.filterData, 
                        amountFrom: [filter.filterData.amountFrom[0] ,Number(value)]
                      }})}
                      value={filter.filterData.amountFrom[1]}
                      placeholder="Amount"
                    />
                  </div>

                 
                </div>

                <div className="item">
                  <p className="item--title">Swap to</p>
                  <div className="item--token">
                    <p>Token</p>  
                    <Button
                      type="primary"
                      onClick={() => setSelectState({selectFrom: false, selectTo: true})}
                      style={filter.filterData.to && {padding: '0 20px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
                    >
                      {
                        filter.filterData.to !== '' ?
                        <div style={{display:'flex', flexDirection:'row', alignItems:"center"}}>
                          <img src={filter.filterData.to.image} alt="token" style={{height: 24, marginRight: 12}}/>
                          <p style={{color: 'white', fontWeight: 600, fontSize: '1.6rem', minWidth: 0}}>{filter.filterData.to.symbol}</p>
                        </div>
                        :
                        'Select a token'
                      }
                    </Button>

                  </div>
                  <div className="item--token">
                  <p>Quantity</p>
                      <Slider
                      min={0}
                      max={10000}
                      range={{ draggableTrack: true }}
                      step={20}
                      value={filter.filterData.amountTo}
                      defaultValue={[0, 100000]}
                      onChange={(value : [number, number]) => setFilter({ ...filter, filterData: {...filter.filterData, amountTo: value}})}
                      style={{width: '80%'}}
                      railStyle={{
                        borderColor: "white",
                        backgroundColor: "#999",
                      }}
                    />
                  </div>

                  <div className = "item--amount">
                    <InputNumber
                      min={0}
                      max={10000}
                      style={{ width: "100px" }}
                      onChange={(value) => setFilter({ ...filter, filterData: { 
                        ...filter.filterData, 
                        amountTo: [Number(value), filter.filterData.amountTo[0] ]
                      }})}
                      value={filter.filterData.amountTo[0]}
                      placeholder="Amount"
                    />
                    <InputNumber
                      min={0}
                      max={10000}
                      style={{ width: "100px" }}
                      onChange={(value) => setFilter({ ...filter, filterData: { 
                        ...filter.filterData, 
                        amountTo: [filter.filterData.amountTo[0] ,Number(value)]
                      }})}
                      value={filter.filterData.amountTo[1]}
                      placeholder="Amount"
                    />
                  </div>
                 
                </div>


                <div className="item">
                  <p className="item--title">Network</p>
                  <div className="item--amount" style={{marginLeft:90}}>
                    <Radio.Group defaultValue={() => {
                      if (filter.filterData.network === 'MBC')
                        return 'a'
                      else if (filter.filterData.network === 'AGD')
                        return 'b'
                      else if (filter.filterData.network === 'Cross')
                        return 'c'
                      else return ''
                    }} size="middle" >
                      <Radio.Button value="a" onClick={() => setFilter({...filter, filterData: {...filter.filterData, network: "MBC"}})}>MBC Network</Radio.Button>
                      <Radio.Button value="b" onClick={() => setFilter({...filter, filterData: {...filter.filterData, network: "AGD"}})}>AGD Network</Radio.Button>
                      <Radio.Button value="c" onClick={() => setFilter({...filter, filterData: {...filter.filterData, network: "Cross"}})}>Cross Network</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>


                {(selectState.selectFrom || selectState.selectTo) && (
                  <div style={{zIndex: 2}}>
                    <SelectToken
                      closeFunction={closeSelectToken}
                      top_css="calc((100vh - 600px) / 2 - 20px)"
                      right_css="16px"
                      onClickSelect={(token) => {
                        if (selectState.selectFrom) {
                          if (appState.isConnectedWallet) {
                            setFilter({ ...filter, filterData: {...filter.filterData, from: token.token}});
                          } else {
                            setFilter({ ...filter, filterData: {...filter.filterData, from: token}});
                          }
                        }             
                        else {
                          if (appState.isConnectedWallet) {
                            setFilter({ ...filter, filterData: {...filter.filterData, to: token.token}});
                          } else {
                            setFilter({ ...filter, filterData: {...filter.filterData, to: token}});
                          }
                        }
                        setSelectState({selectFrom: false, selectTo: false});
                      }
                      }
                      />
                  </div>
                )}

              </div>
              
            ) : (
              <div></div>
            )}
          </>
        )}
      </Drawer>

      <p className="title">Marketplace</p>
      <div className="header">
        <div className="statistic-list">
          <StatisticItem title="Amount Order" note="total" value={102101}/>
        </div>

        <Button className="btn-create" onClick={appState.isConnectedWallet ? () => navigate('create') : showConfirmConnectWallet}>
          <UploadOutlined rev={""} style={{fontSize:'2.2rem'}}/>
          Create Order
        </Button>
      </div>
      
      <MarketPane
        isListMode={isListMode}
        toggleModeView={toggleModeView}
        openFilter={openFilter}
        funcSwapTo={() => setSelectState({selectFrom: false, selectTo: true})}
        funcSwapFrom={() => setSelectState({selectFrom: true, selectTo: false})}
        funcClearFilter={hdClickClearFilter}
        funcNetwork={setFilterNetwork}
        dataFilter={filter.filterData}
      />
      
      {isListMode ? (
        <TableOrder data={data} />
      ) : (
        <div style={{display: 'flex', flexDirection: 'row', flexWrap:'wrap', justifyContent:"space-between"}}>
          {
            data.map((item, index) => 
              <Order data = {item}/>
            )
          } 
        </div>
      )}

      {((selectState.selectFrom || selectState.selectTo) && !filter.open) && (
        <div>
          <SelectToken
            closeFunction={closeSelectToken}
            top_css="calc((100vh - 600px) / 2 - 20px)"
            onClickSelect={(token) => {
              if (selectState.selectFrom) {
                if (appState.isConnectedWallet) {
                  setFilter({ ...filter, filterData: {...filter.filterData, from: token.token}});
                } else {
                  setFilter({ ...filter, filterData: {...filter.filterData, from: token}});
                }
              }             
              else {
                if (appState.isConnectedWallet) {
                  setFilter({ ...filter, filterData: {...filter.filterData, to: token.token}});
                } else {
                  setFilter({ ...filter, filterData: {...filter.filterData, to: token}});
                }
              }
              setSelectState({selectFrom: false, selectTo: false});
            }}
            isCheckNetwork={false}
          />
        </div>
      )}


    </div>
  )
};

export default Marketplace;
