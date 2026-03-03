import React, { useState, useEffect } from 'react';
import { Header } from './Edit/Header';
import { ItemForm } from './Edit/ItemForm';
import { AddForm } from './Edit/AddForm';
import { ShowForm } from './Edit/ShowForm';
import { ItemList } from './Edit/ItemList';
import { ItemData, ViewState } from './types';

const App: React.FC = () => {
  const [items, setItems] = useState<ItemData[]>([]);
  const [dbitems, setDbitems] = useState<ItemData[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [editingItem, setEditingItem] = useState<ItemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      ///api/edit_list
      const sendItem = { query: "" }
      const body: any = JSON.stringify(sendItem);		
      const res = await fetch("/api/edit_list", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: body
      });
      if(res.ok === false){
       throw new Error("res.OK = NG"); 
      };
      const text = await res.text();
      const json = JSON.parse(text);
      //console.log(json.result)
      let newArr = []
      if(json.result){
        json.result.forEach((element) => {
          //console.log(element)
          let id = element[0]
          let content = element[1]
          console.log("id=", id)
          //console.log("content=", content)
          element.listContent = content.substring(0, 50)
          element.id = id
          element.content = content
          newArr.push(element)
        });
      }
      console.log(newArr)
      setDbitems(newArr)
      return;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (newItem: Omit<ItemData, 'id' | 'createdAt'>) => {
    try {
      console.log(newItem)
      if(!newItem.content){
        return;
      }
      const res = await fetch(`/api/edit_create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) {
        throw new Error('Failed to update item');
      }

      setCurrentView('list');
      await fetchItems();

    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateItem = async (updatedItem: ItemData) => {
    try {
      const res = await fetch(`/api/items`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });

      if (!res.ok) {
        throw new Error('Failed to update item');
      }

      await fetchItems();
      setCurrentView('list');
      setEditingItem(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      if(confirm("are you sure to delete?") === false){
        return
      }
      console.log("handleDeleteItem.id=" + id)
      const newItem = {id: id}
      const res = await fetch(`/api/edit_delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) {
        throw new Error('Failed to update item');
      }      
      await fetchItems();

    } catch (error) {
      console.error(error);
    }
  };

  const handleEditItem = (item: ItemData) => {
    setEditingItem(item);
    setCurrentView('edit');
  };

  const handleShowItem = (item: ItemData) => {
    setEditingItem(item);
    setCurrentView('show');
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingItem(null);
  }
  
  // A simple loading state
  if (isLoading) {
    return (
       <div className="min-h-screen bg-slate-100 flex justify-center items-center">
        <div className="text-xl font-semibold text-slate-600">Loading...</div>
       </div>
    )
  }

  const handleSearch = async function(){
    try{
      console.log(searchTerm);
      const sendItem = { query: searchTerm }
      const body: any = JSON.stringify(sendItem);		
      const res = await fetch("/api/edit_list", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},      
        body: body
      });
      if(res.ok === false){
       throw new Error("res.OK = NG"); 
      };
      const text = await res.text();
      const json = JSON.parse(text);
      //console.log(json.result)
      let newArr = []
      if(json.result){
        json.result.forEach((element) => {
          //console.log(element)
          let id = element[0]
          let content = element[1]
          //console.log("id=", id)
          element.listContent = content.substring(0, 50)
          element.id = id
          element.content = content
          newArr.push(element)
        });
      }
      setDbitems(newArr)
    }catch(e){console.error(e);}
  }  

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'list' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Text List</h1>
              <button
                name="item_add_button"
                onClick={() => setCurrentView('add')}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-emerald-600 text-white hover:bg-emerald-700 h-10 py-2 px-4 shadow-sm"
              >
                Add New Item
              </button>
            </div>
            <ItemList items={items} onAddItem={() => setCurrentView('add')}
             onDeleteItem={handleDeleteItem} 
             onEditItem={handleEditItem} />

            <div className="px-6 py-2 border-b border-gray-200 flex justify-between items-center">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md mx-2 py-1"
                placeholder="Search text"
                defaultValue={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={() => {handleSearch();}}
                className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
              >Search</button>
            </div>

            <ul>
              {dbitems.map(todo => (
                <li key={todo.id} 
                className="flex items-center justify-between border-b border-gray-300 py-2">
                  <span>
                    {todo.listContent}<br />
                    <span className="text-gray-500">ID: {todo.id}</span>
                  </span>
                  <div>
                    <button onClick={() => {handleShowItem(todo)}}>[ Show ]</button>
                    <button 
                    className="mx-2"
                    onClick={() => {handleDeleteItem(todo.id)}}>[ Delete ]</button>
                  </div>
                </li>
              ))}
            </ul>              
          </div>
        )}

        {currentView === 'add' && (
          <div className="animate-fade-in-up">
            <AddForm 
              onSubmit={handleAddItem} 
              onCancel={handleCancel} 
            />
          </div>
        )}

        {currentView === 'edit' && editingItem && (
          <div className="animate-fade-in-up">
            <ItemForm
              onSubmit={(item) => handleUpdateItem({ ...item, id: editingItem.id, createdAt: editingItem.createdAt })}
              onCancel={handleCancel}
              initialData={editingItem}
            />
          </div>
        )}

        {currentView === 'show' && editingItem && (
          <div className="animate-fade-in-up">
            <ShowForm
              onSubmit={(item) => handleUpdateItem({ ...item, id: editingItem.id, createdAt: editingItem.createdAt })}
              onCancel={handleCancel}
              initialData={editingItem}
            />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;