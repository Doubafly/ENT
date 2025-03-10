import { useState } from "react";
import "./Depense.css"; // Importer le fichier CSS pour les styles

export default function Depense() {
  const [expenses, setExpenses] = useState<
    { category: string; amount: string; description: string; date: Date }[]
  >([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const addExpense = () => {
    const newExpense = { category, amount, description, date: new Date() };
    setExpenses([...expenses, newExpense]);
    setCategory("");
    setAmount("");
    setDescription("");
  };

  const deleteExpense = (index: number) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  };

  return (
    <div className="container">
      <h1>Dépenses de l’Université</h1>

      <div className="add-expense">
        <h2>Ajouter une dépense</h2>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Catégorie"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Montant"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        ></textarea>
        <button onClick={addExpense}>Ajouter la dépense</button>
      </div>

      <div className="expense-history">
        <h2>Historique des dépenses</h2>
        <ul>
          {expenses.map((expense, index) => (
            <li key={index}>
              {expense.category} - {expense.amount} FCFA - {expense.description}{" "}
              - {expense.date.toLocaleDateString()}
              <button onClick={() => deleteExpense(index)}>Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
