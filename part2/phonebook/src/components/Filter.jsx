const Filter = ({ searchValue, onSearchChange }) => {
  return (
    <div>
      filter shown with: <input value={searchValue} onChange={onSearchChange} />
    </div>
  );
};

export default Filter;
