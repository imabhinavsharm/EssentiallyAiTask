import React, { useState } from 'react';
import { FaAmazon, FaApple, FaArrowAltCircleUp, FaArrowCircleDown, FaFacebook, FaGoogle, FaMicrosoft } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import './app.css'
const App = () => {
	const [stockData, setStockData] = useState({
		close: "",
		high: "",
		low: "",
		open: "",
		preMarket: "",
		symbol: "",
		volume: ""
	})
	const [error, setError] = useState({
		status: "",
		message: ""
	})
	const [selectedStock, setSelectedStock] = useState({
		name: "",
		date: new Date()
	})
	const [isLoading, setIsLoading] = useState(false)
	const [stockDataResponse, setStockDataResponse] = useState(false)
	const getStockData = (stockName, date) => {
		setError({
			status: "",
			message: ""
		})
		setIsLoading(true)
		const body = {
			"stockName": stockName,
			"date": date
		}
		const apiUrl = 'http://localhost:5000/api/fetchStockData';

		axios.post(apiUrl, body)
			.then(response => {
				setIsLoading(false)
				// Handle the response data here
				if (response.status === 200) {
					let responseData = response.data;
					setStockDataResponse(true)
					setStockData({
						close: responseData.close,
						high: responseData.high,
						low: responseData.low,
						open: responseData.open,
						preMarket: responseData.preMarket,
						symbol: responseData.symbol,
						volume: responseData.volume
					});
				}
				else {
					setError({
						status: response.status,
						message: "Can not proceed with request for now."
					})
				}
			})
			.catch(error => {
				// Handle errors here
				setIsLoading(false)
				let response = error?.response
				setError({
					status: response?.status ? response?.status : 500,
					message: response?.statusText ? response?.statusText : "Internal Server Error"
				})
			});
	}

	const submitData = () => {
		let date = changeDateFormat(selectedStock.date)
		let stockName = selectedStock.name
		getStockData(stockName, date)
	}
	const changeDateFormat = (dateString) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
	const Loader = () => {
		return <div class="center-container">
			<div className="three-body">
				<div className="three-body__dot"></div>
				<div className="three-body__dot"></div>
				<div className="three-body__dot"></div>
			</div>
		</div>
	}
	const resetData = () => {
		setSelectedStock({
			name: "",
			date: new Date()
		})
		setStockDataResponse(false)
		setError({
			status: "",
			message: ""
		})
	}
	return (
		<>
			{
				isLoading ? <Loader /> :
					<>
						<div>
							{stockDataResponse ?
								<h3>Showing Result For : {selectedStock.name} {changeDateFormat(selectedStock.date)} </h3> :
								<h3>Some Popular Stocks</h3>}
						</div>
						{!stockDataResponse ?
							<div className="card-container">
								<div className="card" onClick={() => setSelectedStock({ name: "AAPL" })}>
									<FaApple />
									<div className="stock-name">Apple Inc. (AAPL)</div>
								</div>
								<div className="card" onClick={() => setSelectedStock({ name: "AMZN" })}>
									<FaAmazon />
									<div className="stock-name">Amazon.com Inc. (AMZN)</div>
								</div>
								<div className="card" onClick={() => setSelectedStock({ name: "MSFT" })} >
									<FaMicrosoft />
									<div className="stock-name">Microsoft Corporation. (MSFT)</div>
								</div>
								<div className="card" onClick={() => setSelectedStock({ name: "GOOGL" })} >
									<FaGoogle />
									<div className="stock-name">Alphabet Inc. (Google) (GOOGL)</div>
								</div>
								<div className="card" onClick={() => setSelectedStock({ name: "FB" })}>
									<FaFacebook />
									<div className="stock-name">Facebook Inc. (FB)</div>
								</div>

							</div>
							: null}
						<div className='input-div'>
							<input className="input" name="text" placeholder="Search Stock..." type="search"
								value={selectedStock.name}
								onChange={(e) => setSelectedStock({ ...selectedStock, name: e.target.value })}
							/>

							{
								selectedStock.name ?
									<DatePicker
										className="input datepicker"
										selected={selectedStock.date}
										value={selectedStock.date}
										maxDate={new Date()}
										onChange={(date) =>
											setSelectedStock({ ...selectedStock, date: date })} />
									: null
							}
							{
								selectedStock.name && selectedStock.date ?
									<button onClick={submitData}>Submit</button> : null
							}
							{
								selectedStock.name && selectedStock.date && stockDataResponse ?
									<button onClick={resetData}>Reset</button> : null
							}
						</div>
						{
							stockDataResponse ?
								<div className="card-Data">
									<div className="card-stock">
										<div className="card-stock-data">
											<p>Stock : <span>{stockData.symbol}</span></p>
											<p>Close: <span>{stockData.close}</span></p>
											<p>High: <span>{stockData.high}</span> <FaArrowAltCircleUp style={{ color: "#98F36D" }} /></p>
											<p>Low: <span>{stockData.low}</span> <FaArrowCircleDown style={{ color: "red" }} /></p>
											<p>Open: <span>{stockData.open}</span></p>
											<p>Pre Market: <span>{stockData.preMarket}</span></p>

										</div>
									</div>
								</div> : null
						}
						{
							!stockDataResponse && error.status ?
								<div className='card-Data'>
									<div className=" card error-card">
										<h4>{error.status}</h4>
										<h4>{error.message}</h4>
									</div>
								</div>
								: null
						}
					</>
			}
		</>
	);
};

export default App;