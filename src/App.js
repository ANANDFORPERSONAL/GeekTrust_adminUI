import React, { useState, useEffect } from 'react';
import '../src/css/App.css';
import Pagination from './pagination';


function App() {
  
  const [members, setMembers] = useState([]);
  const [editedMember, setEditedMember] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);


  // fetching of JSON file
  useEffect(() => {
    const fetchMembers = async () => {
      const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
      const data = await response.json();
      setMembers(data);
    };

    fetchMembers();
  }, []);


  //sets the member, user wants to edit
  const handleEditClick = (id) => {
    const memberToEdit = members.find(member => member.id === id);

    setEditedMember(memberToEdit);
  };

  //adds or removes a member from the selectedMembers array based on whether the checkbox next to their name is checked.
  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      const memberToAdd = members.find(member => member.id === id);
      setSelectedMembers([...selectedMembers, memberToAdd]);
    } else {
      const updatedSelectedMembers = selectedMembers.filter(member => member.id !== id);
      setSelectedMembers(updatedSelectedMembers);
    }
  };
  //removes a member from the members array and updates the selectedMembers array accordingly.
  const handleDeleteClick = (id) => {
    const updatedMembers = members.filter(member => member.id !== id);
    setMembers(updatedMembers);
    const updatedSelectedMembers = selectedMembers.filter(member => member.id !== id);
    setSelectedMembers(updatedSelectedMembers);
  };
  //saves the changes made to the edited member and updates the members array.
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const index = members.findIndex(member => member.id === editedMember.id);

    const updatedMembers = [...members];
    updatedMembers[index] = editedMember;

    setMembers(updatedMembers);
    setEditedMember(null);
  };

  //updates the editedMember state as the user inputs new data.
  const handleInputChange = (e) => {
    const updatedMember = { ...editedMember, [e.target.name]: e.target.value };
    setEditedMember(updatedMember);
  };

  //selects or deselects all members based on whether the "Select All" checkbox is checked.
  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedMembers(members);
    } else {
      setSelectedMembers([]);
    }
  };

  //removes all selected members from the members array and updates the selectedMembers array accordingly.
  const handleDeleteSelectedClick = () => {
    const updatedMembers = members.filter((member) => !selectedMembers.includes(member));
    setMembers(updatedMembers);
    setSelectedMembers([]);
    setSelectAll(false);
  };

  // filter the members based on the current search query
  const filteredMembers = members.filter((user) =>
    searchText
      ? user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.role.toLowerCase().includes(searchText.toLowerCase())
      : true
  );


// Implementing Pagination using react


const [itemsPerPage] = useState(10);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

// Change page
const paginate = (pageNumber) => setCurrentPage(pageNumber);





  return (
    <div>
  <h1><center>ADMIN PANEL</center></h1>
  <div>
    
    <div>
      <center><input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      /></center>
      <center>{editedMember && (
        <form onSubmit={handleFormSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={editedMember.name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              name="email"
              value={editedMember.email}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Role:
            <input
              type="text"
              name="role"
              value={editedMember.role}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Save</button>
          <button type="">Cancel</button>

        </form>
      )}</center>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Edit/Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(user)}
                  onChange={(e) => handleCheckboxChange(e, user.id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
              <button onClick={() => handleEditClick(user.id)} class="button button-edit">Edit</button>
            </td>
            <td>
              <button onClick={() => handleDeleteClick(user.id)}class="button button-delete" >Delete</button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
      
      {selectedMembers.length > 0 && (
        <div>
          <button onClick={handleDeleteSelectedClick}>
            Delete Selected Members
          </button>
        </div>
      )}
    </div>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredMembers.length}
        paginate={paginate}
      />
    </div>
    
  </div>
</div>

  
  );

  }



export default App;
