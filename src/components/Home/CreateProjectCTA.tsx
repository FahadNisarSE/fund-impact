import { CiCreditCard1 } from "react-icons/ci";
import { FaRegLightbulb } from "react-icons/fa";
import { GiConverseShoe } from "react-icons/gi";
import { IoMdMusicalNotes } from "react-icons/io";
import { IoRocketOutline } from "react-icons/io5";
import { PiFilmSlateLight } from "react-icons/pi";

const cardData = [
  {
    id: 1,
    icon: () => (
      <IoRocketOutline className="w-8 h-8 text-primary font-medium" />
    ),
    position: { left: "10%", top: "10%" },
  },
  {
    id: 2,
    icon: () => (
      <IoMdMusicalNotes className="w-8 h-8 text-primary font-medium" />
    ),
    position: { left: "25%", top: "40%" },
  },
  {
    id: 3,
    icon: () => <FaRegLightbulb className="w-8 h-8 text-primary font-medium" />,
    position: { left: "5%", top: "90%" },
  },
  {
    id: 4,
    icon: () => <GiConverseShoe className="w-8 h-8 text-primary font-medium" />,
    position: { right: "10%", top: "10%" },
  },
  {
    id: 5,
    icon: () => <CiCreditCard1 className="w-8 h-8 text-primary font-medium" />,
    position: { right: "20%", top: "40%" },
  },
  {
    id: 6,
    icon: () => (
      <PiFilmSlateLight className="w-8 h-8 text-primary font-medium" />
    ),
    position: { right: "10%", top: "70%" },
  },
];

export default function CreateProjectCTA() {
  return (
    <section className="bg-wheat_white mt-16 rounded-3xl p-5 py-16 relative">
      <div className="flex flex-col items-center gap-4 max-w-lg mx-auto text-center relative z-10">
        <span className="text-primary font-semibold text-sm mb-5 tracking-wider">
          FUND IMPACT
        </span>
        <h3 className="text-6xl font-bold mb-8">Fund your creative work</h3>
        <p className="text-lg">
          Turn Your Ideas into Reality Transform your creativity into something
          extraordinary. Start a project, gather support, and watch your vision
          come to life.
        </p>
        <button className="text-lg flex flex-row items-center gap-2 px-8 py-5 hover:scale-105 my-8 transition-transform duration-200 font-semibold text-white bg-primary rounded-full">
          Create a project <IoRocketOutline className="w-6 h-6" />
        </button>
        <p className="text-ms text-gray-700">
          It&apos;s free and takes less than a minute
        </p>
      </div>
      {cardData.map((card, index) => (
        <div key={card.id} style={card.position} className={`absolute`}>
          {card.icon()}
        </div>
      ))}
    </section>
  );
}
