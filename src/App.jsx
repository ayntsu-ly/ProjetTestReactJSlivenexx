import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import PropTypes from 'prop-types';
import { FaPlus, FaSave, FaTrash, FaTimes } from 'react-icons/fa';


// Partie sur la composant SousRubrique
const SousRubrique = ({ sousRubrique, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSousRubrique, setEditedSousRubrique] = useState(sousRubrique);
  const [selected, setSelected] = useState(false); 

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onEdit(editedSousRubrique);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedSousRubrique(sousRubrique);
  };

  const handleClick = () => {
    setSelected(!selected); 
  };


  return (
    <div className="mb-2">
      {isEditing ? (
        <div className="d-flex">
          <input
            type="text" value={editedSousRubrique}
            onChange={(e) => setEditedSousRubrique(e.target.value)}  autoFocus  className="form-control mr-2"  style={{ marginBottom: '0', marginRight: '5px' }}/>
          <button onClick={handleSave} className="btn btn-success"><FaSave />Enregistrer</button>
          <button onClick={handleCancel} className="btn btn-warning ml-2"><FaTimes />Annuler</button>
        </div>
      
      ) : (
                // click une fois s'ouvre le boutton supprimer
        <div className="d-flex align-items-center" onClick={handleClick}>
          <div onDoubleClick={handleDoubleClick} style={{ cursor: 'pointer', flex: 1 }}>{sousRubrique}</div>
          {selected && <button onClick={() => onDelete(sousRubrique)} className="btn btn-danger ml-2"><FaTrash />Supprimer</button>}
        </div>
      )}
    </div>
  );

};

// Définition des validations PropTypes pour SousRubrique
SousRubrique.propTypes = {
  sousRubrique: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

const Rubrique = ({ rubrique, onEdit, isSelected, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRubrique, setEditedRubrique] = useState(rubrique);
  const [subRubrique, setSubRubrique] = useState('');
  const [showSubInput, setShowSubInput] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onEdit(editedRubrique);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedRubrique(rubrique);
  };

  const handleSaveSubRubrique = () => {
    if (subRubrique.trim() !== '') {
      const updatedRubrique = { ...editedRubrique, sousRubriques: [...(editedRubrique.sousRubriques || []), subRubrique] };
      setEditedRubrique(updatedRubrique);
      onEdit(updatedRubrique); 
      setSubRubrique('');
      setShowSubInput(false);
    }
  };

  const handleCancelSubRubrique = () => {
    setShowSubInput(false);
    setSubRubrique('');
  };

  const handleEditSubRubrique = (editedSubRubrique, index) => {
    const updatedRubrique = { ...editedRubrique, sousRubriques: [...editedRubrique.sousRubriques] };
    updatedRubrique.sousRubriques[index] = editedSubRubrique;
    setEditedRubrique(updatedRubrique);
    onEdit(updatedRubrique);
  };

  return (
    <div className="mb-4">
      <div onClick={onSelect} style={{ cursor: 'pointer', fontWeight: isSelected ? 'bold' : 'normal' }}>
        {isEditing ? (
          <div className="d-flex align-items-center">
            <input
            type="text" value={editedRubrique.name} onChange={(e) => setEditedRubrique({ ...editedRubrique, name: e.target.value })} autoFocus className="form-control mr-2" />
            <button onClick={handleSave} className="btn btn-success"><FaSave />Enregistrer</button>
            <button onClick={handleCancel} className="btn btn-warning ml-2"><FaTimes />Annuler</button>
          </div>
          
        ) : (
          <div onDoubleClick={handleDoubleClick}>{rubrique.name}</div>
        )}
      </div>

      {/*quand on selectionne et editer les rubrique*/}
      {isSelected && !isEditing && (
        <div>
          <button onClick={() => setShowSubInput(true)} className="btn btn-success"><FaPlus /> Ajouter sous-rubrique</button>
        </div>

      )}
      {showSubInput && (
        <div className="d-flex align-items-center">
          <input type="text" value={subRubrique} onChange={(e) => setSubRubrique(e.target.value)} className="form-control mr-2"/>
          <button onClick={handleSaveSubRubrique} className="btn btn-success"><FaSave />Enregistrer</button>
          <button onClick={handleCancelSubRubrique} className="btn btn-warning ml-2"><FaTimes />Annuler</button>
        </div>

      )}
      {editedRubrique.sousRubriques && isSelected && !isEditing && editedRubrique.sousRubriques.map((subRubrique, index) => (
        <SousRubrique
          key={index}
          sousRubrique={subRubrique}
          onDelete={(deletedSubRubrique) => {
            const updatedRubrique = { ...editedRubrique, sousRubriques: editedRubrique.sousRubriques.filter(sub => sub !== deletedSubRubrique) };
            setEditedRubrique(updatedRubrique);
            onEdit(updatedRubrique);
          }}
          onEdit={(editedSubRubrique) => handleEditSubRubrique(editedSubRubrique, index)}
        />
      ))}
    </div>
  );

};

 // Définition des validations PropTypes pour Rubrique
