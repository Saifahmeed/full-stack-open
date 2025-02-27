const Persons = ({ searchValue, contacts, onDelete }) => {
  if (!Array.isArray(contacts)) {
    return <p>Loading contacts...</p>;
  }

  return (
    <ul>
      {contacts
        .filter((entry) =>
          entry.name.toLowerCase().includes(searchValue.toLowerCase())
        )
        .map((entry) => (
          <li key={entry.id}>
            {entry.name} {entry.number}{" "}
            <button onClick={() => onDelete(entry.id, entry.name)}>Delete</button>
          </li>
        ))}
    </ul>
  );
};

export default Persons;
