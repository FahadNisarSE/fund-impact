import { IoRocketOutline } from "react-icons/io5";
import { MdOutlineCheckCircleOutline } from "react-icons/md";

export default function Features() {
  return (
    <section className="grid gap-5 my-16 bg-wheat_white rounded-3xl xl:p-16 p-5 py-16">
      <h2
        className={`font-bold text-pretty max-w-3xl mx-auto text-[64px] text-center text-primary leading-tight`}
      >
        Design for Creators,
        <br />
        <span className="text-[#717171]">not for business</span>
      </h2>
      <ul className="grid grid-cols-2 gap-14 items-start my-10">
        <li className="flex flex-row items-start gap-4">
          <MdOutlineCheckCircleOutline className="min-w-6 min-h-6 mt-1.5" />
          <p className="text-balance leading-loose text-lg">
            We don&apos;t call them &quot;customers&quot; or transactions. They are your{" "}
            <strong className="text-primary">supporters.</strong>
          </p>
        </li>
        <li className="flex flex-row items-start gap-4">
          <MdOutlineCheckCircleOutline className="min-w-6 min-h-6 mt-1.5" />
          <p className="text-balance leading-loose text-lg">
            You have <strong className="text-primary">100% ownership</strong> of
            your supporters. We never email them or contact hem in any way.
          </p>
        </li>
        <li className="flex flex-row items-start gap-4">
          <MdOutlineCheckCircleOutline className="min-w-6 min-h-6 mt-1.5" />
          <p className="text-balance leading-loose text-lg">
            Providing you a platform where you can{" "}
            <strong className="text-primary">campaign and fund</strong> for you
            ideas at the same time.
          </p>
        </li>
        <li className="flex flex-row items-start gap-4">
          <MdOutlineCheckCircleOutline className="min-w-6 min-h-6 mt-1.5" />
          <p className="text-balance leading-loose text-lg">
            You get paid instantly to your bank account. No{" "}
            <strong className="text-primary">payment delays</strong>.
          </p>
        </li>
      </ul>

      <button className="text-lg flex flex-row items-center gap-2 px-8 py-5 hover:scale-105 my-8 mx-auto transition-transform duration-200 font-semibold text-white bg-primary rounded-full">
        Create a project <IoRocketOutline className="w-6 h-6" />
      </button>
    </section>
  );
}
