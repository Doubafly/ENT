import React from 'react';
import { Emploi } from './types';

const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const creneaux = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00'];

const TableauEmploi = ({ emplois }: { emplois: Emploi[] }) => {
  const formatHeure = (heure: string) => {
    return new Date(heure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const tableauEmploi = creneaux.map(creneau => {
    const [debut, fin] = creneau.split('-');
    return {
      creneau,
      jours: jours.map(jour => {
        return emplois.find(e => 
          e.jour === jour && 
          formatHeure(e.heure_debut) === debut &&
          formatHeure(e.heure_fin) === fin
        );
      })
    };
  });

  return (
    <table className="emploi-table">
      <thead>
        <tr>
          <th>Heure</th>
          {jours.map(jour => <th key={jour}>{jour}</th>)}
        </tr>
      </thead>
      <tbody>
        {tableauEmploi.map(({ creneau, jours }) => (
          <tr key={creneau}>
            <td>{creneau}</td>
            {jours.map((emploi, index) => (
              <td key={index}>
                {emploi && (
                  <div className="cours-info">
                    <div>{emploi.cours.filiere_module.module.nom}</div>
                    <div>{emploi.salle}</div>
                    {emploi.cours.enseignant && (
                      <div>
                        {emploi.cours.enseignant.utilisateur.prenom} {emploi.cours.enseignant.utilisateur.nom}
                      </div>
                    )}
                  </div>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableauEmploi;