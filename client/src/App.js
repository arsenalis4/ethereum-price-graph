import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import axios from 'axios';

export default function App() {
  // 사용자가 입력한 가격을 저장할 상태 변수
  const [price, setPrice] = useState(0);

  // 이더리움 코인의 시세 데이터를 저장할 상태 변수
  const [data, setData] = useState({
    labels: [], // x축에 표시할 시간
    datasets: [
      {
        label: 'Ethereum Price', // 그래프의 레이블
        data: [], // y축에 표시할 가격
        fill: false, // 그래프를 채우지 않음
        backgroundColor: 'rgb(255, 99, 132)', // 그래프의 색상
        borderColor: 'rgba(255, 99, 132, 0.2)', // 그래프의 테두리 색상
      },
    ],
  });

  // push notification을 보낼 권한을 요청하는 함수
  const requestNotificationPermission = async () => {
    if (Notification.permission !== 'granted') {
      // 권한이 없으면 요청함
      await Notification.requestPermission();
    }
  };

  // push notification을 보내는 함수
  const sendNotification = (message) => {
    // 권한이 있으면 보냄
    if (Notification.permission === 'granted') {
      new Notification(message);
    }
  };

  // 컴포넌트가 마운트될 때 실행할 함수
  useEffect(() => {
    // push notification 권한 요청
    requestNotificationPermission();

    // 이더리움 코인의 시세 데이터를 가져오는 함수
    const fetchPriceData = async () => {
      try {
        // 현재 시간을 가져옴
        const now = new Date();

        // 현재 시간을 x축에 추가함
        data.labels.push(now.toLocaleTimeString());

        // 코인게코 API에서 이더리움 코인의 현재 가격을 가져옴
        const response = await axios.get("http://localhost:3000/v1/price");
        const currentPrice = response.data.ethereum.usd;

        // 현재 가격을 y축에 추가함
        data.datasets[0].data.push(currentPrice);

        // 상태 변수를 업데이트함
        setData({ ...data });

        console.log(price);
        // 사용자가 입력한 가격보다 현재 가격이 높으면 push notification을 보냄
        if (currentPrice > price) {
          sendNotification(`Ethereum price is over ${price} USD!`);
        }
      } catch (error) {
        // 에러가 발생하면 콘솔에 출력함
        console.error(error);
      }
    };

    // 매 초마다 이더리움 코인의 시세 데이터를 가져옴
    const interval = setInterval(fetchPriceData, 5000);

    // 컴포넌트가 언마운트될 때 실행할 함수
    return () => {
      // 인터벌을 정지함
      clearInterval(interval);
    };
  }, []);

  // 사용자가 가격을 입력할 때 실행할 함수
  const handleChange = (event) => {
    // 입력된 값을 숫자로 변환하여 상태 변수에 저장함
    setPrice(Number(event.target.value));
  };

  // 그래프의 옵션을 설정하는 객체
  const options = {
    // scales: {
    //   y: {
    //     // y축의 최소값과 최대값을 설정함
    //     min: 1500,
    //     max: 2000,
    //   },
    // },
    plugins: {
      title: {
        // 그래프의 타이틀을 설정함
        display: true,
        text: 'Ethereum Price Chart',
      },
      legend: {
        // 그래프의 레전드를 설정함
        display: true,
        position: 'bottom',
      },
    },
  };

  return (
    <div>
      <h1>Ethereum Price Chart</h1>
      <Line data={data} options={options} /> {/* 그래프를 그림 */}
      <p>Enter the price you want to be notified:</p>
      <input type="number" value={price} onChange={handleChange} /> {/* 가격을 입력받음 */}
      <p>USD</p>
    </div>
  );
}