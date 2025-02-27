import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Notify from "./components/Notify";
import contactService from "./services/persons";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [contactData, setContactData] = useState({ name: "", number: "" });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    contactService.getAll().then((data) => {
      setContacts(data);
    });
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [message]);

  const handleSave = (event) => {
    event.preventDefault();
    const existing = contacts.find((entry) => entry.name === contactData.name.trim());
    if (!existing) {
      contactService
        .create(contactData)
        .then((newEntry) => {
          setContacts((prev) => prev.concat(newEntry));
          setContactData({ name: "", number: "" });
          setMessage({ type: "success", text: `${newEntry.name} added successfully` });
        })
        .catch((error) => {
          setMessage({ type: "error", text: error.response?.data?.error || "Unknown error" });
        });
    } else {
      if (
        window.confirm(`${contactData.name} already exists. Replace the old number with a new one?`)
      ) {
        contactService
          .update(existing.id, contactData)
          .then((updatedEntry) => {
            setContacts((prev) =>
              prev.map((entry) => (entry.id !== updatedEntry.id ? entry : updatedEntry))
            );
            setContactData({ name: "", number: "" });
            setMessage({ type: "success", text: `${contactData.name} updated successfully` });
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              setContacts((prev) => prev.filter((entry) => entry.id !== existing.id));
              setMessage({ type: "error", text: `Info on ${contactData.name} was removed from server` });
            } else {
              setMessage({ type: "error", text: error.response?.data?.error || "Unknown error" });
            }
          });
      }
    }
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      contactService.remove(id).then(() => {
        setContacts((prev) => prev.filter((entry) => entry.id !== id));
        setMessage({ type: "Success", text: `${name} deleted` });
      });
    }
  };

  return (
    <>
      <header>
        <h1>Contact Directory</h1>
      </header>

      <section>
        <Notify message={message} />
      </section>

      <section>
        <h2>Search Contacts</h2>
        <Filter searchValue={searchValue} onSearchChange={handleSearchChange} />
      </section>

      <section>
        <h2>Add New Contact</h2>
        <PersonForm
          contactData={contactData}
          handleSave={handleSave}
          handleInputChange={handleInputChange}
        />
      </section>

      <section>
        <h2>Saved Contacts</h2>
        <Persons
          searchValue={searchValue}
          contacts={contacts}
          onDelete={handleDelete}
        />
      </section>
    </>
  );
};

export default App;
