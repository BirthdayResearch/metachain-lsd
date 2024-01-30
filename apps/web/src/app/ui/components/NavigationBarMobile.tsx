import { MdMenu } from "react-icons/md";

export default function NavigationBarMobile({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden flex text-light-1000 py-1.5 px-5 justify-center items-center"
    >
      <MdMenu size={28} />
    </button>
  );
}
