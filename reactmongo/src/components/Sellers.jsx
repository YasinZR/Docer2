import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [newSeller, setNewSeller] = useState({ name: '', email: '', phone: '' });
  const [editingSeller, setEditingSeller] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSellers = useCallback(() => {
    let url = 'http://localhost:8080/api/sellers';
    if (searchQuery) {
      url += `?query=${searchQuery}`;
    }
    axios.get(url)
   .then(response => {
        setSellers(response.data);
      })
   .catch(error => console.error('Ошибка:', error));
  }, [searchQuery]);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const handleAdd = () => {
    axios.post('http://localhost:8080/api/sellers', newSeller)
    .then(response => {
        setSellers(prevSellers => [...prevSellers, response.data]);
        setNewSeller({ name: '', email: '', phone: '' });
      })
    .catch(error => console.error('Ошибка:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/sellers/${id}`)
    .then(() => {
        setSellers(prevSellers => prevSellers.filter(seller => seller.id!== id));
      })
    .catch(error => console.error('Ошибка:', error));
  };

  const handleEdit = (id) => {
    const sellerToEdit = sellers.find(seller => seller.id === id);
    setEditingSeller(sellerToEdit);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingSeller) {
      setEditingSeller({...editingSeller, [name]: value });
    } else {
      setNewSeller({...newSeller, [name]: value });
    }
  };

  const handleSave = () => {
    if (editingSeller) {
      axios.put(`http://localhost:8080/api/sellers/${editingSeller.id}`, editingSeller)
      .then(response => {
          setSellers(prevSellers => prevSellers.map(seller =>
            seller.id === editingSeller.id? response.data : seller
          ));
          setEditingSeller(null);
        })
      .catch(error => console.error('Ошибка:', error));
    }
  };

  const handleCancel = () => {
    setEditingSeller(null);
  };

  const handleSearch = () => {
    fetchSellers();
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    fetchSellers();
  };

  return (
    <div className="sellers-container">
      <div className="add-seller-form">
        <h2>Добавить продавца</h2>
        <form onSubmit={handleAdd}>
          <input type="text" name="name" value={newSeller.name} onChange={handleChange} placeholder="Имя" required />
          <input type="email" name="email" value={newSeller.email} onChange={handleChange} placeholder="Почта" required />
          <input type="tel" name="phone" value={newSeller.phone} onChange={handleChange} placeholder="Номер телефона" required />
          <button type="submit">Добавить</button>
        </form>
      </div>

      <h1>Продавцы</h1>

      <div className="search-bar">
        <input type="text" placeholder="Поиск по имени" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button onClick={handleSearch} className='search-sellers'>Поиск</button>
        <button onClick={handleResetSearch} className='reset-button'>Сброс</button>
      </div>

      <ul className="sellers-list">
        {sellers.map(seller => (
          <li key={seller.id} className="seller-item">
            {editingSeller && editingSeller.id === seller.id? (
              <form onSubmit={handleSave} className='form-sellsers'>
                <input className='sellersInput' type="text" name="name" value={editingSeller.name} onChange={handleChange} placeholder="Имя" required />
                <input className='sellersInput' type="email" name="email" value={editingSeller.email} onChange={handleChange} placeholder="Почта" required />
                <input className='sellersInput' type="tel" name="phone" value={editingSeller.phone} onChange={handleChange} placeholder="Номер телефона" required />
                <button type="submit" className="save-button">Сохранить</button>
                <button type="button" onClick={handleCancel} className="close-button">Закрыть</button>
              </form>
            ) : (
              <div className="seller-view">
                <p>{seller.name}</p>
                <p>{seller.email}</p>
                <p>{seller.phone}</p>
                <button onClick={() => handleEdit(seller.id)}>Изменить</button>
                <button onClick={() => handleDelete(seller.id)}>Удалить</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sellers;