Rubrique.propTypes = {
  rubrique: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired
};


// Composant de la crud rubrique
const App = () => {
  const [rubriques, setRubriques] = useState([]);
  const [newRubrique, setNewRubrique] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [selectedRubriqueIndex, setSelectedRubriqueIndex] = useState(null);

// recuperation des rubriques du backend
  useEffect(() => {
    fetch('http://localhost:5000/api/rubriques')
      .then(response => response.json())
      .then(data => setRubriques(data))
      .catch(error => console.error('Error fetching rubriques:', error));
  }, []);

  const handleAddRubrique = () => {
    setShowInput(true);
  };

  const handleSaveRubrique = () => {
    if (newRubrique.trim() !== '') {
      const newRubriqueObject = { name: newRubrique, sousRubriques: [] };
      fetch('http://localhost:5000/api/rubriques', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRubriqueObject),
      })
      .then(response => response.json())
      .then(data => {
        setRubriques([...rubriques, data]);
        setNewRubrique('');
        setShowInput(false);
      })
      .catch(error => console.error('Error adding rubrique:', error));
    }
  };

  const handleEditRubrique = (editedRubrique) => {
    fetch(`http://localhost:5000/api/rubriques/${editedRubrique.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedRubrique),
    })
    .then(response => response.json())
    .then(data => {
      const updatedRubriques = rubriques.map(rubrique => rubrique.id === data.id ? data : rubrique);
      setRubriques(updatedRubriques);
    })
    .catch(error => console.error('Error editing rubrique:', error));
  };

  const handleSelectRubrique = (index) => {
    setSelectedRubriqueIndex(prevIndex => prevIndex === index ? null : index);
  };

  return (
    <div>
      <h1 className="text-center" style={{ flex: 1, marginTop: '15px' }}>RUBRIQUEMENT</h1>
      <div className="d-flex" style={{ flex: 1, marginTop: '50px' }}>
        <div style={{ flex: 2 }}>
          <h3 className="card-subtitle mb-5 text-muted">Ajout rubriques</h3>
          {showInput ? (
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <input type="text" value={newRubrique} onChange={(e) => setNewRubrique(e.target.value)} className="form-control form-control-sm md-1" style={{ marginRight: '5px' }} />
              <button onClick={handleSaveRubrique} className="btn btn-success sm-1" style={{ margin: '0 5px' }}><FaSave /> Enregistrer</button>
              <button onClick={() => setShowInput(false)} className="btn btn-warning ml-1" style={{ marginLeft: '5px' }}><FaTimes /> Annuler</button>
            </div>
          ) : (
            <button onClick={handleAddRubrique} className="btn btn-primary mb-2"><FaPlus /> Ajouter Rubrique</button>
          )}
        </div>
        <div style={{ flex: 0 }}></div>
        <div style={{ flex: 3 }}>
          <div className="card m-4">
            <div className="card-body">
              <h4 className="card-title">Liste des rubriques à éditer et ajouter des sous-rubriques</h4>
              <h3 className="card-subtitle mb-2 text-muted">NB</h3>
              <ul className="card-text">
                <li>Cliquez une fois si vous souhaitez sélectionner le rubrique et vous pouvez ajouter des sous-rubriques à partir du rubrique sélectionné ainsi de suite pour le sub_rubrique</li>
                <li>Cliquez deux fois si vous souhaitez modifier le rubrique ou sub_rubrique</li>
              </ul> 
            </div>
          </div>
          <h3 className="card-subtitle mb-2 text-muted">Liste rubriques</h3>
          <div style={{ height: '2px', width: '100%', backgroundColor: '#ccc', margin: '20px auto' }}></div>
          {rubriques.map((rubrique, index) => (
            <Rubrique
              key={rubrique.id}
              rubrique={rubrique}
              onEdit={handleEditRubrique}
              isSelected={selectedRubriqueIndex === index}
              onSelect={() => handleSelectRubrique(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
