import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reports() {
  const [averagePriceBySeller, setAveragePriceBySeller] = useState([]);
  const [productCountBySeller, setProductCountBySeller] = useState([]);
  const [priceRange, setPriceRange] = useState({});

  useEffect(() => {
    fetchAveragePriceBySeller();
    fetchProductCountBySeller();
    fetchProductPriceRange();
  }, []);

  const fetchAveragePriceBySeller = () => {
    axios.get('http://localhost:8080/api/reports/average-price-by-seller')
     .then(response => setAveragePriceBySeller(response.data))
     .catch(error => console.error('Ошибка:', error));
  };

  const fetchProductCountBySeller = () => {
    axios.get('http://localhost:8080/api/reports/product-count-by-seller')
     .then(response => setProductCountBySeller(response.data))
     .catch(error => console.error('Ошибка:', error));
  };

  const fetchProductPriceRange = () => {
    axios.get('http://localhost:8080/api/reports/product-price-range')
     .then(response => setPriceRange(response.data))
     .catch(error => console.error('Ошибка:', error));
  };

  return (
    <div className="reports-container">
      <h1>Отчеты</h1>

      <h2>Средняя цена по продавцу</h2>
      <ul>
        {averagePriceBySeller.map(item => (
          <div key={item.sellerId}>
            id продавца: {item.sellerId}, Средняя цена: {item.averagePrice}
          </div>
        ))}
      </ul>

      <h2>Количество товар у продавца</h2>
      <ul>
        {productCountBySeller.map(item => (
          <div key={item.sellerId}>
             id продавца: {item.sellerId}, Количество: {item.productCount}
          </div>
        ))}
      </ul>

      <h2>Диапозон цен</h2>
      <p>Минимальная цена: {priceRange.minPrice}</p>
      <p>Максимальная цена: {priceRange.maxPrice}</p>
    </div>
  );
}

export default Reports;