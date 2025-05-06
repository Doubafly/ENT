interface NotesFilterProps {
    annees: string[];
    selected: string;
    onChange: (annee: string) => void;
  }
  
  export default function NotesFilter({ annees, selected, onChange }: NotesFilterProps) {
    return (
      <div className="mb-4">
        <label className="mr-2 font-medium">Année académique :</label>
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {annees.map((annee) => (
            <option key={annee} value={annee}>
              {annee}
            </option>
          ))}
        </select>
      </div>
    );
  }
  