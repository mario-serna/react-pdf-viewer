import { useEffect, useState } from "react";
import { CirclePicker } from "react-color";
interface Props {
  content: { text?: string; image?: string };
  onConfirm: (comment: { text: string; emoji: string; color: string }) => void;
  onOpen: () => void;
  onUpdate?: () => void;
}

const Tip = ({ content, onConfirm, onOpen, onUpdate }: Props) => {
  const [compact, setCompact] = useState(true);
  const [text, setText] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (onUpdate) onUpdate();
  }, [compact]);

  return (
    <div className="Tip">
      {compact ? (
        <div className="flex flex-col gap-2 px-1 py-2 rounded-md text-white bg-[#3d464d] border-solid border-white">
          <button
            className="h-8 w-full p-1 text-white bg-slate-400 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-slate-500 duration-300"
            onClick={() => {
              alert(content.text);
            }}
          >
            Copy Text
          </button>
          <button
            className="h-8 w-full p-1 text-white bg-blue-400 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-blue-500 duration-300"
            onClick={() => {
              onOpen();
              setCompact(false);
            }}
          >
            Add highlight
          </button>
        </div>
      ) : (
        <form
          className="flex flex-col gap-2 p-2 bg-white border-solid border-2 border-[#e8e8e8] rounded-md shadow-md"
          onSubmit={(event) => {
            event.preventDefault();
            onConfirm({ text, emoji: "", color });
          }}
        >
          <div>
            <textarea
              className="w-full"
              placeholder="Your comment"
              autoFocus
              value={text}
              onChange={(event) => setText(event.target.value)}
              ref={(node) => {
                if (node) {
                  node.focus();
                }
              }}
            />
            <div>
              <CirclePicker
                color={color}
                onChangeComplete={(color) => setColor(color.hex)}
              />
            </div>
          </div>
          <div>
            <button
              className="h-8 w-full p-1 text-white bg-blue-400 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-blue-500 duration-300"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Tip;
