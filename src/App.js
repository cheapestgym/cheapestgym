import React, {useState, useEffect} from 'react';
import { Button, message, Layout, Row, Col , Input} from 'antd'
import DaumMap from 'daum-maps-react'

import SDK from 'apis/SDK';
import IconexConnect from 'apis/IconexConnect';
import CONST from './constants';
import { AdPage } from 'components'

// import logo from './logo.svg';
import marker from 'assets/images/marker.png'
import './App.css';

import {
  IconConverter
} from 'icon-sdk-js'

//define
const { Header , Content } = Layout;

function App() {
  const [ mode, setMode ] = useState( CONST.MODE['LOG_OUT'])
  const [ myAddress, setMyAddress ] = useState('')
  const [ cheapestPrice1, setCheapestPrice1 ] = useState(0)
  const [ cheapestPrice2, setCheapestPrice2 ] = useState(0)
  const [ cheapestPrice3, setCheapestPrice3 ] = useState(0)
  const [ cheapestPrice4, setCheapestPrice4 ] = useState(0)
  const [priceToUpdate1, setPriceToUpdate1 ] = useState(0)
  const [priceToUpdate2, setPriceToUpdate2 ] = useState(0)
  const [priceToUpdate3, setPriceToUpdate3 ] = useState(0)
  const [priceToUpdate4, setPriceToUpdate4 ] = useState(0)

  useEffect(()=> {
    get_set_Price(1, setCheapestPrice1)
    get_set_Price(2, setCheapestPrice2)
    get_set_Price(3, setCheapestPrice3)
    get_set_Price(4, setCheapestPrice4)
  },[])

  // 가격 가져오기 
  async function get_set_Price(label, obj_CheapestPrice){
    const price = await SDK.iconService.call(
      SDK.callBuild({
        methodName: 'get_lowest_price',
        params: {
          label: IconConverter.toHex(Number(label))
        },
        to: window.CONTRACT_ADDRESS,
      })
    ).execute()
    obj_CheapestPrice(Number(price))
  }
  async function getAddress()  { // 로그인
    const { iconService, callBuild } = SDK
    const myAddress = await IconexConnect.getAddress()
    setMyAddress(myAddress)
    setMode(CONST.MODE['LOG_IN'])
  }
  function mapRender(element, daum) {
    const latitude = 37.5674844, longitude = 126.9880931
    daum.maps.load(() => {
      const map = new daum.maps.Map(element, {
        center: new daum.maps.LatLng(latitude, longitude),
        level: 3,
      });

      const marker = new daum.maps.Marker({
        position: new daum.maps.LatLng(latitude, longitude),
      });

      marker.setMap(map);
    });
  }
  function onInputChange(e, label) {
    if(label===1) {
      setPriceToUpdate1(e.target.value)
    }
    if(label===2) {
      setPriceToUpdate2(e.target.value)
    }
    if(label===3) {
      setPriceToUpdate3(e.target.value)
    }
    if(label===4) {
      setPriceToUpdate4(e.target.value)
    }
  }

  async function updatePrice(label) {
    var priceToUpdate = priceToUpdate1
    var setCheapestPrice = setCheapestPrice1
    if(label === 2) {
      priceToUpdate = priceToUpdate2
      setCheapestPrice = setCheapestPrice2
    }
    if(label === 3) {
      priceToUpdate = priceToUpdate3
      setCheapestPrice = setCheapestPrice3
    }
    if(label === 4) {
      priceToUpdate = priceToUpdate4
      setCheapestPrice = setCheapestPrice4
    }
    const txObj = SDK.sendTxBuild({
      from: myAddress,
      to: window.CONTRACT_ADDRESS,
      methodName: 'update_lowest_price',
      params: {
        label: IconConverter.toHex(Number(label)), 
        price: IconConverter.toHex(Number(priceToUpdate))
      },
    })
    const tx = await IconexConnect.sendTransaction(txObj)
    console.log(tx)
    if (tx == null){
      alert("가격 갱신에 실패했어요....")
    }
    setCheapestPrice(Number(priceToUpdate))
  }
  return (
    <Layout>
      <Header><Button size="large" style={{fontFamily: "monospace"}} onClick={getAddress}>ICONex 연동하기</Button></Header>
      <Content>
        <Row type="flex" justify="center" align="middle" className={`page-wrap`}>
          <Col>
            <img src={marker} alt="marker" style={{width: 50, margin: 20, marginTop:30}}/>
            <h1 style={{fontSize: 40, fontFamily: "monospace"}}>Find the Cheapest Gym <br/> near My Place.</h1>
            <h2 style={{fontSize: 20, fontFamily: "fantasy"}}>- 을지로 3가 편-</h2>
            <div style={{width: 500, height: 300, marginBottom: 20, marginTop: 10}}>
              <DaumMap 
                apiKey="bd544c2a16fcb0ffcb56bec002d0d539"
                mapId={ 'daum-map' }
                render={mapRender}
              />
            </div>
            <Row type="flex" style={{marginBottom: 10, fontFamily:"fantasy"}}>
              <Col span={8} style={{fontWeight: "bold"}}>헬스장 리스트</Col>
              <Col span={8} style={{fontWeight: "bold"}}>현재 최저가</Col>
              <Col span={8} style={{fontWeight: "bold"}}>최저가 갱신하기</Col>
            </Row>
            <Row type="flex">
              <Col span={8}>우리동네 헬스장</Col>
              <Col span={8}>{cheapestPrice1}</Col>
              <Col span={8}><Input size="large" type="number" value={priceToUpdate1} onChange={(e)=>onInputChange(e, 1)} addonAfter={<Button onClick={()=>updatePrice(1)} disabled={mode === CONST.MODE['LOG_OUT'] } icon="check"/>}/></Col>
            </Row>
            <Row type="flex">
              <Col span={8}>옆동네 헬스장</Col>
              <Col span={8}>{cheapestPrice2}</Col>
              <Col span={8}><Input size="large" type="number" value={priceToUpdate2} onChange={(e)=>onInputChange(e, 2)} addonAfter={<Button onClick={()=>updatePrice(2)} disabled={mode === CONST.MODE['LOG_OUT'] } icon="check"/>}/></Col>
            </Row>
            <Row type="flex">
              <Col span={8}>아주무거 헬스장</Col>
              <Col span={8}>{cheapestPrice3}</Col>
              <Col span={8}><Input size="large" type="number" value={priceToUpdate3} onChange={(e)=>onInputChange(e, 3)} addonAfter={<Button onClick={()=>updatePrice(3)} disabled={mode === CONST.MODE['LOG_OUT'] } icon="check"/>}/></Col>
            </Row>
            <Row type="flex">
              <Col span={8}>작삼2시 헬스장</Col>
              <Col span={8}>{cheapestPrice4}</Col>
              <Col span={8}><Input size="large" type="number" value={priceToUpdate4} onChange={(e)=>onInputChange(e, 4)}  addonAfter={<Button onClick={()=>updatePrice(4)} disabled={mode === CONST.MODE['LOG_OUT'] } icon="check"/>}/></Col>
            </Row>
          </Col>
        </Row>
    </Content>
    </Layout>
  );
}

export default App;
