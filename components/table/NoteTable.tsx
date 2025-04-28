interface NoteTableProps {
  semesterName: string;
  data: Array<{
    Module: string;
    NoteClasse: string;
    NoteCompo: string;
    NoteMatiere: string;
    Validation: string;
  }>;
}

export default function NoteTable({ semesterName, data }: NoteTableProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">{semesterName}</h2>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-2">Module</th>
              <th className="border border-gray-300 px-2 py-2">Note Classe</th>
              <th className="border border-gray-300 px-2 py-2">Note Compo</th>
              <th className="border border-gray-300 px-2 py-2">Note Matiere</th>
              <th className="border border-gray-300 px-2 py-2">Validation</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="border border-gray-300 px-2 py-2">
                  {row.Module}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {row.NoteClasse}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {row.NoteCompo}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {row.NoteMatiere}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {row.Validation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
