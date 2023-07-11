import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Divider, Button, Slider, Drawer, Modal } from "antd";

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

const filterRawData = {
  network: "",
  from: "",
  to: "",
  amountFrom: "",
  amountTo: "",
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


  const showPropsConfirm = () => {
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
                  <p>Swap from</p>  
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setSelectState({selectFrom: true, selectTo: false})}
                  >
                    Select a token
                  </Button>
                  <p>Quantity</p>
                  <Slider
                    min={0}
                    max={10000}
                    range={{ draggableTrack: true }}
                    step={20}
                    railStyle={{
                      borderColor: "white",
                      color: "white",
                      backgroundColor: "#999",
                    }}
                  />
                </div>

                <div className="item">
                  <p>Swap to</p>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setSelectState({selectFrom: false, selectTo: true})}
                  >
                    Select a token
                  </Button>
                  <p>Quantity</p>
                  <Slider
                    min={0}
                    max={10000}
                    range={{ draggableTrack: true }}
                    step={20}
                    railStyle={{
                      borderColor: "white",
                      color: "white",
                      backgroundColor: "#999",
                    }}
                  />
                </div>

                {(selectState.selectFrom || selectState.selectTo) && (
                  <div>
                    <SelectToken
                      closeFunction={closeSelectToken}
                      top_css="calc((100vh - 600px) / 2 - 20px)"
                      right_css="16px"
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

        <Button className="btn-create" onClick={appState.isConnectedWallet ? () => navigate('create') : showPropsConfirm}>
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
