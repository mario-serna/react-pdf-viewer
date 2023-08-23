import { LTWHP } from "../types";

interface Props {
  position: {
    boundingRect: LTWHP;
    rects: Array<LTWHP>;
  };
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  comment: {
    emoji: string;
    text: string;
    color: string;
  };
  isScrolledTo: boolean;
}

const Highlight = ({
  comment,
  isScrolledTo,
  position,
  onClick,
  onMouseOut,
  onMouseOver,
}: Props) => {
  return (
    <div className={`Highlight ${isScrolledTo ? "Highlight--scrolledTo" : ""}`}>
      {comment ? (
        <div
          className="Highlight__emoji"
          style={{
            left: 20,
            top: position.boundingRect.top,
          }}
        >
          {comment.emoji}
        </div>
      ) : null}
      <div className="opacity-100">
        {position.rects.map((rect, index) => (
          <div
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
            key={index}
            style={{ ...rect, backgroundColor: comment?.color || "#ffe28f" }}
            className={`cursor-pointer absolute rounded-sm transition-colors duration-300`}
          />
        ))}
      </div>
    </div>
  );
};

export default Highlight;
