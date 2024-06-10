import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', sellerId: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchSellers();
  }, [sortOrder]);

  const fetchProducts = () => {
    let url = 'http://localhost:8080/api/products';
    if (sortOrder) {
      url += `?sortBy=price&order=${sortOrder}`;
    }
    axios.get(url)
    .then(response => setProducts(response.data))
    .catch(error => console.error('Ошибка:', error));
  };

  const fetchSellers = () => {
    axios.get('http://localhost:8080/api/sellers')
    .then(response => setSellers(response.data))
    .catch(error => console.error('Ошибка:', error));
  };

  const handleAdd = () => {
    axios.post('http://localhost:8080/api/products', newProduct)
    .then(response => {
        setProducts([...products, response.data]);
        setNewProduct({ name: '', price: '', description: '', sellerId: '' });
      })
    .catch(error => console.error('Ошибка:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/products/${id}`)
    .then(() => {
        setProducts(products.filter(product => product.id!== id));
      })
    .catch(error => console.error('Ошибка:', error));
  };

  const handleEdit = (id) => {
    const productToEdit = products.find(product => product.id === id);
    setEditingProduct(productToEdit);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({...editingProduct, [name]: value });
    } else {
      setNewProduct({...newProduct, [name]: value });
    }
  };

  const handleSave = () => {
    if (editingProduct) {
      axios.put(`http://localhost:8080/api/products/${editingProduct.id}`, editingProduct)
      .then(response => {
          setProducts(products.map(product =>
            product.id === editingProduct.id? response.data : product
          ));
          setEditingProduct(null);
        })
      .catch(error => console.error('Ошибка:', error));
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const handleResetSort = () => {
    setSortOrder(null);
  };

  return (
    <div className="sellers-container">
      <div className="add-product">
        <h2>Добавить товар</h2>
        <input type="text" name="name" value={newProduct.name} onChange={handleChange} placeholder="Имя" />
        <input type="number" name="price" value={newProduct.price} onChange={handleChange} placeholder="Цена" />
        <textarea name="description" value={newProduct.description} onChange={handleChange} placeholder="Описание" />
        <select name="sellerId" value={newProduct.sellerId} onChange={handleChange}>
          <option value="">Выбрать продавца</option>
          {sellers.map(seller => (
            <option key={seller.id} value={seller.id}>{seller.name}</option>
          ))}
        </select>
        <button onClick={handleAdd}>Добавить</button>
      </div>

      <h1>Товары</h1>
      <div className="buttons-products">
        <button onClick={() => handleSort('asc')}>Сортировка по возрастанию цены</button>
        <button onClick={() => handleSort('desc')}>Сортировка по убыванию цены</button>
        <button onClick={handleResetSort}>Сбросить</button>
      </div>
      <ul className="list">
        {products.map(product => (
          <div key={product.id} className="item">
            {editingProduct && editingProduct.id === product.id? (
              <div className="edit-mode">
                <input type="text" name="name" value={editingProduct.name} onChange={handleChange} placeholder="Имя" />
                <input type="number" name="price" value={editingProduct.price} onChange={handleChange} placeholder="Цена" />
                <textarea name="description" value={editingProduct.description} onChange={handleChange} placeholder="Описание"></textarea>
                <select name="sellerId" value={editingProduct.sellerId} onChange={handleChange}>
                  <option value="">Выбрать продавца</option>
                  {sellers.map(seller => (
                    <option key={seller.id} value={seller.id}>{seller.name}</option>
                  ))}
                </select>
                <button onClick={handleSave}>Сохранить</button>
                <button onClick={handleCancel}>Закрыть</button>
              </div>
            ) : (
              <div className="view-mode">
                <p>{product.name}</p>
                <p>{product.price}</p>
                <p>{product.description}</p>
                <p>{product.sellerId}</p>
                <button onClick={() => handleEdit(product.id)}>Изменить</button>
                <button onClick={() => handleDelete(product.id)}>Удалить</button>
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Products;