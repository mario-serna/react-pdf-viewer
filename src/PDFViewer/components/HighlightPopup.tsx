import { IHighlight } from "../types";

interface Props {
  highlight: IHighlight;
  onDelete: () => void;
}

const HighlightPopup = ({ highlight, onDelete }: Props) =>
  highlight.comment.text ||
  highlight.comment.emoji ||
  highlight.comment.color ? (
    <div className="flex flex-col gap-1 p-2 bg-[#3d464d]">
      <div className="flex gap-2">
        <div className="bg-white rounded-lg">
          {highlight.comment.emoji ? (
            <span className="text-4xl">{highlight.comment.emoji}</span>
          ) : (
            <img
              height={50}
              width={50}
              src="https://icons.iconarchive.com/icons/ph03nyx/super-mario/256/Mushroom-Super-icon.png"
              alt="icon"
            />
          )}
        </div>
        <div className="flex flex-col justify-center text-white">
          <span>{highlight.comment.text || highlight.content.text}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="h-6 w-full p-1 text-xs text-white bg-blue-400 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-blue-500 duration-300"
          onClick={() => alert(JSON.stringify(highlight))}
        >
          Open
        </button>
        <button
          className="h-6 w-full p-1 text-xs text-white bg-red-400 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-red-500 duration-300"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  ) : null;

export default HighlightPopup;
