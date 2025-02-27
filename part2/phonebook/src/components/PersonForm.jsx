const PersonForm = ({ contactData, handleSave, handleInputChange }) => {
  return (
    <form onSubmit={handleSave}>
      <div>
        Name:
        <input value={contactData.name} name="name" onChange={handleInputChange} />
      </div>
      <div>
        Number:
        <input value={contactData.number} name="number" onChange={handleInputChange} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default PersonForm;