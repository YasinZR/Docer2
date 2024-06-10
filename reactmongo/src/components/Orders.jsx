import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newOrder, setNewOrder] = useState({ buyerName: '', buyerEmail: '', selectedProducts: [] });
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = () => {
    axios.get('http://localhost:8080/api/orders')
  .then(response => setOrders(response.data))
  .catch(error => console.error('Ошибка:', error));
  };

  const fetchProducts = () => {
    axios.get('http://localhost:8080/api/products')
  .then(response => setProducts(response.data))
  .catch(error => console.error('Ошибка:', error));
  };

  const handleAdd = () => {
    axios.post('http://localhost:8080/api/orders', {...newOrder, selectedProducts})
  .then(response => {
        setOrders([...orders, response.data]);
        resetForm();
      })
  .catch(error => console.error('Ошибка:', error));
  };

  const resetForm = () => {
    setNewOrder({ buyerName: '', buyerEmail: '', selectedProducts: [] });
    setSelectedProducts([]);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/orders/${id}`)
  .then(response => {
        setOrders(orders.filter(order => order.id!== id));
      })
  .catch(error => console.error('Ошибка:', error));
  };

  const handleEdit = (id) => {
    const orderToEdit = orders.find(order => order.id === id);
    setEditingOrder(orderToEdit);
    setSelectedProducts(orderToEdit.selectedProducts || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingOrder) {
      setEditingOrder({...editingOrder, [name]: value });
    } else {
      setNewOrder({...newOrder, [name]: value });
    }
  };

  const handleProductCheckboxChangeDuringEdit = (product) => {
    const currentIndex = selectedProducts.findIndex(p => p.id === product.id);
    let newSelected = [...selectedProducts];

    if (currentIndex === -1) {
      newSelected.push(product); // Добавляем продукт, если он еще не выбран
    } else {
      newSelected.splice(currentIndex, 1); // Удаляем продукт, если он уже выбран
    }

    setSelectedProducts(newSelected);

    // Обновляем editingOrder с новыми данными selectedProducts
    setEditingOrder({
    ...editingOrder,
      selectedProducts: newSelected
    });
  };

  const handleSave = () => {
    if (editingOrder) {
      const updatedOrderData = {
      ...editingOrder,
        selectedProducts: selectedProducts // Указываем актуальный список выбранных продуктов
      };
      
      axios.put(`http://localhost:8080/api/orders/${editingOrder.id}`, updatedOrderData)
    .then(response => {
          const updatedOrder = {...response.data, selectedProducts: selectedProducts};
          setOrders(orders.map(order =>
            order.id === editingOrder.id? updatedOrder : order
          ));
          setEditingOrder(null);
        })
    .catch(error => console.error('Ошибка:', error));
    }
  };

  const handleCancel = () => {
    setEditingOrder(null);
  };

  const handleSearch = () => {
    axios.get(`http://localhost:8080/api/orders/search?query=${searchQuery}`)
  .then(response => setOrders(response.data))
  .catch(error => console.error('Ошибка:', error));
  };

  return (
    <div className="orders-container">
      <div className="add-order-form">
        <h2>Сделать заказ</h2>
        <p>Имя:</p>
        <input type="text" name="buyerName" value={newOrder.buyerName} onChange={handleChange} />
        <p>Почта:</p>
        <input type="email" name="buyerEmail" value={newOrder.buyerEmail} onChange={handleChange} />
        <div>
          <p>Товары:</p>
          {products.map(product => (
            <div key={product.id}>
              <label className="checkbox-label">
                <input type="checkbox" checked={selectedProducts.some(p => p.id === product.id)} onChange={() => handleProductCheckboxChangeDuringEdit(product)} />
                {product.name}
              </label>
            </div>
          ))}
        </div>
        <button onClick={handleAdd}>Добавить</button>
      </div>
      <h1>Заказы</h1>
      <div className="search-container">
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск" />
        <button onClick={handleSearch} className='orders-search'>Поиск</button>
      </div>
      <ul>
        {orders.map(order => (
          <div key={order.id}>
            {editingOrder && editingOrder.id === order.id? (
              <div>
                <input type="text" name="buyerName" value={editingOrder.buyerName} onChange={handleChange} />
                <input type="email" name="buyerEmail" value={editingOrder.buyerEmail} onChange={handleChange} />
                <ul>
                  {products.map(product => (
                    <div key={product.id}>
                      <input type="checkbox" checked={selectedProducts.some(p => p.id === product.id)} onChange={() => handleProductCheckboxChangeDuringEdit(product)} />
                      <label>{product.name}</label>
                    </div>
                  ))}
                </ul>
                <button onClick={handleSave}>Сохранить</button>
                <button onClick={handleCancel}>Отмена</button>
              </div>
            ) : (
              <div className='orders-view'>
                <div>{order.buyerName} {order.buyerEmail} {order.selectedProducts?.map(product => (
                  <div key={product.id}>{product.name}</div>
                ))}</div>
                <button onClick={() => handleEdit(order.id)}>Изменить</button>
                <button onClick={() => handleDelete(order.id)}>Удалить</button>
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
