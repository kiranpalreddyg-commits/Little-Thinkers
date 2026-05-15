'use client';

interface InstructionsPanelProps {
  gameName: string;
  instructions: string;
  acknowledged: boolean;
  onAcknowledge: (acknowledged: boolean) => void;
}

export function InstructionsPanel({
  gameName,
  instructions,
  acknowledged,
  onAcknowledge,
}: InstructionsPanelProps) {
  const checkboxId = 'instructions-acknowledged';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{gameName}</h3>

      <h2 className="text-lg font-semibold text-gray-800 mb-2">How to play</h2>

      <p className="text-gray-600 mb-6 leading-relaxed">{instructions}</p>

      <label
        htmlFor={checkboxId}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <input
          type="checkbox"
          id={checkboxId}
          checked={acknowledged}
          onChange={(e) => onAcknowledge(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-blue-600
            focus:ring-4 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
        />
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
          I&apos;ve read the instructions
        </span>
      </label>
    </div>
  );
}
